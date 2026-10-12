import { AppError } from "../middlewares/errorMiddleware.js";

/*
 * Reemplaza {{variable}} por su valor.
 * Clave ausente = variable que el builder no conoce: falla fuerte (400)
 * para no mandar mensajes rotos. Valor nulo = dato vacío: string vacío.
 */
function resolveMessage(body: string, data: Record<string, unknown>): string {
  const missing = new Set<string>();

  const resolved = body.replace(/{{(\w+)}}/g, (_, key: string) => {
    const value = data[key];

    if (value === undefined) {
      missing.add(key);
      return `{{${key}}}`;
    }

    if (value === null) {
      return "";
    }

    return String(value);
  });

  if (missing.size > 0) {
    throw new AppError(
      400,
      `El template usa variables sin datos: ${[...missing].join(", ")}`,
    );
  }

  return resolved;
}

export default resolveMessage;
