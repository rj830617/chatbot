import { Card } from '../common/Card';
import { Loading } from '../common/Loading';
import { ErrorMessage } from '../common/Messages';

interface PageLayoutProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export const PageLayout = ({
  title,
  description,
  children,
  loading = false,
  error,
  onRetry
}: PageLayoutProps) => (
  <main className="min-h-screen bg-slate-950 text-slate-100">
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <Card variant="elevated" padding="lg">
          <h1 className="text-3xl font-semibold text-white">{title}</h1>
          {description && <p className="mt-3 text-slate-400">{description}</p>}
        </Card>
      </div>

      {error && <ErrorMessage message={error} onRetry={onRetry} className="mb-6" />}

      {loading ? (
        <Card>
          <Loading message="Loading content..." />
        </Card>
      ) : (
        children
      )}
    </div>
  </main>
);