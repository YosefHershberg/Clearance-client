import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';
import type { SheetClassification, SheetRender } from '@/api/types';

interface Props {
  dxfFileId: string;
  sheets: SheetRender[];
  onSelect: (sheet: SheetRender) => void;
}

const CLASSIFICATION_LABELS: Record<SheetClassification, string> = {
  FLOOR_PLAN: 'תכנית',
  ELEVATION: 'חזית',
  CROSS_SECTION: 'חתך',
  PARKING_SECTION: 'חנייה',
  SURVEY: 'מדידה',
  SITE_PLAN: 'תכנית מגרש',
  ROOF_PLAN: 'תכנית גג',
  AREA_CALCULATION: 'חישוב שטחים',
  INDEX_PAGE: 'תוכן',
  UNCLASSIFIED: 'לא מסווג',
};

export function DxfPreviewGrid({ dxfFileId, sheets, onSelect }: Props) {
  if (sheets.length === 0) {
    return <p className="text-sm text-muted-foreground">אין גיליונות להצגה</p>;
  }
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {sheets.map((sheet) => (
        <button
          key={sheet.id}
          type="button"
          onClick={() => onSelect(sheet)}
          className="group flex flex-col gap-2 rounded-lg border bg-card p-3 text-right transition hover:border-primary hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded border bg-white">
            <img
              src={`/api/renders/${dxfFileId}/${sheet.filename}`}
              alt={sheet.displayName}
              className="h-full w-full object-contain"
              loading="lazy"
            />
            {sheet.svgWarning && (
              <div
                className="absolute right-2 top-2 rounded-full bg-amber-100 p-1 text-amber-700"
                title={sheet.svgWarning}
              >
                <AlertTriangle className="h-3.5 w-3.5" />
              </div>
            )}
          </div>
          <div className="flex items-center justify-between gap-2">
            <Badge variant="outline" className="text-xs">
              {CLASSIFICATION_LABELS[sheet.classification]}
            </Badge>
            <span className="truncate text-sm font-medium" dir="rtl">
              {sheet.displayName}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
