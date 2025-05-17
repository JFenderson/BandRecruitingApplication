export interface CreateInterestDTO {
  interestId: number;
  studentId?: string;
  bandId: string;
}

export interface InterestDTO {
  interestId: number;
  studentId?: string;
  studentName?: string;
  bandId: string;
  bandName?: string;
  schoolName?: string;
  interestDate: string;
}