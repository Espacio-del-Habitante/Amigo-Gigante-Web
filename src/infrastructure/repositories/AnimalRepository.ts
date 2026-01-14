import type { AdoptCatalogItem } from "@/domain/models/AdoptCatalogItem";
import type { AdoptDetail } from "@/domain/models/AdoptDetail";
import type { AnimalManagement } from "@/domain/models/AnimalManagement";
import type { IAnimalRepository } from "@/domain/repositories/IAnimalRepository";
import { animalsMock } from "@/infrastructure/mocks/animals.mock";
import { supabaseClient } from "@/infrastructure/config/supabase";

export class AnimalRepository implements IAnimalRepository {
  async getHomeAnimals() {
    return animalsMock;
  }

  async getAdoptCatalog({ filters, pagination }: Parameters<IAnimalRepository["getAdoptCatalog"]>[0]) {
    const pageSize = pagination.pageSize;
    const from = Math.max(0, (pagination.page - 1) * pageSize);
    const to = from + pageSize - 1;

    let query = supabaseClient
      .from("animals")
      .select(
        "id, name, species, breed, sex, age_months, size, description, cover_image_url, created_at",
        { count: "exact" },
      )
      .eq("status", "available")
      .eq("is_published", true);

    if (filters?.species) {
      query = query.eq("species", filters.species);
    }

    if (filters?.size) {
      query = query.eq("size", filters.size);
    }

    if (filters?.age) {
      if (filters.age === "puppy") query = query.gte("age_months", 0).lte("age_months", 11);
      if (filters.age === "young") query = query.gte("age_months", 12).lte("age_months", 35);
      if (filters.age === "adult") query = query.gte("age_months", 36).lte("age_months", 83);
      if (filters.age === "senior") query = query.gte("age_months", 84);
    }

    const sort = filters?.sort ?? "newest";
    const urgentEnabled = Boolean(filters?.urgentOnly) || sort === "urgent";

    const rawSearch = filters?.search?.trim() ?? "";
    const hasSearch = rawSearch.length > 0;
    const searchLike = `%${rawSearch}%`;

    const urgentCutoffDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
    const urgentCreatedAtExpr = `created_at.lte.${urgentCutoffDate}`;
    const urgentAgeExpr = "age_months.lte.6";
    const nameExpr = `name.ilike.${searchLike}`;
    const breedExpr = `breed.ilike.${searchLike}`;

    const orParts: string[] = [];
    if (urgentEnabled && hasSearch) {
      orParts.push(`and(${urgentCreatedAtExpr},${nameExpr})`);
      orParts.push(`and(${urgentCreatedAtExpr},${breedExpr})`);
      orParts.push(`and(${urgentAgeExpr},${nameExpr})`);
      orParts.push(`and(${urgentAgeExpr},${breedExpr})`);
    } else if (urgentEnabled) {
      orParts.push(urgentCreatedAtExpr, urgentAgeExpr);
    } else if (hasSearch) {
      orParts.push(nameExpr, breedExpr);
    }

    if (orParts.length > 0) {
      query = query.or(orParts.join(","));
    }

    if (sort === "oldest" || sort === "urgent") query = query.order("created_at", { ascending: true });
    if (sort === "newest") query = query.order("created_at", { ascending: false });

    const { data, error, count } = await query.range(from, to);

    if (error) {
      throw new Error(this.translateAnimalsError(error));
    }

    const items = (data ?? []).map((row) => ({
      id: row.id,
      name: row.name ?? "",
      species: row.species,
      breed: row.breed ?? "",
      sex: row.sex ?? "unknown",
      ageMonths: row.age_months ?? null,
      size: row.size ?? "unknown",
      description: row.description ?? "",
      coverImageUrl: row.cover_image_url ?? null,
      createdAt: row.created_at,
      isUrgent: this.isUrgentNeed(row.created_at, row.age_months ?? null),
    }));

    const itemsWithPhotos = await this.attachCoverPhotoFallback(items);

    return {
      items: itemsWithPhotos,
      total: count ?? 0,
    };
  }

