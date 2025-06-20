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