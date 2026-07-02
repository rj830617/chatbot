import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAsync } from '../../hooks/useAsync';
import { updateUserProfile } from '../../api/user';
import { validateField } from '../../utils/validation';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Loading } from '../../components/common/Loading';
import { ErrorMessage, SuccessMessage } from '../../components/common/Messages';
import { useUserStats } from '../../hooks/useApi';
import type { UserResponse } from '../../types/api';

export const ProfileForm = () => {
  const { user } = useAuth();
  const { stats, loading: statsLoading, error: statsError } = useUserStats();

  const [nameValue, setNameValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);

  const updateProfileAsync = useAsync(async (): Promise<UserResponse> => {
    const nameValidation = validateField(nameValue, [
      { type: 'maxLength', param: 100, message: 'Name must be less than 100 characters' },
    ]);

    if (nameValidation) {
      setNameError(nameValidation);
      throw new Error(nameValidation);
    }

    setNameError(null);
    return await updateUserProfile({
      name: nameValue.trim() || undefined,
      email: emailValue.trim() || undefined
    });
  });

  useEffect(() => {
    if (user) {
      setNameValue(user.name ?? '');
      setEmailValue(user.email);
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      await updateProfileAsync.execute();
    } catch {
      // Error handled by useAsync
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <Card>
        <h2 className="text-xl font-semibold text-white">Account details</h2>
        <div className="mt-6 space-y-4">
          <Input
            label="Name"
            type="text"
            value={nameValue}
            onChange={(event) => setNameValue(event.target.value)}
            error={nameError || undefined}
          />
          <Input
            label="Email"
            type="email"
            value={emailValue}
            onChange={(event) => setEmailValue(event.target.value)}
            disabled
            helperText="Email cannot be changed"
          />

          {updateProfileAsync.error && <ErrorMessage message={updateProfileAsync.error} />}
          {updateProfileAsync.data && <SuccessMessage message="Profile updated successfully." />}

          <Button
            onClick={handleUpdate}
            loading={updateProfileAsync.loading}
          >
            Save changes
          </Button>
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold text-white">Your meditation stats</h2>
        {statsLoading ? (
          <div className="mt-4">
            <Loading message="Loading stats..." size="sm" />
          </div>
        ) : statsError ? (
          <ErrorMessage message={statsError} className="mt-4" />
        ) : statsError ? (
          <ErrorMessage message={statsError} className="mt-4" />
        ) : stats ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
              <p className="text-sm text-slate-400">Total sessions</p>
              <p className="mt-2 text-3xl font-semibold text-white">{stats.total_sessions}</p>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
              <p className="text-sm text-slate-400">Total minutes</p>
              <p className="mt-2 text-3xl font-semibold text-white">{stats.total_minutes}</p>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
              <p className="text-sm text-slate-400">Average length</p>
              <p className="mt-2 text-3xl font-semibold text-white">{stats.average_length.toFixed(1)} min</p>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
              <p className="text-sm text-slate-400">Longest streak</p>
              <p className="mt-2 text-3xl font-semibold text-white">{stats.longest_streak}</p>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-slate-400">No stats are available yet.</p>
        )}
      </Card>
    </div>
  );
};