  async getAdoptDetail(id: number): Promise<AdoptDetail> {
    const { data, error } = await supabaseClient
      .from("animals")
      .select("id, name, species, breed, sex, age_months, size, status, description, cover_image_url")
      .eq("id", id)
      .eq("is_published", true)
      .maybeSingle();

    if (error) {
      throw new Error(this.translateAnimalsError(error));
    }

    if (!data) {
      throw new Error("errors.notFound");
    }

    const { data: photosData, error: photosError } = await supabaseClient
      .from("animal_photos")
      .select("url, sort_order")
      .eq("animal_id", id)
      .order("sort_order", { ascending: true });

    if (photosError) {
      throw new Error(this.translateAnimalsError(photosError));
    }

    const photos = (photosData ?? [])
      .map((photo) => ({
        url: photo.url ?? "",
        sortOrder: photo.sort_order ?? 0,
      }))
      .filter((photo) => Boolean(photo.url));

    return {
      id: data.id,
      name: data.name ?? "",
      species: this.normalizeAdoptSpecies(data.species),
      breed: data.breed ?? "",
      sex: this.normalizeAdoptSex(data.sex),
      ageMonths: data.age_months ?? null,
      size: this.normalizeAdoptSize(data.size),
      status: this.normalizeAdoptStatus(data.status),
      description: data.description ?? "",
      coverImageUrl: data.cover_image_url ?? null,
      photos,
    };
  }

  async getRelatedAnimals(animalId: number, limit: number): Promise<AdoptCatalogItem[]> {
    if (!Number.isFinite(limit) || limit <= 0) return [];

    const { data, error } = await supabaseClient
      .from("animals")
      .select("id, name, species, breed, sex, age_months, size, description, cover_image_url, created_at")
      .eq("status", "available")
      .eq("is_published", true)
      .neq("id", animalId)
      .limit(limit);

    if (error) {
      throw new Error(this.translateAnimalsError(error));
    }

    const items = (data ?? []).map((row) => ({
      id: row.id,
      name: row.name ?? "",
      species: this.normalizeAdoptSpecies(row.species),
      breed: row.breed ?? "",
      sex: this.normalizeAdoptSex(row.sex),
      ageMonths: row.age_months ?? null,
      size: this.normalizeAdoptSize(row.size),
      description: row.description ?? "",
      coverImageUrl: row.cover_image_url ?? null,
      createdAt: row.created_at,
      isUrgent: this.isUrgentNeed(row.created_at, row.age_months ?? null),
    }));

    return this.attachCoverPhotoFallback(items);
  }

  async createAnimal({
    foundationId,
    name,
    species,
    breed,
    sex,
    ageMonths,
    size,
    status,
    description,
    coverImageUrl,
    isPublished,
  }: Parameters<IAnimalRepository["createAnimal"]>[0]) {
    const { data, error } = await supabaseClient
      .from("animals")
      .insert({
        foundation_id: foundationId,
        name,
        species,
        breed: breed ?? null,
        sex,
        age_months: ageMonths,
        size,
        status,
        description,
        cover_image_url: coverImageUrl ?? null,
        is_published: isPublished,
      })
      .select("id, name, species, breed, sex, age_months, size, status, cover_image_url, created_at")
      .single();

    if (error) {
      throw new Error(this.translateAnimalsError(error));
    }

    if (!data) {
      throw new Error("errors.generic");
    }

    return {
      id: data.id,
      name: data.name ?? "",
      species: data.species,
      breed: data.breed ?? "",
      sex: data.sex ?? "unknown",
      ageMonths: data.age_months ?? null,
      size: data.size ?? "unknown",
      status: data.status,
      coverImageUrl: data.cover_image_url ?? null,
      createdAt: data.created_at,
    };
  }

