export interface VideoDTO {
  videoId: string;
  studentId: string;
  videoUrl: string;
  title: string;
  description?: string;
  createdAt: Date;
}

export interface AddVideoDTO {
  studentId: string;
  videoUrl: string;
  title: string;
  description?: string;
}
