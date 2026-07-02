import { PageLayout } from '../components/layout/PageLayout';
import { ProfileForm } from '../features/profile/ProfileForm';

export default function ProfilePage() {
  return (
    <PageLayout
      title="Profile"
      description="Manage your account and see your meditation stats"
    >
      <ProfileForm />
    </PageLayout>
  );
}
