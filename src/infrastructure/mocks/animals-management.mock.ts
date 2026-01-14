export type AnimalManagementSpecies = "dog" | "cat" | "bird" | "other";

export type AnimalManagementStatus = "available" | "adopted" | "pending" | "in_treatment" | "inactive";

export type AnimalManagementSex = "male" | "female" | "unknown";

export type AnimalManagementSize = "small" | "medium" | "large" | "unknown";

export interface AnimalManagement {
  id: number;
  name: string;
  species: AnimalManagementSpecies;
  breed: string;
  sex: AnimalManagementSex;
  age_months: number | null;
  size: AnimalManagementSize;
  status: AnimalManagementStatus;
  cover_image_url: string | null;
  created_at: string;
}

export const animalsManagementMock: AnimalManagement[] = [
  {
    id: 2309,
    name: "Buddy",
    species: "dog",
    breed: "Golden Retriever",
    sex: "male",
    age_months: 24,
    size: "large",
    status: "available",
    cover_image_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB-FMZCoqNPaZwQB0ueK456Vvb4GGqLccYKjZ8SEt8lPHeWKUJLYW0yOM9WC5nUiS5s3Y6T9eHjy3h9jR4eBtKv6wsmq-CDdvFcQgyXU5dj_P3MmbkP9_JwxFcLGHyJBtrnsrOX0dPKp7rFfzW3FMtWaqlGm60G2Zb9kTp2xoPQPhNXIJtilpeBKEIsOz-98aQnY3CbaB0CW7D0AZEuiCb-Q21-jdQ44uJUubU1I1jKG-53TlntAG5jkwn_XHgWohqBokfj6kIx_A",
    created_at: "2023-10-12T00:00:00.000Z",
  },
  {
    id: 1045,
    name: "Mia",
    species: "cat",
    breed: "Mixed",
    sex: "female",
    age_months: 18,
    size: "small",
    status: "pending",
    cover_image_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA4YsDXyc_NSPUYOMxgxYkKzGeZrnX-gcy-a-WSU-QmUCssrt-qMGmg65xn9sFvrto5WsGv30CxZHI-PUR991R4SnpWqHIwNEpI5N34w_wtELKMkFkNjV4_ljqymWJCq-q6IPJTT3SKERzgby-1mfdBiLB03Pa88U9LPgQ6S6tk-2I_brT4eKqnCW0pEgxS9-7wwA_GaepF-kADxPhG_jfablmltZheOtst3WlvAAvqLiyHoY5a_VkT9QjBweqRzRZWC_tDBzEX0A",
    created_at: "2023-09-03T00:00:00.000Z",
  },
  {
    id: 7812,
    name: "Rocky",
    species: "dog",
    breed: "French Bulldog",
    sex: "male",
    age_months: 60,
    size: "medium",
    status: "adopted",
    cover_image_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCJ8XA6zOI7rFHnGgp-lvUiJhtPQcHi0oFZb2Z4SZ4mt3b76VgRvsjFZogabngzaMTJTjTEbneXvqsovTIvC90vm4McA6M1h-aUL4prGsJTKmWr_f896vx-KCy5Pjzu81jzH-fncsfQfc53ExctMcxb8XjmmziptLH9xho89KrQ69Mq-HcY2_A91CcbVvL6zvqzNNhcG-xplsdjPNIGdGZ3veCA-60ih57ZKPWCLR7AjHkOws2Yjc2BqNamjbDgc3hv4W3Sd90ZDg",
    created_at: "2023-07-19T00:00:00.000Z",
  },
  {
    id: 9921,
    name: "Luna",
    species: "cat",
    breed: "Siamese",
    sex: "female",
    age_months: 10,
    size: "small",
    status: "available",
    cover_image_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCKWTLinQycOjOip0dN9LKDLvc0XtPEESdRULvWJ6ZMBG6Sw-zhexj1TM3P8GzIVMF9kfjZQ9Yv4UHUEj3N4JrdTbjLnZhFnsbk2xroc4Iz-VzKtYr4ef3BBsHmp87bpDZ3_xYjstW5pXFNMkGZmgkJADUARcb0TZNincYZyF82LZkcHTmYVnafFXyrGu-KecewtRGrFkw9i0xUCwHPur9ptEmZHEc5addse47N0VlqIinFBzIN2JiUrT5N_zDVK34GoNasQbVe0Q",
    created_at: "2023-10-02T00:00:00.000Z",
  },
  {
    id: 5504,
    name: "Kiwi",
    species: "bird",
    breed: "Parakeet",
    sex: "unknown",
    age_months: 8,
    size: "small",
    status: "in_treatment",
    cover_image_url: null,
    created_at: "2023-08-24T00:00:00.000Z",
  },
  {
    id: 4137,
    name: "Nala",
    species: "dog",
    breed: "Mixed",
    sex: "female",
    age_months: 36,
    size: "medium",
    status: "inactive",
    cover_image_url: null,
    created_at: "2023-06-11T00:00:00.000Z",
  },
  {
    id: 2701,
    name: "Max",
    species: "dog",
    breed: "Labrador Retriever",
    sex: "male",
    age_months: 30,
    size: "large",
    status: "available",
    cover_image_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAFsPnAyLGcnO3JtxHGGdZjQsFC8cOA9zHSo4bK3HT0FKtsMWMYYE1bq3Nbs4kBHo71WluLy6zJVjXyGB-YYk9oTOGjtrLAGKL0DUEQGR-52MEEIjobOOPHGY1Xaj-wuRgQzI9v7lEU0Fo4ZgVxs-urFqYhKU-TCgmjPbS7wwOr37f6nKK_w0ymp2X03DJIyxsZ-wK0eZEXq3Jx107x2kAI2ESX0yIjYl5dGJ3aX1FIDMO-lLb7_98y2bsp_1NYFnxi1stmtmNqow",
    created_at: "2023-11-08T00:00:00.000Z",
  },
  {
    id: 6089,
    name: "Bella",
    species: "cat",
    breed: "Persian",
    sex: "female",
    age_months: 48,
    size: "small",
    status: "adopted",
    cover_image_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAzanCwdMEkfLHzTEbfs7Kw49x7_nCyPOHQIHQkOZqNLDWzJ9ndt3FBdNETKniLJ9bhkHvvhHM59xZgVw_s4ERMV1Xh7LDkJPiTQOtd_QuqA7MZBRlNcpA--ndLzP6KFh3I50XUEDQLzKeCE6ThlDpMbvXVvcAQeLgM3uvPz9mRjLPQgB0gcntgNlNNC8fI-t1qXEvtPYkCQ2d32IsAi8TMMK1r5plh2yjtBko2XHPIF_WxGytwVk1DXgRI4uiI6TIP-eUkbsHrog",
    created_at: "2023-05-22T00:00:00.000Z",
  },
  {
    id: 1190,
    name: "Charlie",
    species: "dog",
    breed: "Beagle",
    sex: "male",
    age_months: 20,
    size: "medium",
    status: "pending",
    cover_image_url: null,
    created_at: "2023-12-01T00:00:00.000Z",
  },
  {
    id: 8456,
    name: "Daisy",
    species: "other",
    breed: "Rabbit (Mini Lop)",
    sex: "female",
    age_months: 14,
    size: "small",
    status: "available",
    cover_image_url: null,
    created_at: "2023-04-09T00:00:00.000Z",
  },
  {
    id: 3320,
    name: "Coco",
    species: "bird",
    breed: "Cockatiel",
    sex: "unknown",
    age_months: 28,
    size: "small",
    status: "inactive",
    cover_image_url: null,
    created_at: "2023-03-15T00:00:00.000Z",
  },
  {
    id: 7155,
    name: "Oliver",
    species: "cat",
    breed: "Maine Coon",
    sex: "male",
    age_months: 26,
    size: "medium",
    status: "in_treatment",
    cover_image_url: null,
    created_at: "2023-02-18T00:00:00.000Z",
  },
  {
    id: 4823,
    name: "Simba",
    species: "dog",
    breed: "German Shepherd",
    sex: "male",
    age_months: 42,
    size: "large",
    status: "available",
    cover_image_url: null,
    created_at: "2023-01-30T00:00:00.000Z",
  },
  {
    id: 9044,
    name: "Molly",
    species: "cat",
    breed: "British Shorthair",
    sex: "female",
    age_months: 34,
    size: "small",
    status: "adopted",
    cover_image_url: null,
    created_at: "2023-11-18T00:00:00.000Z",
  },
];

