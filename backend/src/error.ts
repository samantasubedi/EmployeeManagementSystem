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

export class unauthorizedError extends appError {
  constructor(message = "Unauthorized") {
    super(401, message);
  }
}

export class forbiddenError extends appError {
  constructor(message = "Forbidden") {
    super(403, message);
  }
}

export class notFoundError extends appError {
  constructor(message: string) {
    super(404, message);
  }
}

export class serviceUnavailableError extends appError {
  constructor(message = "Service unavailable") {
    super(503, message);
  }
}
