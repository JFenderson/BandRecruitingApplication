// student.model.ts
export interface StudentDTO {
profilePicture: any;
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  instrument: string;
  highSchool: string;
  videoUrl?: string;
  pictureUrl?: string;
  averageRating?: number; // computed on server or client
isInterestedInMyBand?: boolean;
}

export interface UpdateStudentDTO {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  instrument: string;
  highSchool: string;
  videoUrl?: string;

}