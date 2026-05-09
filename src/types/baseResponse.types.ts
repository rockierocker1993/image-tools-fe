export interface BaseResponse<T> {
  data: T | null;
  message_id: string | null;
  message_en: string | null;
  response_code: string | null;
  status: boolean | null;
  title_en: string | null;
  title_id: string | null;
}