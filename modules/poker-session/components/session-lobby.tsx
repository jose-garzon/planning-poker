'use client';

import type { Session } from '@/modules/poker-session/services/types';
import { cn } from '@/shared/lib/utils/cn';
import { useState } from 'react';
import { AddStoryModal } from './add-story-modal';
import { LobbyFooter } from './footer/footer';
import type { GameState } from './game/game';
import { GameArea } from './game/game';
import { LobbyHeader } from './header/header';
import { HostVotingView } from './host-voting-view';
import { ResultsView } from './results-view';
import { StoriesPanel } from './stories/stories';
import { TimerSetupModal } from './timer-setup-modal';
import { VotingView } from './voting-view';

interface SessionLobbyProps {
  session: Session;
  role: 'host' | 'participant';
  state?: GameState | undefined;
}

const MOCK_NORMAL_VOTES = [
  { name: 'Jordan', value: 5 as const },
  { name: 'Sam', value: 3 as const },
  { name: 'Casey', value: 5 as const },
  { name: 'Riley', value: 8 as const },
  { name: 'Morgan', value: 5 as const },
  { name: 'Taylor', value: 2 as const },
  { name: 'Quinn', value: 13 as const },
  { name: 'Drew', value: 5 as const },
];

const MOCK_UNANIMOUS_VOTES = [
  { name: 'Jordan', value: 5 as const },
  { name: 'Sam', value: 5 as const },
  { name: 'Casey', value: 5 as const },
  { name: 'Riley', value: 5 as const },
  { name: 'Morgan', value: 5 as const },
  { name: 'Drew', value: 5 as const },
];

const MOCK_TIE_VOTES = [
  { name: 'Jordan', value: 5 as const },
  { name: 'Sam', value: 8 as const },
  { name: 'Casey', value: 5 as const },
  { name: 'Riley', value: 8 as const },
  { name: 'Morgan', value: 3 as const },
  { name: 'Quinn', value: 5 as const },
  { name: 'Drew', value: 8 as const },
];

const GAME_STATES: GameState[] = ['voting', 'timeup', 'unanimous-results', 'results', 'voted'];

function getMobileLabel(state: GameState, isHost: boolean): string {
  if (state === 'voting') {
    return isHost ? 'Voting in progress...' : 'Cast your vote';
  }
  if (state === 'timeup') {
    return isHost ? "Time's up — revealing results" : "Time's up";
  }
  if (state === 'unanimous-results') {
    return isHost ? 'Unanimous vote! 🎉' : 'Unanimous! 🎉';
  }
  if (state === 'results') {
    return 'Results are in';
  }
  if (state === 'voted') {
    return isHost ? '' : 'Vote submitted ✓';
  }
  return '';
}

