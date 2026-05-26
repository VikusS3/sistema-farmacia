import "express";

export interface JwtPayload {
  id: number;
  email: string;
  rol?: "admin" | "empleado";
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
