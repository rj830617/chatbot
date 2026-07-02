import { PageLayout } from '../components/layout/PageLayout';
import { MeditationList } from '../features/meditations/MeditationList';

export default function MeditationsPage() {
  return (
    <PageLayout
      title="Meditation History"
      description="Browse your generated meditations and open a detail view for each session"
    >
      <MeditationList />
    </PageLayout>
  );
}
