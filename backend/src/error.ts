export class appError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
export class conflictError extends appError {
  constructor(message: string) {
    super(409, message);
  }
}
