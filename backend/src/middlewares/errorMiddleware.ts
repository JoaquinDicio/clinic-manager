import { Request, Response, ErrorRequestHandler, NextFunction } from "express";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message); // new Error("Error en el servidor")
  }
}

export default function errorMiddleware(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof AppError) {
    console.log(err);
    return res.status(err.statusCode).json({ message: err.message, ok: false });
  }

  if (err instanceof Error) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }

  res.status(500).json({ error: "Internal server error" });
}
