import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { CreateOfferDTO, OfferDTO, UpdateOfferDTO } from "../models/offer.model";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class OfferService {
  constructor(private api: ApiService) {}

  getAllOffers() {
    return this.api.get<OfferDTO[]>('api/Offer');
  }

  getOfferById(id: number) {
    return this.api.get<OfferDTO>(`api/Offer/${id}`);
  }

  getOffersByStudent(studentId: string) {
    return this.api.get<OfferDTO[]>(`api/Offer/student/${studentId}`);
  }

  getOffersByRecruiter(recruiterId: string) {
    return this.api.get<OfferDTO[]>(`api/Offer/recruiter/${recruiterId}/offers`);
  }

  createOffer(recruiterId: string, studentId: string, data: any) {
    return this.api.post<CreateOfferDTO>(`api/Offer/recruiter/${recruiterId}/student/${studentId}/offers`, data);
  }

  updateOfferAmount(offerId: string, amount: number) {
    return this.api.put<UpdateOfferDTO>(`api/Offer/${offerId}/offers?offerAmount=${amount}`, {});
  }

  deleteOffer(offerId: string) {
    return this.api.delete<any>(`api/Offer/${offerId}`);
  }

  acceptOffer(offerId: string, studentId: string) {
    return this.api.post<UpdateOfferDTO>(`api/Offer/${offerId}/student/${studentId}/accept`, {});
  }

  declineOffer(offerId: string, studentId: string) {
    return this.api.post<UpdateOfferDTO>(`api/Offer/${offerId}/student/${studentId}/decline`, {});
  }

    getByStudent(studentId: string): Observable<OfferDTO[]> {
    return this.api.get<OfferDTO[]>(`students/${studentId}/scholarshipoffers`);
  }

  send(offer: OfferDTO): Observable<OfferDTO> {
    return this.api.post<OfferDTO>(`scholarshipoffers`, offer);
  }
}