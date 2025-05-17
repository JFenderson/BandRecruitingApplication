

export interface RatingDTO {
  ratingId?: string;
  videoId?: string;
  studentId?: string;
  recruiterId?: string;
  recruiterName?: string;
  score: number;
  ratingDate: string;
}

export interface AddRatingDTO {
  ratingId?: string;
  score: number;
  ratingDate: string;
  recruiterId?: string;
  comment?: string;
  videoId?: string;
}
