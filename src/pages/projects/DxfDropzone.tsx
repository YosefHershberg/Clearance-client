import { useRef, useState, type DragEvent, type ChangeEvent } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useHttpClient } from '@/hooks/useHttpClient';
import { uploadDxf } from '@/api/dxf.api';
import { normalizeHttpError } from '@/lib/http-error';

const MAX_BYTES = 100 * 1024 * 1024;

type Props = { projectId: string };

export function DxfDropzone({ projectId }: Props) {
  const qc = useQueryClient();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const { execute, isLoading } = useHttpClient({ fn: uploadDxf });

  const handleFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.dxf')) {
      toast.error('Only .dxf files are supported');
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error('File exceeds 100 MB');
      return;
    }
    try {
      await execute({ projectId, file });
      toast.success(`Uploaded ${file.name}`);
      await qc.invalidateQueries({ queryKey: ['project-dxfs', projectId] });
    } catch (e) {
      toast.error(normalizeHttpError(e).message);
    }
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void handleFile(file);
    if (inputRef.current) inputRef.current.value = '';
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void handleFile(file);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
      className={`flex flex-col items-center justify-center gap-3 rounded-md border border-dashed p-8 text-center transition-colors ${
        dragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/30'
      }`}
    >
      <p className="text-sm text-muted-foreground">
        Drop a DXF file here, or click to pick one.
      </p>
      <input
        ref={inputRef}
        type="file"
        accept=".dxf"
        className="hidden"
        onChange={onChange}
      />
      <Button
        type="button"
        variant="outline"
        disabled={isLoading}
        onClick={() => inputRef.current?.click()}
      >
        {isLoading ? 'Uploading…' : 'Choose DXF'}
      </Button>
    </div>
  );
}
