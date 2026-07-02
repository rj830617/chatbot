import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageLayout } from '../components/layout/PageLayout';
import { SessionChat } from '../features/sessions/SessionChat';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { ErrorMessage } from '../components/common/Messages';
import { useAsync } from '../hooks/useAsync';
import { getMeditation, startMeditation } from '../api/meditation';
import { Modal } from '../components/common/Modal';
import type { MeditationResponse } from '../types/api';

export default function SessionPage() {
  const { id } = useParams();
  const sessionId = id ? Number(id) : null;
  const navigate = useNavigate();

  const [messageCounts, setMessageCounts] = useState<{ total: number; user: number }>({ total: 0, user: 0 });
  const [meditation, setMeditation] = useState<MeditationResponse | null>(null);
  const [progressOpen, setProgressOpen] = useState(false);

  const readyToGenerate = messageCounts.user >= 3;
  const canStartMeditation = readyToGenerate && (!meditation || meditation.status === 'failed');

  const startMeditationAsync = useAsync(async (): Promise<MeditationResponse> => {
    if (!sessionId) throw new Error('Session ID is required');
    const result = await startMeditation(sessionId);
    setMeditation(result);
    setProgressOpen(true);
    return result;
  });

  const meditationId = meditation?.id ?? null;
  const isTerminalStatus = useMemo(() => {
    if (!meditation?.status) return false;
    return meditation.status === 'completed' || meditation.status === 'failed';
  }, [meditation?.status]);

  useEffect(() => {
    if (!meditationId) return;
    if (isTerminalStatus) return;

    let cancelled = false;

    const tick = async () => {
      try {
        const updated = await getMeditation(meditationId);
        if (cancelled) return;
        setMeditation(updated);
      } catch {
        // keep polling; errors show via UI
      }
    };

    tick();
    const intervalId = window.setInterval(tick, 2500);
    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [meditationId, isTerminalStatus]);

  useEffect(() => {
    if (!meditation) return;
    if (meditation.status === 'completed') {
      setProgressOpen(false);
      navigate(`/meditations/${meditation.id}`);
    }
  }, [meditation, navigate]);

  if (!sessionId) {
    return (
      <PageLayout title="Meditation Session" description="Create a session first to start the guided conversation."> 
        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 text-slate-300">
          <p>Session ID is missing. Go back to dashboard to create a new meditation session.</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Guided Meditation Chat"
      description="Chat with your personal meditation guide. After a few messages, start meditation generation." 
    >
      <div className="space-y-6">
        <SessionChat sessionId={sessionId} onMessageCountsChange={setMessageCounts} />

        <Card>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Next step</p>
              <h3 className="mt-2 text-xl font-semibold text-white">Generate your meditation audio</h3>
              <p className="mt-2 text-sm text-slate-400">
                {meditation && meditation.status !== 'failed' && meditation.status !== 'completed'
                  ? 'Generation is running. Track progress, or keep chatting while it completes.'
                  : readyToGenerate
                    ? 'Ready. Start generation using this conversation.'
                    : `Keep chatting to personalize it. Send ${Math.max(0, 3 - messageCounts.user)} more message(s) first.`}
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Continue chat
              </Button>
              {meditation && meditation.status !== 'completed' ? (
                <Button variant="outline" onClick={() => setProgressOpen(true)}>
                  View progress
                </Button>
              ) : null}
              <Button
                onClick={() => startMeditationAsync.execute().catch(() => {})}
                loading={startMeditationAsync.loading}
                disabled={!canStartMeditation || startMeditationAsync.loading}
              >
                Start meditation
              </Button>
            </div>
          </div>

          {startMeditationAsync.error ? (
            <ErrorMessage message={startMeditationAsync.error} className="mt-4" />
          ) : null}
        </Card>
      </div>

      <Modal
        open={progressOpen}
        title="Generating meditation"
        description="We’re creating the script and audio blocks from your conversation. This can take a few minutes."
        onClose={() => setProgressOpen(false)}
      >
        {!meditation ? (
          <div className="text-slate-300">Starting...</div>
        ) : (
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{meditation.status}</p>
                <p className="mt-2 text-sm text-slate-300">
                  Progress {Math.min(100, Math.max(0, meditation.progress))}%
                </p>
              </div>
              {meditation.status === 'failed' ? (
                <span className="rounded-full bg-rose-500/10 px-4 py-2 text-sm text-rose-300">Failed</span>
              ) : (
                <span className="rounded-full bg-sky-500/10 px-4 py-2 text-sm text-sky-300">Working</span>
              )}
            </div>

            <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-sky-500 transition-all"
                style={{ width: `${Math.min(100, Math.max(0, meditation.progress))}%` }}
              />
            </div>

            {meditation.merged_audio?.url ? (
              <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-300">
                Full meditation audio is ready.
              </div>
            ) : meditation.audio_blocks?.length ? (
              <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-300">
                Audio blocks available: {meditation.audio_blocks.length}
              </div>
            ) : (
              <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-400">
                Preparing audio blocks…
              </div>
            )}

            {meditation.status === 'failed' ? (
              <div className="space-y-3">
                <p className="text-sm text-rose-300">Generation failed. You can continue chatting and try again.</p>
                <div className="flex gap-3">
                  <Button variant="secondary" onClick={() => setProgressOpen(false)}>
                    Close
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </Modal>
    </PageLayout>
  );
}
