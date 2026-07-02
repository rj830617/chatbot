import { PageLayout } from '../components/layout/PageLayout';
import { MusicLibrary } from '../features/music/MusicLibrary';

export default function MusicLibraryPage() {
  return (
    <PageLayout
      title="Music Library"
      description="Browse premade background audio tracks that can support your meditation experiences"
    >
      <MusicLibrary />
    </PageLayout>
  );
}
