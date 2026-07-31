import { type ReactNode } from "react";

interface ModalContainerProps {
  closeFunction: () => void;
  children: ReactNode;
}

export default function ModalContainer({
  closeFunction,
  children,
}: ModalContainerProps) {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex-col gap-3 bg-black/70 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
        {children}
      </div>
      <button
        onClick={closeFunction}
        className="cursor-pointer text-white text-xs font-bold py-2 px-4 rounded"
      >
        Cerrar
      </button>
    </div>
  );
}
