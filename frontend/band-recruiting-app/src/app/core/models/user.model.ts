import { BandDTO } from "./band.model";
import { Interest } from "./interest.model";
import { OfferDTO } from "./offer.model";
import { Rating } from "./rating.model";

export interface UserDTO {
  id: string;
  email: string;
  password: string;
  userType: 'Student' | 'Recruiter' | 'Admin';
  firstName: string;
  lastName: string;
  phone: string;

  // Student fields
  instrument?: string;
  highSchool?: string;
  graduationYear?: number;
  profilePicture: string;

  // Recruiter field
  bandId?: string;
  band?: BandDTO; // You can create a Band model later if needed

  // Calculated fields
  averageRating?: number;
  offerCount: number;

  offersMade: OfferDTO[];
  comments: Comment[];
  ratings: Rating[];
  interests: Interest[];
}

export interface CreateUserDTO {
  email: string;
  password: string;
  userType: 'Student' | 'Recruiter' | 'Admin';
  firstName: string;
  lastName: string;
  phone: string;
  instrument?: string;
  highSchool?: string;
  profilePicture?: string;
  graduationYear?: number;
  bandId?: string;
  userName: string;
}

export interface UpdateUserDTO {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  instrument?: string;
  phone?: string;
  profilePicture?: string;
  highSchool?: string;
  graduationYear?: number;
  bandId?: string;
}
