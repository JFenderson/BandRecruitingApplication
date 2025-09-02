export interface UpdateInterestDTO {
  bandId: string;
  isInterested: boolean;
}


export interface InterestDTO {
  studentId: string;
  bandId: string;
  isInterested: boolean;
  createdAt: Date;
  updatedAt?: Date;
}