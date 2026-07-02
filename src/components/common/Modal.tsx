import type { ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  title: string;
  description?: string;
  children: ReactNode;
  onClose: () => void;
}

export const Modal = ({ open, title, description, children, onClose }: ModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button
        aria-label="Close modal"
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
        onClick={onClose}
        type="button"
      />

      <div className="relative w-full max-w-xl rounded-[2rem] border border-slate-800 bg-slate-900 shadow-2xl shadow-slate-950/40">
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-white">{title}</h2>
              {description ? <p className="mt-2 text-sm text-slate-400">{description}</p> : null}
            </div>
            <button
              className="rounded-2xl px-3 py-2 text-slate-400 hover:bg-slate-800 hover:text-white"
              onClick={onClose}
              type="button"
            >
              Close
            </button>
          </div>

          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  );
};

