import { useState } from 'react';
import type { User } from '@/api/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { ResetPasswordDialog } from './ResetPasswordDialog';
import { ToggleActiveConfirm } from './ToggleActiveConfirm';
import { DeleteUserConfirm } from './DeleteUserConfirm';

type Props = {
  users: User[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
};

export function UsersTable({ users, isLoading, isError, onRetry }: Props) {
  const { user: me } = useAuth();
  const [resetTarget, setResetTarget] = useState<User | null>(null);
  const [toggleTarget, setToggleTarget] = useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  if (isError) {
    return (
      <div className="flex items-center justify-between rounded-md border border-destructive/40 bg-destructive/5 p-4">
        <span className="text-sm text-destructive">Failed to load users.</span>
        <Button variant="outline" size="sm" onClick={onRetry}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[80px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                  Loading…
                </TableCell>
              </TableRow>
            )}
            {!isLoading && users.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                  No users
                </TableCell>
              </TableRow>
            )}
            {!isLoading &&
              users.map((u) => {
                const isSelf = me?.id === u.id;
                return (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.email}</TableCell>
                    <TableCell>{u.name}</TableCell>
                    <TableCell>
                      <Badge variant={u.role === 'ADMIN' ? 'default' : 'secondary'}>{u.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={u.isActive ? 'default' : 'outline'}>
                        {u.isActive ? 'Active' : 'Disabled'}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(u.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          disabled={isSelf}
                          render={
                            <Button variant="ghost" size="sm" disabled={isSelf}>
                              …
                            </Button>
                          }
                        />
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setResetTarget(u)}>
                            Reset password
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setToggleTarget(u)}>
                            {u.isActive ? 'Disable' : 'Enable'}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => setDeleteTarget(u)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </div>

      <ResetPasswordDialog user={resetTarget} onOpenChange={() => setResetTarget(null)} />
      <ToggleActiveConfirm user={toggleTarget} onOpenChange={() => setToggleTarget(null)} />
      <DeleteUserConfirm user={deleteTarget} onOpenChange={() => setDeleteTarget(null)} />
    </>
  );
}
