export interface BandDTO {
    bandId: string;
    name: string;
    schoolName: string;
    city: string;
    state: string;
    conference: string;
    division: string;

}
export interface UpdateBandDTO {
    bandId: string;
    name: string;
    schoolName: string;
    city: string;
    state: string;
    conference: string;
    division: string;

}
export interface CreateBandDTO {
    name: string;
    schoolName: string;
    city: string;
    state: string;
    conference: string;
    division: string;

}