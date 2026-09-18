import api from "./client";
import { PagedResponse } from "@/types/api";
import {
  BookingResponse,
  BookingStatus,
  CancelBookingRequest,
  CreateBookingRequest,
  RejectBookingRequest,
} from "@/types/booking";

export const bookingApi = {
  create: (data: CreateBookingRequest) =>
    api.post<BookingResponse>("/api/v1/bookings", data),

  list: (params?: { status?: BookingStatus; page?: number; size?: number }) =>
    api.get<PagedResponse<BookingResponse>>("/api/v1/bookings", params),

  getById: (bookingId: string) =>
    api.get<BookingResponse>(`/api/v1/bookings/${bookingId}`),

  accept: (bookingId: string) =>
    api.post<BookingResponse>(`/api/v1/bookings/${bookingId}/accept`),

  reject: (bookingId: string, reason: string) =>
    api.post<BookingResponse>(`/api/v1/bookings/${bookingId}/reject`, { reason } as RejectBookingRequest),

  start: (bookingId: string) =>
    api.post<BookingResponse>(`/api/v1/bookings/${bookingId}/start`),

  complete: (bookingId: string) =>
    api.post<BookingResponse>(`/api/v1/bookings/${bookingId}/complete`),

  cancel: (bookingId: string, reason?: string) =>
    api.put<BookingResponse>(`/api/v1/bookings/${bookingId}/cancel`, { reason } as CancelBookingRequest),
};
