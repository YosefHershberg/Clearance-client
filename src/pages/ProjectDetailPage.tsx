import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';
import { useProject } from '@/hooks/useProject';
import { useProjectDxfFiles } from '@/hooks/useProjectDxfFiles';
import { useDxfFile } from '@/hooks/useDxfFile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { DeleteProjectConfirm } from './projects/DeleteProjectConfirm';
import { DxfDropzone } from './projects/DxfDropzone';
import { ExtractionStatusPill } from '@/components/ExtractionStatusPill';
import { DxfPreviewGrid } from '@/components/DxfPreviewGrid';
import { DxfPreviewLightbox } from '@/components/DxfPreviewLightbox';
import type { Project, SheetRender } from '@/api/types';

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function formatSince(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
}

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data, isLoading, isError, error } = useProject(id);
  const dxfsQuery = useProjectDxfFiles(id);
  const dxfFilesList = dxfsQuery.data?.dxfFiles ?? [];
  const currentDxfForDetail = dxfFilesList[0];
  const dxfDetail = useDxfFile(
    currentDxfForDetail?.extractionStatus === 'COMPLETED'
      ? currentDxfForDetail.id
      : undefined,
  );
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [lightboxSheet, setLightboxSheet] = useState<SheetRender | null>(null);

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
  const dxfFiles = dxfFilesList;
  const currentDxf = currentDxfForDetail;
  const sheetRenders = dxfDetail.data?.sheetRenders ?? [];

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
          <CardTitle className="text-sm font-medium text-muted-foreground">DXF files</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {isOwnerOrAdmin && <DxfDropzone projectId={project.id} />}

          {dxfsQuery.isLoading && (
            <p className="text-sm text-muted-foreground">Loading…</p>
          )}

          {!dxfsQuery.isLoading && dxfFiles.length === 0 && (
            <p className="text-sm text-muted-foreground">No DXFs uploaded yet.</p>
          )}

          {dxfFiles.length > 0 && (
            <ul className="flex flex-col divide-y rounded-md border">
              {dxfFiles.map((dxf) => (
                <li key={dxf.id} className="flex items-center justify-between gap-3 p-3">
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate text-sm font-medium">{dxf.originalName}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatSize(dxf.sizeBytes)} · {dxf.sha256.slice(0, 12)}… · {formatSince(dxf.createdAt)}
                    </span>
                    {dxf.extractionError && (
                      <span className="mt-1 text-xs text-destructive">{dxf.extractionError}</span>
                    )}
                  </div>
                  <ExtractionStatusPill status={dxf.extractionStatus} />
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {currentDxf && sheetRenders.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle
              className="text-sm font-medium text-muted-foreground"
              dir="rtl"
            >
              גיליונות
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DxfPreviewGrid
              dxfFileId={currentDxf.id}
              sheets={sheetRenders}
              onSelect={setLightboxSheet}
            />
          </CardContent>
        </Card>
      )}

      <DxfPreviewLightbox
        dxfFileId={currentDxf?.id ?? ''}
        sheet={lightboxSheet}
        onClose={() => setLightboxSheet(null)}
      />

      <DeleteProjectConfirm project={deleteTarget} onOpenChange={() => setDeleteTarget(null)} />
    </div>
  );
}
