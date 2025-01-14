export class ApiError extends Error {
  constructor(public statusCode: number, message: string, public code: string) {
    super(message);
    this.name = "ApiError";
  }
}

export type Result<T> =
  | { success: true; data: T }
  | { success: false; error: ApiError };
