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

  if (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code: unknown }).code === "23505"
  ) {
    const constraint =
      "constraint" in err ? String((err as { constraint: unknown }).constraint) : "";
    console.log(err);
    return res
      .status(409)
      .json({ message: `Valor duplicado (${constraint})`, ok: false });
  }

  if (err instanceof Error) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }

  res.status(500).json({ error: "Internal server error" });
}
