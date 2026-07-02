import { Link } from 'react-router-dom';
import { useMeditations } from '../../hooks/useApi';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Loading } from '../../components/common/Loading';
import { ErrorMessage } from '../../components/common/Messages';

export const MeditationList = () => {
  const { meditations, loading, error, toggleLike } = useMeditations();

  const handleToggleLike = async (id: number) => {
    try {
      await toggleLike(id);
    } catch {
      // Error handled by useAsync in hook
    }
  };

  return (
    <div className="space-y-6">
      {error && <ErrorMessage message={error} />}

      {loading ? (
        <Card>
          <Loading message="Loading meditations..." />
        </Card>
      ) : meditations.length === 0 ? (
        <Card>
          <p className="text-slate-400">You haven't generated any meditation sessions yet.</p>
        </Card>
      ) : (
        <div className="grid gap-6">
          {meditations.map((meditation) => (
            <Card key={meditation.id} variant="elevated">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{meditation.status}</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">
                    {meditation.name || `Day ${meditation.id}`}
                  </h2>
                  <p className="mt-2 text-sm text-slate-400">Progress: {meditation.progress}%</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleLike(meditation.id)}
                  >
                    {meditation.is_liked ? 'Unlike' : 'Like'}
                  </Button>
                  <Link to={`/meditations/${meditation.id}`}>
                    <Button variant="secondary" size="sm">
                      Details
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};