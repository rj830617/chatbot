import { LoginForm } from '../features/auth/LoginForm';

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:px-6">
      <div className="mx-auto max-w-xl">
        <LoginForm />
      </div>
    </main>
  );
}
