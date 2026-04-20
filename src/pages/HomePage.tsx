import { useAuth } from '@/hooks/useAuth';

export default function HomePage() {
  const { user } = useAuth();
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-semibold">Welcome, {user?.name}</h1>
      <p className="text-muted-foreground">
        Phase 1b shell — project pages arrive in Phase 2.
      </p>
    </div>
  );
}
