export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T
}


export interface FieldError {
  fieldName: string;
  message: string;
}

export interface ClockInRequest {
  sessionId: number;
  loginId: string;
  latitude: string;
  longitude: string;
}

export interface AttendanceResponse {
  id: number;
  clockInTime: string;
  isLate: boolean;
  latitude: string;
  longitude: string;
}

export interface PagedResponse<T> {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  content: T[]
}
