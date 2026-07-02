interface ErrorMessageProps {
  message: string;
  className?: string;
  onRetry?: () => void;
}

export const ErrorMessage = ({ message, className, onRetry }: ErrorMessageProps) => (
  <div className={`rounded-3xl bg-rose-950/50 border border-rose-800/50 p-4 ${className || ''}`}>
    <div className="flex items-start space-x-3">
      <svg className="h-5 w-5 text-rose-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <div className="flex-1">
        <p className="text-sm text-rose-200">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 text-sm text-rose-300 hover:text-rose-200 underline"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  </div>
);

interface SuccessMessageProps {
  message: string;
  className?: string;
}

export const SuccessMessage = ({ message, className }: SuccessMessageProps) => (
  <div className={`rounded-3xl bg-emerald-950/50 border border-emerald-800/50 p-4 ${className || ''}`}>
    <div className="flex items-start space-x-3">
      <svg className="h-5 w-5 text-emerald-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <p className="text-sm text-emerald-200">{message}</p>
    </div>
  </div>
);