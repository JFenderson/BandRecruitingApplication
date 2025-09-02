import { BandDTO } from "./band.model";
import { CommentDTO } from "./comment.model";
import { InterestDTO } from "./interest.model";
import { OfferDTO } from "./offer.model";
import { RatingDTO } from "./rating.model";
import { VideoDTO } from "./video.model";

export type UserRole = 'Student' | 'Recruiter' | 'Admin';

export interface UserDTO {
  id: string;
  email: string;
  userType: UserRole;
  firstName: string;
  lastName: string;
  phone: string;
  profilePicture?: string;
  createdAt: string;

  // Student-specific fields (flat, not nested)
  instrument?: string;
  highSchool?: string;
  graduationYear?: number;

  // Recruiter-specific fields
  bandId?: string;
  band?: BandDTO;

  // Calculated fields
  averageRating?: number;
  offerCount?: number;

  // Related data (optional, for detailed views)
  interests?: InterestDTO[];
  scholarshipOffers?: OfferDTO[];
  videos?: VideoDTO[];
  ratingsReceived?: RatingDTO[];
  commentsGiven?: CommentDTO[];
}

// Simplified create payload
export interface CreateUserDTO {
  email: string;
  password: string;
  userType: UserRole;
  firstName: string;
  lastName: string;
  phone: string;

  // Optional role-specific fields
  instrument?: string;
  highSchool?: string;
  graduationYear?: number;
  bandId?: string;
}

export interface UpdateUserDTO {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  profilePicture?: string;
  instrument?: string;
  highSchool?: string;
  graduationYear?: number;
  bandId?: string;
}