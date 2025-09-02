import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { CreateOfferDTO, OfferDTO, UpdateOfferDTO } from "../models/offer.model";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class OfferService {
  constructor(private api: ApiService) {}

  getAllOffers() {
    return this.api.get<OfferDTO[]>('offers');
  }

  getOfferById(id: number) {
    return this.api.get<OfferDTO>(`offers/${id}`);
  }

  getOffersByStudent(studentId: string) {
    return this.api.get<OfferDTO[]>(`offers/student/${studentId}`);
  }

  getOffersByRecruiter(recruiterId: string) {
    return this.api.get<OfferDTO[]>(`offers/recruiter/${recruiterId}/offers`);
  }

  createOffer(recruiterId: string, studentId: string, data: any) {
    return this.api.post<CreateOfferDTO>(`offers/recruiter/${recruiterId}/student/${studentId}/offers`, data);
  }

  updateOfferAmount(offerId: string, amount: number) {
    return this.api.put<UpdateOfferDTO>(`offers/${offerId}/offers?offerAmount=${amount}`, {});
  }

  deleteOffer(offerId: string) {
    return this.api.delete<any>(`offers/${offerId}`);
  }

  acceptOffer(offerId: string, studentId: string) {
    return this.api.post<UpdateOfferDTO>(`offers/${offerId}/student/${studentId}/accept`, {});
  }

  declineOffer(offerId: string, studentId: string) {
    return this.api.post<UpdateOfferDTO>(`offers/${offerId}/student/${studentId}/decline`, {});
  }

    getByStudent(studentId: string): Observable<OfferDTO[]> {
    return this.api.get<OfferDTO[]>(`students/${studentId}/scholarshipoffers`);
  }

  send(offer: OfferDTO): Observable<OfferDTO> {
    return this.api.post<OfferDTO>(`scholarshipoffers`, offer);
  }
}