import { useMusicLibrary } from '../../hooks/useApi';
import { Card } from '../../components/common/Card';
import { AudioPlayer } from '../../components/common/AudioPlayer';
import { Loading } from '../../components/common/Loading';
import { ErrorMessage } from '../../components/common/Messages';

export const MusicLibrary = () => {
  const { music, loading, error } = useMusicLibrary();

  return (
    <div className="space-y-6">
      {error && <ErrorMessage message={error} />}

      {loading ? (
        <Card>
          <Loading message="Loading music library..." />
        </Card>
      ) : music.length === 0 ? (
        <Card>
          <p className="text-slate-400">No music tracks are currently available.</p>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {music.map((item) => (
            <Card key={item.id} variant="elevated">
              <div className="space-y-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{item.category}</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">{item.display_name}</h2>
                </div>
                <div className="space-y-2 text-slate-400">
                  <p>{item.description || 'No description available.'}</p>
                  <p className="text-sm">Tags: {item.tags?.join(', ') || 'None'}</p>
                  <p className="text-sm">Mood: {item.mood.join(', ')}</p>
                </div>
                {item.url ? (
                  <AudioPlayer
                    src={item.url}
                    title={item.display_name}
                  />
                ) : (
                  <p className="text-sm text-slate-500">Playback is not available for this track.</p>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};