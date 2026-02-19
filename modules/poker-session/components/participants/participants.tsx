import { ParticipantRow } from './participant-row';

type Participant = {
  name: string;
  isHost?: boolean;
  status: 'online' | 'idle' | 'offline';
  voted: boolean;
};

interface ParticipantsPanelProps {
  participants: Participant[];
  total: number;
}

export function ParticipantsPanel({ participants, total }: ParticipantsPanelProps) {
  return (
    <div className="flex-1 flex flex-col gap-2 md:gap-3 min-h-0">
      <div className="h-10 md:h-11 bg-poker-bg-header rounded-[4px] px-4 py-2.5 md:py-3 flex items-center gap-2.5 shrink-0">
        <span className="text-base md:text-lg" aria-hidden="true">
          👥
        </span>
        <span className="text-[13px] font-black text-poker-green tracking-widest">
          PARTICIPANTS
        </span>
        <span className="ml-auto text-sm font-black text-poker-text">8/{total}</span>
      </div>

      <div
        className="flex-1 bg-poker-bg-header rounded-[4px] p-3 md:p-4 flex flex-col gap-2 overflow-y-auto min-h-0"
        aria-live="polite"
        aria-label="Participant list"
      >
        {participants.length === 0 ? (
          <p className="text-sm font-bold text-poker-muted text-center py-2">
            Waiting for players...
          </p>
        ) : (
          participants.map((p) => (
            <ParticipantRow
              key={p.name}
              name={p.name}
              {...(p.isHost !== undefined && { isHost: p.isHost })}
              status={p.status}
              voted={p.voted}
            />
          ))
        )}
      </div>
    </div>
  );
}
