import { useCallback } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";

interface AdoptSearchParams {
  search?: string;
  species?: string;
  location?: string;
}

export function useHomeNavigation() {
  const router = useRouter();
  const locale = useLocale();

  const goToAdopt = useCallback(
    ({ search, species, location }: AdoptSearchParams) => {
      const params = new URLSearchParams();

      if (search?.trim()) {
        params.set("search", search.trim());
      }

      if (species?.trim()) {
        params.set("species", species.trim());
      }

      if (location?.trim()) {
        params.set("location", location.trim());
      }

      const queryString = params.toString();
      const target = queryString ? `/${locale}/adopt?${queryString}` : `/${locale}/adopt`;

      router.push(target);
    },
    [locale, router],
  );

  const goToAdoptDetail = useCallback(
    (animalId: number) => {
      router.push(`/${locale}/adopt/${animalId}`);
    },
    [locale, router],
  );

  const goToShop = useCallback(() => {
    router.push(`/${locale}/shop`);
  }, [locale, router]);

  const goToShopDetail = useCallback(
    (productId: number) => {
      router.push(`/${locale}/shop/${productId}`);
    },
    [locale, router],
  );

  return {
    goToAdopt,
    goToAdoptDetail,
    goToShop,
    goToShopDetail,
  };
}
