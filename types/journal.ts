export type Journal = {
  id: string;
  title: string;     // 페이지명
  url: string;       // 외부 링크
  createdAt: number; // epoch millis
  updatedAt: number; // epoch millis
};