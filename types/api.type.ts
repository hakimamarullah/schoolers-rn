export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T
}


export interface FieldError {
  fieldName: string;
  message: string;
}