export function SessionLobby({ session, role, state }: SessionLobbyProps) {
  const isHost = role === 'host';
  const [addStoryOpen, setAddStoryOpen] = useState(false);
  const [timerSetupOpen, setTimerSetupOpen] = useState(false);
  const [selectedVote, setSelectedVote] = useState<number | '?' | undefined>(undefined);
  const storiesLabel = isHost ? 'STORIES' : 'CURRENT STORY';
  const storiesEmpty = 'No stories yet';
  const isGameActive = state !== undefined && (GAME_STATES as string[]).includes(state);

  const currentStory = session.currentStoryId
    ? session.stories.find((s) => s.id === session.currentStoryId)
    : undefined;

  const STORY_ORDER = { voting: 0, pending: 1, done: 2 } as const;
  const stories = session.stories
    .map((s) => ({
      id: s.id,
      title: s.title,
      status: (s.status === 'completed' ? 'done' : s.status) as 'voting' | 'pending' | 'done',
      ...(s.score !== null && { estimate: s.score }),
    }))
    .sort((a, b) => STORY_ORDER[a.status] - STORY_ORDER[b.status]);

  const participants = session.participants.map((p) => ({
    name: p.name,
    isHost: p.role === 'host',
    status: p.isOnline ? ('online' as const) : ('offline' as const),
    voted: currentStory !== undefined && currentStory.votes[p.id] !== undefined,
  }));
  const sortedParticipants = [...participants].sort((a, b) => Number(a.voted) - Number(b.voted));

  const nonHostParticipants = participants.filter((p) => !p.isHost);
  const allVoted = nonHostParticipants.length > 0 && nonHostParticipants.every((p) => p.voted);

  return (
    <div className="flex flex-col h-screen bg-poker-bg-page overflow-hidden">
      <LobbyHeader sessionId={session.id} sessionName={session.name} />

      <div className="flex-1 flex overflow-hidden">
        {/* Aside — always on desktop, hidden on mobile when game is active */}
        <aside
          className={cn(
            'flex flex-col w-full md:w-[300px] shrink-0 px-4 md:px-6 pt-4 md:pt-5 pb-4 md:pb-5 gap-4 md:gap-5',
            isGameActive && 'hidden md:flex',
          )}
        >
          <StoriesPanel
            stories={stories}
            isHost={isHost}
            label={storiesLabel}
            emptyText={storiesEmpty}
          />
        </aside>

        {/* Mobile game view — only on mobile when game is active */}
        {isGameActive && (
          <div className="flex-1 flex md:hidden overflow-hidden">
            {state === 'voting' && !isHost && (
              <VotingView
                storyId="US-42"
                storyTitle="As a user, I can log in with email"
                seconds={75}
                totalSeconds={120}
                votedCount={3}
                totalCount={5}
                selectedValue={selectedVote}
                onSelect={setSelectedVote}
              />
            )}
            {state === 'voting' && isHost && (
              <HostVotingView
                storyId="US-42"
                storyTitle="As a user, I can log in with email"
                seconds={75}
                totalSeconds={120}
                participants={sortedParticipants}
              />
            )}
            {state === 'unanimous-results' && (
              <ResultsView
                storyId="US-42"
                storyTitle="As a user, I can log in with email"
                votes={MOCK_UNANIMOUS_VOTES}
                variant="unanimous"
                isHost={isHost}
                onNextStory={() => console.log('Next story')}
                onRestartVote={() => console.log('Restart vote')}
              />
            )}
            {state === 'results' && (
              <ResultsView
                storyId="US-42"
                storyTitle="As a user, I can log in with email"
                votes={MOCK_NORMAL_VOTES}
                variant="normal"
                isHost={isHost}
                onNextStory={() => console.log('Next story')}
                onRestartVote={() => console.log('Restart vote')}
              />
            )}
            {state === 'timeup' && (
              <ResultsView
                storyId="US-42"
                storyTitle="As a user, I can log in with email"
                votes={MOCK_TIE_VOTES}
                variant="tie"
                isHost={isHost}
                onNextStory={() => console.log('Next story')}
                onChoose={(v) => console.log('Chose:', v)}
                onRestartVote={() => console.log('Restart vote')}
              />
            )}
            {state !== 'voting' &&
              state !== 'unanimous-results' &&
              state !== 'results' &&
              state !== 'timeup' && (
                <div className="flex-1 flex items-center justify-center px-4">
                  <p className="text-poker-muted text-sm">{getMobileLabel(state, isHost)}</p>
                </div>
              )}
          </div>
        )}

        {/* Desktop game area — always rendered, controls its own hidden md:flex */}
        <GameArea
          isHost={isHost}
          state={state}
          storyId="US-42"
          storyTitle="As a user, I can log in with email"
          seconds={75}
          totalSeconds={120}
          votedCount={MOCK_NORMAL_VOTES.length}
          totalCount={nonHostParticipants.length}
          participants={sortedParticipants}
          {...(selectedVote !== undefined ? { selectedValue: selectedVote } : {})}
          onSelect={setSelectedVote}
          votes={
            state === 'unanimous-results'
              ? MOCK_UNANIMOUS_VOTES
              : state === 'timeup'
                ? MOCK_TIE_VOTES
                : MOCK_NORMAL_VOTES
          }
          variant={state === 'timeup' ? 'tie' : 'normal'}
          onNextStory={() => console.log('Next story')}
          onChoose={(v) => console.log('Chose:', v)}
          onRestartVote={() => console.log('Restart vote')}
        />
      </div>

      <LobbyFooter
        isHost={isHost}
        {...(state !== undefined ? { state } : {})}
        allVoted={allVoted}
        onAddStory={() => setAddStoryOpen(true)}
        onStartVote={() => setTimerSetupOpen(true)}
        onReveal={() => console.log('Reveal results')}
      />

      <AddStoryModal
        open={addStoryOpen}
        onOpenChangeAction={setAddStoryOpen}
        onSubmitAction={(storyId, title) => {
          // TODO: integrate with store to persist the story
          console.log('Add story:', { storyId, title });
        }}
      />

      <TimerSetupModal
        open={timerSetupOpen}
        storyTitle={currentStory?.title ?? stories.find((s) => s.status === 'voting')?.title ?? ''}
        onOpenChangeAction={setTimerSetupOpen}
        onStartAction={(duration) => {
          // TODO: integrate with store to start voting
          console.log('Start vote with duration:', duration);
        }}
      />
    </div>
  );
}
