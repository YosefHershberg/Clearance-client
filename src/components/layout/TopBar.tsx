import { Link, useNavigate } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { useHttpClient } from '@/hooks/useHttpClient';
import { logout as logoutApi } from '@/api/auth.api';
import { normalizeHttpError } from '@/lib/http-error';

export function TopBar() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const { execute, isLoading } = useHttpClient({ fn: logoutApi });

  const handleLogout = async () => {
    try {
      await execute();
    } catch (e) {
      toast.error(normalizeHttpError(e).message);
    } finally {
      qc.setQueryData(['me'], null);
      qc.removeQueries({ predicate: (q) => q.queryKey[0] !== 'me' });
      navigate('/login', { replace: true });
    }
  };

  if (!user) return null;

  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="font-semibold">Clearance</Link>
        <nav className="flex items-center gap-2">
          {user.role === 'ADMIN' && (
            <Link to="/admin/users" className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
              Admin
            </Link>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="outline" size="sm">{user.name}</Button>}
            />
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} disabled={isLoading}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  );
}
