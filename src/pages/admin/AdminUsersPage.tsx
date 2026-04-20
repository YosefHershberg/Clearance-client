import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { listUsers, getStats } from '@/api/admin.api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UsersTable } from './UsersTable';
import { CreateUserDialog } from './CreateUserDialog';

export default function AdminUsersPage() {
  const [createOpen, setCreateOpen] = useState(false);

  const usersQ = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: ({ signal }) => listUsers({ limit: 50 }, signal),
    staleTime: 0,
  });

  const statsQ = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: ({ signal }) => getStats(signal),
    staleTime: 30_000,
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Users</h1>
        <Button onClick={() => setCreateOpen(true)}>Create user</Button>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Users</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">
            {statsQ.isLoading ? '—' : statsQ.data?.userCount ?? 0}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Projects</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">
            {statsQ.isLoading ? '—' : statsQ.data?.projectCount ?? 0}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Analyses</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">
            {statsQ.isLoading ? '—' : statsQ.data?.analysisCount ?? 0}
          </CardContent>
        </Card>
      </div>

      <UsersTable
        users={usersQ.data?.users ?? []}
        isLoading={usersQ.isLoading}
        isError={usersQ.isError}
        onRetry={() => usersQ.refetch()}
      />

      <CreateUserDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
