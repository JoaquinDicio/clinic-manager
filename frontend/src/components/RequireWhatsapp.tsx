import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useWhatsappStatus } from "../hooks/useWhatsappStatus";

/*
 * Si WhatsApp está desconectado, redirige a /whatsapp (pantalla de QR).
 * Mientras carga el primer estado muestra un loader para no flashear redirects.
 */
export default function RequireWhatsapp({ children }: { children: ReactNode }) {
  const { connected } = useWhatsappStatus();

  if (connected === null) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-500">Cargando...</p>
      </div>
    );
  }

  if (!connected) {
    return <Navigate to="/whatsapp" replace />;
  }

  return <>{children}</>;
}
