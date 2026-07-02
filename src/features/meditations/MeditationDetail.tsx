import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAsync } from '../../hooks/useAsync';
import { getMeditation } from '../../api/meditation';
import { Card } from '../../components/common/Card';
import { AudioPlayer } from '../../components/common/AudioPlayer';
import { Loading } from '../../components/common/Loading';
import { ErrorMessage } from '../../components/common/Messages';
import { SessionChat } from '../sessions/SessionChat';
import type { MeditationResponse } from '../../types/api';

export const MeditationDetail = () => {
  const { id } = useParams();
  const [meditation, setMeditation] = useState<MeditationResponse | null>(null);

  const loadMeditationAsync = useAsync(async (): Promise<MeditationResponse> => {
    if (!id) throw new Error('Meditation ID is required');
    return await getMeditation(Number(id));
  });

  useEffect(() => {
    if (id) {
      loadMeditationAsync.execute().then(setMeditation).catch(() => {});
    }
  }, [id]);

  if (loadMeditationAsync.loading) {
    return (
      <Card>
        <Loading message="Loading meditation details..." />
      </Card>
    );
  }

  if (loadMeditationAsync.error) {
    return <ErrorMessage message={loadMeditationAsync.error} onRetry={loadMeditationAsync.execute} />;
  }

  if (!meditation) {
    return <ErrorMessage message="Meditation not found" />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{meditation.status}</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">
              {meditation.name || `Session ${meditation.id}`}
            </h2>
          </div>
          <span className="rounded-full bg-slate-800 px-4 py-2 text-sm text-slate-300">
            Progress {meditation.progress}%
          </span>
        </div>
        <p className="mt-4 text-slate-400">
          {meditation.summary || 'This meditation is being generated and audio blocks will appear when ready.'}
        </p>
      </Card>

      {meditation.script?.length ? (
        <Card>
          <h3 className="text-xl font-semibold text-white">Script</h3>
          <div className="mt-4 space-y-3 text-slate-300">
            {meditation.script.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </Card>
      ) : null}

      {meditation.merged_audio?.url ? (
        <Card>
          <h3 className="text-xl font-semibold text-white">Full meditation audio</h3>
          <p className="mt-2 text-sm text-slate-400">
            Play the complete meditation, or use individual blocks below.
          </p>
          <div className="mt-4">
            <AudioPlayer
              src={meditation.merged_audio.url}
              title={meditation.name ? `${meditation.name} (Full)` : 'Full meditation'}
              duration={meditation.merged_audio.duration}
            />
          </div>
        </Card>
      ) : null}

      {meditation.audio_blocks?.length ? (
        <Card>
          <h3 className="text-xl font-semibold text-white">Audio blocks</h3>
          <div className="mt-4 space-y-4">
            {meditation.audio_blocks.map((block) => (
              <div key={block.block}>
                <div className="mb-3">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Block {block.block}</p>
                  <p className="mt-1 text-sm font-medium text-white">
                    {block.type ? block.type.charAt(0).toUpperCase() + block.type.slice(1) : 'Audio'}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {block.has_voice ? 'Voice' : 'Music'}{block.background_audio ? ` · ${block.background_audio}` : ''}
                  </p>
                </div>
                {block.url ? (
                  <AudioPlayer
                    src={block.url}
                    title={`Block ${block.block} - ${block.type || 'Audio'}`}
                    duration={block.duration}
                  />
                ) : (
                  <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
                    <p className="text-sm text-slate-400">Audio not available yet</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <Card>
          <p className="text-slate-400">
            No audio blocks are available yet. Wait for the generation task to complete and refresh this page.
          </p>
        </Card>
      )}

      {meditation.session_id && (
        <SessionChat sessionId={meditation.session_id} />
      )}
    </div>
  );
};
