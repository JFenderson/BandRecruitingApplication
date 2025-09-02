export interface OfferDTO {
schoolName: any;
bandName: any;
    offerId: string;
    studentId: string;
    recruiterId: string;
    bandId: string;
    Amount: string;
    status: string;
    offerDate: string;
}

export interface CreateOfferDTO {
    offerId: string;
    studentId: string;
    recruiterId: string;
    bandId: string;
    bandName: string;
    schoolName: string;
    Amount: string;
    status: string;
    offerDate: string;
}

export interface UpdateOfferDTO {
    offerId: string;
    studentId: string;
    recruiterId: string;
    bandId: string;
    bandName: string;
    Amount: string;
    status: string;
    offerDate: string;
}

