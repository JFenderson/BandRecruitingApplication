export interface BandDTO {
  bandId: string;
  name?: string;
  schoolName?: string;
  city?: string;
  state?: string;
  division?: string;
  conference?: string;
  recruiterCount?: number;
}

export interface CreateBandDTO {
  name?: string;
  schoolName?: string;
  city?: string;
  state?: string;
  conference?: string;
  division?: string;
}

export interface UpdateBandDTO extends CreateBandDTO {
  bandId: string;
}