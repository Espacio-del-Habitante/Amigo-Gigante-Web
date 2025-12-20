export type AnimalStatus = "Adopción" | "Apadrinamiento" | "Urgente";

export interface Animal {
  id: string;
  name: string;
  age: string;
  breed: string;
  gender: "Macho" | "Hembra";
  type: "Perro" | "Gato";
  location: string;
  imageUrl: string;
  status: AnimalStatus;
  foundation: string;
}
