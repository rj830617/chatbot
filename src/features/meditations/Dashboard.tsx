import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMeditations } from '../../hooks/useApi';
import { useAsync } from '../../hooks/useAsync';
import { createSession } from '../../api/session';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { ErrorMessage, SuccessMessage } from '../../components/common/Messages';
import type { SessionResponse } from '../../types/api';

export const Dashboard = () => {
  const { meditations, loading, toggleLike } = useMeditations();
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  const generateSessionAsync = useAsync(async (): Promise<SessionResponse> => {
    return await createSession();
  });

  const handleGenerateMeditation = async () => {
    setActionMessage(null);
    try {
      const session = await generateSessionAsync.execute();
      if (session?.id) {
        setActionMessage('Session created. Start chatting to personalize your meditation.');
        navigate(`/session/${session.id}`);
      }
    } catch {
      // Error handled by useAsync
    }
  };

  const handleToggleLike = async (id: number) => {
    try {
      await toggleLike(id);
    } catch {
      // Error handled by useAsync
    }
  };

  const latestMeditation = meditations[0];

  return (
    <>
      <section className="rounded-[2rem] border border-slate-800 bg-slate-900/95 p-8 shadow-xl shadow-slate-950/20">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-sky-400/80">Welcome back</p>
            <h1 className="mt-3 text-4xl font-semibold text-white">Your Meditation Dashboard</h1>
            <p className="mt-3 max-w-2xl text-slate-400">
              Generate a new meditation audio session, review finished meditations, and explore premade music.
            </p>
          </div>
          <Button
            onClick={handleGenerateMeditation}
            loading={generateSessionAsync.loading}
            size="lg"
          >
            Generate new meditation
          </Button>
        </div>

        {actionMessage && <SuccessMessage message={actionMessage} className="mt-6" />}
        {generateSessionAsync.error && <ErrorMessage message={generateSessionAsync.error} className="mt-6" />}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <Card>
            <h2 className="text-xl font-semibold text-white">Latest meditation</h2>
            {loading ? (
              <div className="mt-4">
                <p className="text-slate-400">Loading your meditations...</p>
              </div>
            ) : !latestMeditation ? (
              <p className="mt-4 text-slate-400">
                No meditation sessions yet. Start one to see the progress tracker.
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between gap-3 rounded-3xl bg-slate-950/80 p-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-400">{latestMeditation.status}</p>
                    <h3 className="mt-2 text-2xl font-semibold text-white">{latestMeditation.name || 'Meditation session'}</h3>
                    <p className="mt-2 text-sm text-slate-400">Progress: {latestMeditation.progress}%</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleLike(latestMeditation.id)}
                  >
                    {latestMeditation.is_liked ? 'Unlike' : 'Like'}
                  </Button>
                </div>
                <Link to={`/meditations/${latestMeditation.id}`}>
                  <Button variant="secondary" className="w-full">
                    View details
                  </Button>
                </Link>
              </div>
            )}
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Quick access</h2>
              <Link to="/music" className="text-sm font-medium text-sky-400 hover:text-sky-300">
                Open music library
              </Link>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Link to="/meditations">
                <Card variant="bordered" className="cursor-pointer hover:border-slate-600 transition">
                  <h3 className="text-lg font-semibold text-white">Meditation history</h3>
                  <p className="mt-2 text-sm text-slate-400">
                    Review generated meditation sessions and playback audio blocks.
                  </p>
                </Card>
              </Link>
              <Link to="/music">
                <Card variant="bordered" className="cursor-pointer hover:border-slate-600 transition">
                  <h3 className="text-lg font-semibold text-white">Music library</h3>
                  <p className="mt-2 text-sm text-slate-400">
                    Browse premade audio background tracks and categories.
                  </p>
                </Card>
              </Link>
            </div>
          </Card>
        </div>

        <Card>
          <h2 className="text-xl font-semibold text-white">Recent meditations</h2>
          <div className="mt-4 space-y-4">
            {loading ? (
              <p className="text-slate-400">Loading meditations...</p>
            ) : meditations.length === 0 ? (
              <p className="text-slate-400">You haven't generated any meditations yet.</p>
            ) : (
              meditations.slice(0, 4).map((meditation) => (
                <div key={meditation.id} className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-400">{meditation.status}</p>
                      <h3 className="mt-2 text-lg font-semibold text-white">
                        {meditation.name || `Session #${meditation.id}`}
                      </h3>
                      <p className="mt-1 text-sm text-slate-400">Progress {meditation.progress}%</p>
                    </div>
                    <Link to={`/meditations/${meditation.id}`}>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </section>
    </>
  );
};
