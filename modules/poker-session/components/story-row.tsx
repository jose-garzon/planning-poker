type StoryStatus = 'voting' | 'pending' | 'done';

interface StoryRowProps {
  title: string;
  status: StoryStatus;
  estimate?: string;
}

const statusBadge: Record<Exclude<StoryStatus, 'done'>, string> = {
  voting:
    'text-[10px] font-bold uppercase rounded px-1.5 py-0.5 bg-poker-green/15 text-poker-green',
  pending:
    'text-[10px] font-bold uppercase rounded px-1.5 py-0.5 bg-poker-muted/15 text-poker-muted',
};

const statusLabel: Record<Exclude<StoryStatus, 'done'>, string> = {
  voting: 'VOTING NOW',
  pending: 'PENDING',
};

export function StoryRow({ title, status, estimate }: StoryRowProps) {
  return (
    <div className="h-12 flex items-center px-3 gap-3 rounded-lg bg-poker-bg-row">
      <span className="text-poker-text text-sm flex-1 truncate">{title}</span>

      {status === 'done' ? (
        <span className="text-poker-text text-sm font-bold shrink-0">{estimate}</span>
      ) : (
        <span className={`${statusBadge[status]} shrink-0`}>{statusLabel[status]}</span>
      )}
    </div>
  );
}
