export class ApiError extends Error{
  public status: number

  constructor(message: string, status: number = 500) {
    super(message)
    this.status = status

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError)
    }

    this.name = this.constructor.name
  }
}