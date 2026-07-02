import { PageLayout } from '../components/layout/PageLayout';
import { Dashboard } from '../features/meditations/Dashboard';

export default function HomePage() {
  return (
    <PageLayout
      title="Meditation Dashboard"
      description="Generate new meditations, track progress, and explore your meditation journey"
    >
      <Dashboard />
    </PageLayout>
  );
}
