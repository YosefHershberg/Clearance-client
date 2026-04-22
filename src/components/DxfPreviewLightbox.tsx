import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import type { SheetRender } from '@/api/types';

interface Props {
  dxfFileId: string;
  sheet: SheetRender | null;
  onClose: () => void;
}

export function DxfPreviewLightbox({ dxfFileId, sheet, onClose }: Props) {
  const open = sheet !== null;
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-h-[95vh] max-w-[95vw] p-0">
        {sheet && (
          <div className="flex h-[90vh] w-full flex-col gap-2 p-4">
            <div className="flex items-baseline justify-between gap-4" dir="rtl">
              <DialogTitle className="text-lg font-semibold">
                {sheet.displayName}
              </DialogTitle>
              <span className="text-sm text-muted-foreground">
                גיליון {sheet.sheetIndex}
              </span>
            </div>
            <div className="flex-1 overflow-auto rounded border bg-white">
              <img
                src={`/api/renders/${dxfFileId}/${sheet.filename}`}
                alt={sheet.displayName}
                className="h-full w-full object-contain"
              />
            </div>
            {sheet.svgWarning && (
              <p className="text-xs text-amber-700" dir="rtl">
                אזהרה: {sheet.svgWarning}
              </p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
