import { Navigate } from "react-router-dom";
import { useWhatsappStatus } from "../hooks/useWhatsappStatus";

/*
 * Pantalla de vinculación: muestra el QR que llega por push (SSE).
 * Al conectarse, vuelve al dashboard automáticamente.
 */
export default function Whatsapp() {
  const { connected, qr } = useWhatsappStatus();

  if (connected) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white rounded-lg shadow p-8 max-w-sm w-full text-center">
        <h1 className="font-semibold text-lg mb-2">Conectar WhatsApp</h1>
        <p className="text-sm text-gray-500 mb-6">
          Escaneá este código con WhatsApp en tu teléfono para activar los
          recordatorios.
        </p>

        {qr ? (
          <img
            src={qr}
            alt="Código QR de WhatsApp"
            className="mx-auto w-64 h-64"
          />
        ) : (
          <p className="text-gray-500 py-16">Generando código QR...</p>
        )}
      </div>
    </div>
  );
}
