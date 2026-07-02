import { PageLayout } from '../components/layout/PageLayout';
import { MeditationDetail } from '../features/meditations/MeditationDetail';

export default function MeditationDetailPage() {
  return (
    <PageLayout
      title="Meditation Details"
      description="Review the generated script and audio blocks for the selected session"
    >
      <MeditationDetail />
    </PageLayout>
  );
}
