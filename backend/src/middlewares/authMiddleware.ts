import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  id?: number;
  nombres: string;
  email: string;
  password: string;
  rol?: "admin" | "empleado";
  estado?: 1 | 0;
  creado_en?: Date;
  actualizado_en?: Date;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Asegúrate de que no haya un valor de retorno
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Token no proporcionado" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = decoded;
    next(); // Pasamos al siguiente middleware/controlador
  } catch (error) {
    res.status(401).json({ message: "Token inválido o expirado" });
    return;
  }
};
