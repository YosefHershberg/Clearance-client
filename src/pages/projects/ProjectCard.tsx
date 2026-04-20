import { Link } from 'react-router';
import type { Project } from '@/api/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Props = {
  project: Project;
  showOwner: boolean;
  onDelete: (p: Project) => void;
};

function formatSince(iso: string) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
}

export function ProjectCard({ project, showOwner, onDelete }: Props) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-start justify-between gap-2 pb-2">
        <div className="flex flex-col gap-1 min-w-0">
          <CardTitle className="truncate">
            <Link to={`/projects/${project.id}`} className="hover:underline">
              {project.name}
            </Link>
          </CardTitle>
          {project.locality && (
            <span className="text-xs text-muted-foreground truncate">{project.locality}</span>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="sm">…</Button>} />
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => onDelete(project)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3 text-sm">
        {project.description && (
          <p className="text-muted-foreground line-clamp-2">{project.description}</p>
        )}
        <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground">
          <span>{formatSince(project.createdAt)}</span>
          {showOwner && project.owner && (
            <span className="truncate">{project.owner.email}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
