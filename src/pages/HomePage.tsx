import { useMemo, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProjects } from '@/hooks/useProjects';
import { Button } from '@/components/ui/button';
import { ProjectCard } from './projects/ProjectCard';
import { CreateProjectDialog } from './projects/CreateProjectDialog';
import { DeleteProjectConfirm } from './projects/DeleteProjectConfirm';
import type { Project } from '@/api/types';

export default function HomePage() {
  const { user } = useAuth();
  const [createOpen, setCreateOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);

  const { data, isLoading, isError, refetch } = useProjects({ all: showAll });
  const projects = data?.projects ?? [];
  const isAdmin = user?.role === 'ADMIN';
  const showOwner = useMemo(() => isAdmin && showAll, [isAdmin, showAll]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-baseline gap-3">
          <h1 className="text-2xl font-semibold">{showAll ? 'All projects' : 'My projects'}</h1>
          {isAdmin && (
            <Button variant="ghost" size="sm" onClick={() => setShowAll((v) => !v)}>
              {showAll ? 'Show mine' : 'Show all'}
            </Button>
          )}
        </div>
        <Button onClick={() => setCreateOpen(true)}>Create project</Button>
      </div>

      {isError && (
        <div className="flex items-center justify-between rounded-md border border-destructive/40 bg-destructive/5 p-4">
          <span className="text-sm text-destructive">Failed to load projects.</span>
          <Button variant="outline" size="sm" onClick={() => refetch()}>Retry</Button>
        </div>
      )}

      {!isError && isLoading && (
        <p className="text-sm text-muted-foreground">Loading…</p>
      )}

      {!isError && !isLoading && projects.length === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-md border border-dashed p-12 text-center">
          <p className="text-muted-foreground">No projects yet — create your first.</p>
          <Button onClick={() => setCreateOpen(true)}>Create project</Button>
        </div>
      )}

      {!isError && !isLoading && projects.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} showOwner={showOwner} onDelete={setDeleteTarget} />
          ))}
        </div>
      )}

      <CreateProjectDialog open={createOpen} onOpenChange={setCreateOpen} />
      <DeleteProjectConfirm project={deleteTarget} onOpenChange={() => setDeleteTarget(null)} />
    </div>
  );
}
