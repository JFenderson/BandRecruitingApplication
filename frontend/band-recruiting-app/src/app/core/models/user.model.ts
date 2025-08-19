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

    // Student fields
  
    profilePicture?: string;

    // Recruiter field

    // Calculated fields
    averageRating?: number;
    offerCount?: number;

  student?: {
      instrument?: string;
    highSchool?: string;
    graduationYear?: number;
    ratings?: RatingDTO[];
    videos?: VideoDTO[];
    interests?: InterestDTO[];

  } | null;

  recruiter?: {
    bandId?: string;
     offersMade?: OfferDTO[];
    comments?: Comment[];
    ratingsGiven?: RatingDTO[];
    scholarshipOffers?: OfferDTO[];
    commentsGiven?: CommentDTO[];
  } | null;

    createdAt: string;
}

export type CreateUserPayload =
  Pick<UserDTO, 'email' | 'userType' | 'firstName' | 'lastName' | 'phone' > &
  Partial<{
    student: { instrument?: string; highSchool?: string; graduationYear?: number; };
    recruiter: { bandId?: string; };
    admin: Record<string, never>;
  }>;

// export interface CreateUserDTO {
//     email: string;
//     password: string;
//     userType: 'Student' | 'Recruiter' | 'Admin';
//     firstName: string;
//     lastName: string;
//     phone: string;
//     instrument?: string;
//     highSchool?: string;
//     profilePicture?: string;
//     graduationYear?: number;
//     bandId?: string;
//     userName: string;
// }

export interface UpdateUserDTO {
    email?: string;
    firstName?: string;
    lastName?: string;
    instrument?: string;
    phone?: string;
    profilePicture?: string;
    highSchool?: string;
    graduationYear?: number;
    bandId?: string;
}
