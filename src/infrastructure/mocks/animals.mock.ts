import type { Animal } from "@/domain/models/Animal";
import type { HomeAnimals } from "@/domain/models/HomeAnimals";

const heroAnimals: Animal[] = [
  {
    id: "hero-dog",
    name: "Loki",
    age: "3 años",
    breed: "Mestizo",
    gender: "Macho",
    type: "Perro",
    location: "Bogotá",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB-FMZCoqNPaZwQB0ueK456Vvb4GGqLccYKjZ8SEt8lPHeWKUJLYW0yOM9WC5nUiS5s3Y6T9eHjy3h9jR4eBtKv6wsmq-CDdvFcQgyXU5dj_P3MmbkP9_JwxFcLGHyJBtrnsrOX0dPKp7rFfzW3FMtWaqlGm60G2Zb9kTp2xoPQPhNXIJtilpeBKEIsOz-98aQnY3CbaB0CW7D0AZEuiCb-Q21-jdQ44uJUubU1I1jKG-53TlntAG5jkwn_XHgWohqBokfj6kIx_A",
    status: "Adopción",
    foundation: "Huella Activa",
  },
  {
    id: "hero-cat",
    name: "Mia",
    age: "2 años",
    breed: "Mestizo",
    gender: "Hembra",
    type: "Gato",
    location: "Medellín",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA4YsDXyc_NSPUYOMxgxYkKzGeZrnX-gcy-a-WSU-QmUCssrt-qMGmg65xn9sFvrto5WsGv30CxZHI-PUR991R4SnpWqHIwNEpI5N34w_wtELKMkFkNjV4_ljqymWJCq-q6IPJTT3SKERzgby-1mfdBiLB03Pa88U9LPgQ6S6tk-2I_brT4eKqnCW0pEgxS9-7wwA_GaepF-kADxPhG_jfablmltZheOtst3WlvAAvqLiyHoY5a_VkT9QjBweqRzRZWC_tDBzEX0A",
    status: "Apadrinamiento",
    foundation: "Vida Animal",
  },
];

const featuredAnimals: Animal[] = [
  {
    id: "max",
    name: "Max",
    age: "2 años",
    breed: "Golden Retriever",
    gender: "Macho",
    type: "Perro",
    location: "Bogotá",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAFsPnAyLGcnO3JtxHGGdZjQsFC8cOA9zHSo4bK3HT0FKtsMWMYYE1bq3Nbs4kBHo71WluLy6zJVjXyGB-YYk9oTOGjtrLAGKL0DUEQGR-52MEEIjobOOPHGY1Xaj-wuRgQzI9v7lEU0Fo4ZgVxs-urFqYhKU-TCgmjPbS7wwOr37f6nKK_w0ymp2X03DJIyxsZ-wK0eZEXq3Jx107x2kAI2ESX0yIjYl5dGJ3aX1FIDMO-lLb7_98y2bsp_1NYFnxi1stmtmNqow",
    status: "Adopción",
    foundation: "Huellitas",
  },
  {
    id: "luna",
    name: "Luna",
    age: "8 meses",
    breed: "Mestizo",
    gender: "Hembra",
    type: "Gato",
    location: "Medellín",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCKWTLinQycOjOip0dN9LKDLvc0XtPEESdRULvWJ6ZMBG6Sw-zhexj1TM3P8GzIVMF9kfjZQ9Yv4UHUEj3N4JrdTbjLnZhFnsbk2xroc4Iz-VzKtYr4ef3BBsHmp87bpDZ3_xYjstW5pXFNMkGZmgkJADUARcb0TZNincYZyF82LZkcHTmYVnafFXyrGu-KecewtRGrFkw9i0xUCwHPur9ptEmZHEc5addse47N0VlqIinFBzIN2JiUrT5N_zDVK34GoNasQbVe0Q",
    status: "Apadrinamiento",
    foundation: "Vida Animal",
  },
  {
    id: "rocky",
    name: "Rocky",
    age: "5 años",
    breed: "Bulldog Francés",
    gender: "Macho",
    type: "Perro",
    location: "Cali",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCJ8XA6zOI7rFHnGgp-lvUiJhtPQcHi0oFZb2Z4SZ4mt3b76VgRvsjFZogabngzaMTJTjTEbneXvqsovTIvC90vm4McA6M1h-aUL4prGsJTKmWr_f896vx-KCy5Pjzu81jzH-fncsfQfc53ExctMcxb8XjmmziptLH9xho89KrQ69Mq-HcY2_A91CcbVvL6zvqzNNhcG-xplsdjPNIGdGZ3veCA-60ih57ZKPWCLR7AjHkOws2Yjc2BqNamjbDgc3hv4W3Sd90ZDg",
    status: "Adopción",
    foundation: "Patitas Seguras",
  },
  {
    id: "mishi",
    name: "Mishi",
    age: "3 años",
    breed: "Persa",
    gender: "Macho",
    type: "Gato",
    location: "Bogotá",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAzanCwdMEkfLHzTEbfs7Kw49x7_nCyPOHQIHQkOZqNLDWzJ9ndt3FBdNETKniLJ9bhkHvvhHM59xZgVw_s4ERMV1Xh7LDkJPiTQOtd_QuqA7MZBRlNcpA--ndLzP6KFh3I50XUEDQLzKeCE6ThlDpMbvXVvcAQeLgM3uvPz9mRjLPQgB0gcntgNlNNC8fI-t1qXEvtPYkCQ2d32IsAi8TMMK1r5plh2yjtBko2XHPIF_WxGytwVk1DXgRI4uiI6TIP-eUkbsHrog",
    status: "Urgente",
    foundation: "Refugio Luz",
  },
];

export const animalsMock: HomeAnimals = {
  heroAnimals,
  featuredAnimals,
};