  async createAnimalPhotos(params: Parameters<IAnimalRepository["createAnimalPhotos"]>[0]) {
    if (params.length === 0) return;

    const { error } = await supabaseClient
      .from("animal_photos")
      .insert(
        params.map((photo) => ({
          animal_id: photo.animalId,
          url: photo.url,
          sort_order: photo.sortOrder,
        })),
      );

    if (error) {
      throw new Error(this.translateAnimalsError(error));
    }
  }

  async getAnimals({ foundationId, filters, pagination }: Parameters<IAnimalRepository["getAnimals"]>[0]) {
    const pageSize = pagination.pageSize;
    const from = Math.max(0, (pagination.page - 1) * pageSize);
    const to = from + pageSize - 1;

    let query = supabaseClient
      .from("animals")
      .select(
        "id, name, species, breed, sex, age_months, size, status, cover_image_url, created_at",
        { count: "exact" },
      )
      .eq("foundation_id", foundationId);

    if (filters?.status) {
      query = query.eq("status", filters.status);
    }

    if (filters?.species) {
      query = query.eq("species", filters.species);
    }

    if (filters?.search) {
      const raw = filters.search.trim();
      if (raw.length > 0) {
        const normalized = raw.toLowerCase();
        const parsedId = this.parseAnimalIdToNumber(normalized);
        const like = `%${raw}%`;

        const orParts = [`name.ilike.${like}`, `breed.ilike.${like}`];
        if (parsedId !== null) {
          orParts.push(`id.eq.${parsedId}`);
        }

        query = query.or(orParts.join(","));
      }
    }

    const sort = filters?.sort ?? "newest";
    if (sort === "newest") query = query.order("created_at", { ascending: false });
    if (sort === "oldest") query = query.order("created_at", { ascending: true });
    if (sort === "nameAsc") query = query.order("name", { ascending: true });
    if (sort === "nameDesc") query = query.order("name", { ascending: false });

    const { data, error, count } = await query.range(from, to);

    if (error) {
      throw new Error(this.translateAnimalsError(error));
    }

    const animals = (data ?? []).map((row) => ({
      id: row.id,
      name: row.name ?? "",
      species: row.species,
      breed: row.breed ?? "",
      sex: row.sex ?? "unknown",
      ageMonths: row.age_months ?? null,
      size: row.size ?? "unknown",
      status: row.status,
      coverImageUrl: row.cover_image_url ?? null,
      createdAt: row.created_at,
    }));

    const animalsWithPhotos = await this.attachCoverPhotoFallback(animals);

    return {
      animals: animalsWithPhotos,
      total: count ?? 0,
    };
  }

  async getAnimalsCount(foundationId: string): Promise<number> {
    const { count, error } = await supabaseClient
      .from("animals")
      .select("id", { count: "exact", head: true })
      .eq("foundation_id", foundationId);

    if (error) {
      throw new Error(this.translateAnimalsError(error));
    }

    return count ?? 0;
  }

  async getRecentAnimals(foundationId: string, limit: number): Promise<AnimalManagement[]> {
    const { data, error } = await supabaseClient
      .from("animals")
      .select("id, name, species, breed, sex, age_months, size, status, cover_image_url, created_at")
      .eq("foundation_id", foundationId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(this.translateAnimalsError(error));
    }

    const animals = (data ?? []).map((row) => this.mapAnimalManagementRow(row));
    return this.attachCoverPhotoFallback(animals);
  }

  async getAnimalsInTreatment(foundationId: string): Promise<AnimalManagement[]> {
    const { data, error } = await supabaseClient
      .from("animals")
      .select("id, name, species, breed, sex, age_months, size, status, cover_image_url, created_at")
      .eq("foundation_id", foundationId)
      .eq("status", "in_treatment")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(this.translateAnimalsError(error));
    }

