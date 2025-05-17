import { BandDTO } from "./band.model";
import { CommentDTO } from "./comment.model";
import { InterestDTO } from "./interest.model";
import { OfferDTO } from "./offer.model";
import { RatingDTO } from "./rating.model";
import { VideoDTO } from "./video.model";

export interface UserDTO {
    id: string;
    email: string;
    password: string;
    userType: 'Student' | 'Recruiter' | 'Admin';
    firstName?: string;
    lastName?: string;
    phone?: string;

    // Student fields
    instrument?: string;
    highSchool?: string;
    graduationYear?: number;
    profilePicture?: string;

    // Recruiter field
    bandId?: string;

    // Calculated fields
    averageRating?: number;
    offerCount: number;

    offersMade?: OfferDTO[];
    comments?: Comment[];
    ratings?: RatingDTO[];
    ratingsGiven?: RatingDTO[];
    scholarshipOffers?: OfferDTO[];
    interests?: InterestDTO[];
    videos?: VideoDTO[];
    commentsGiven?: CommentDTO[];

    createdAt: string;
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
