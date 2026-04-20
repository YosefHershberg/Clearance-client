import { Link } from 'react-router';
import { buttonVariants } from '@/components/ui/button';

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-semibold">403 — Forbidden</h1>
      <p className="text-muted-foreground">You don't have permission to view this page.</p>
      <Link to="/" className={buttonVariants({ variant: 'outline' })}>Go home</Link>
    </div>
  );
}
