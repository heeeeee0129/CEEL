// types/gallery.ts
export type GalleryCategory =
  | "Lab Dining"
  | "Vacation Trip"
  | "Membership Training"
  | "Celebration"
  | "Conferences"
  | "Meeting";

export type GalleryItem = {
  id: string;
  title: string;
  date: string; // "YYYY-MM-DD"
  photos: string[]; // storage URL 배열
  categories: GalleryCategory[]; // 해시태그 카테고리
  author?: string;
  createdAt?: string; // ISO
  updatedAt?: string; // ISO
};