import { Badge } from '@/components/ui/badge';
import type { ExtractionStatus } from '@/api/types';

type Props = { status: ExtractionStatus };

export function ExtractionStatusPill({ status }: Props) {
  switch (status) {
    case 'PENDING':
      return <Badge variant="outline">Pending</Badge>;
    case 'EXTRACTING':
      return (
        <Badge variant="default" className="gap-1">
          <span className="size-2 animate-pulse rounded-full bg-background/80" />
          Extracting…
        </Badge>
      );
    case 'COMPLETED':
      return (
        <Badge
          variant="default"
          className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
        >
          Ready
        </Badge>
      );
    case 'FAILED':
      return <Badge variant="destructive">Failed</Badge>;
  }
}
