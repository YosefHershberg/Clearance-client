import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';
import { useProject } from '@/hooks/useProject';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { DeleteProjectConfirm } from './projects/DeleteProjectConfirm';
import type { Project } from '@/api/types';

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data, isLoading, isError, error } = useProject(id);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);

  useEffect(() => {
    if (isError) {
      const status = (error as { response?: { status?: number } })?.response?.status;
      if (status === 404 || status === 403) {
        toast.error('Project not found');
        navigate('/', { replace: true });
      }
    }
  }, [isError, error, navigate]);

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;
  if (!data) return null;

  const project = data;
  const isOwnerOrAdmin = user?.id === project.ownerId || user?.role === 'ADMIN';

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link to="/" className="text-sm text-muted-foreground hover:underline">← Back</Link>
          <h1 className="mt-1 text-2xl font-semibold">{project.name}</h1>
          {project.locality && <p className="text-sm text-muted-foreground">{project.locality}</p>}
          {project.owner && user?.id !== project.ownerId && (
            <p className="text-xs text-muted-foreground">Owner: {project.owner.email}</p>
          )}
        </div>
        {isOwnerOrAdmin && (
          <Button variant="outline" onClick={() => setDeleteTarget(project)}>Delete</Button>
        )}
      </div>

      {project.description && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Description</CardTitle>
          </CardHeader>
          <CardContent className="whitespace-pre-wrap text-sm">{project.description}</CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Files</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">Files arrive in phase 4a.</CardContent>
      </Card>

      <DeleteProjectConfirm project={deleteTarget} onOpenChange={() => setDeleteTarget(null)} />
    </div>
  );
}