    const animals = (data ?? []).map((row) => this.mapAnimalManagementRow(row));
    return this.attachCoverPhotoFallback(animals);
  }

  private async attachCoverPhotoFallback<T extends { id: number; coverImageUrl: string | null }>(animals: T[]): Promise<T[]> {
    const missingCover = animals.filter((animal) => !animal.coverImageUrl);
    if (missingCover.length === 0) return animals;

    const ids = missingCover.map((animal) => animal.id);

    const { data, error } = await supabaseClient
      .from("animal_photos")
      .select("animal_id, url, sort_order")
      .in("animal_id", ids)
      .order("sort_order", { ascending: true });

    if (error) {
      // Si falla la consulta de fotos, devolver los animales tal cual (cover opcional).
      return animals;
    }

    const firstPhotoByAnimalId = new Map<number, string>();
    for (const row of data ?? []) {
      const animalId = row.animal_id as number | undefined;
      const url = row.url as string | undefined;
      if (!animalId || !url) continue;
      if (!firstPhotoByAnimalId.has(animalId)) {
        firstPhotoByAnimalId.set(animalId, url);
      }
    }

    return animals.map((animal) => {
      if (animal.coverImageUrl) return animal;
      const fallback = firstPhotoByAnimalId.get(animal.id) ?? null;
      if (!fallback) return animal;
      return { ...animal, coverImageUrl: fallback };
    });
  }

  private isUrgentNeed(createdAt: string, ageMonths: number | null): boolean {
    const isPuppy = typeof ageMonths === "number" && ageMonths <= 6;
    const createdMs = new Date(createdAt).getTime();
    if (!Number.isFinite(createdMs)) return isPuppy;
    const cutoffMs = Date.now() - 90 * 24 * 60 * 60 * 1000;
    return createdMs <= cutoffMs || isPuppy;
  }

  private normalizeAdoptSpecies(value: string | null): AdoptCatalogItem["species"] {
    if (value === "dog" || value === "cat" || value === "other") {
      return value;
    }
    return "other";
  }

  private normalizeAdoptSex(value: string | null): AdoptCatalogItem["sex"] {
    if (value === "male" || value === "female") {
      return value;
    }
    return "unknown";
  }

  private normalizeAdoptSize(value: string | null): AdoptCatalogItem["size"] {
    if (value === "small" || value === "medium" || value === "large") {
      return value;
    }
    return "unknown";
  }

  private normalizeAdoptStatus(value: string | null): AdoptDetail["status"] {
    if (value === "available" || value === "adopted" || value === "pending" || value === "in_treatment" || value === "inactive") {
      return value;
    }
    return "available";
  }

  private parseAnimalIdToNumber(search: string): number | null {
    const cleaned = search.replace("#", "");
    const agMatch = cleaned.match(/ag-(\d{1,})/i);
    if (agMatch?.[1]) {
      const parsed = Number(agMatch[1]);
      return Number.isFinite(parsed) ? parsed : null;
    }

    const digits = cleaned.match(/\d{1,}/);
    if (digits?.[0]) {
      const parsed = Number(digits[0]);
      return Number.isFinite(parsed) ? parsed : null;
    }

    return null;
  }

  private mapAnimalManagementRow(row: {
    id: number;
    name: string | null;
    species: AnimalManagement["species"];
    breed: string | null;
    sex: AnimalManagement["sex"] | null;
    age_months: number | null;
    size: AnimalManagement["size"] | null;
    status: AnimalManagement["status"];
    cover_image_url: string | null;
    created_at: string;
  }): AnimalManagement {
    return {
      id: row.id,
      name: row.name ?? "",
      species: row.species,
      breed: row.breed ?? "",
      sex: row.sex ?? "unknown",
      ageMonths: row.age_months ?? null,
      size: row.size ?? "unknown",
      status: row.status,
      coverImageUrl: row.cover_image_url ?? null,
      createdAt: row.created_at,
    };
  }

  private translateAnimalsError(error: { message?: string }): string {
    const message = error.message?.toLowerCase?.() ?? "";

    if (message.includes("permission") || message.includes("row level")) {
      return "errors.unauthorized";
    }

    if (message.includes("connection") || message.includes("network")) {
      return "errors.connection";
    }

    return "errors.generic";
  }
}
