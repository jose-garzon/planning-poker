'use client';

import { Button } from '@/shared/components/ui/button/button';
import { Input } from '@/shared/components/ui/input/input';
import { Modal, ModalBody, ModalFooter, ModalHeader } from '@/shared/components/ui/modal';
import { Dialog } from '@base-ui-components/react/dialog';
import { useState } from 'react';

export interface AddStoryModalProps {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  onSubmitAction: (storyId: string, title: string) => void;
}

export function AddStoryModal({ open, onOpenChangeAction, onSubmitAction }: AddStoryModalProps) {
  const [storyId, setStoryId] = useState('');
  const [title, setTitle] = useState('');

  const isValid = storyId.trim().length > 0 && title.trim().length > 0;

  const handleSubmit: import('react').SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!isValid) return;
    onSubmitAction(storyId.trim(), title.trim());
    setStoryId('');
    setTitle('');
    onOpenChangeAction(false);
  };

  return (
    <Modal open={open} onOpenChangeAction={onOpenChangeAction}>
      <ModalHeader title="ADD STORY" />

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <ModalBody>
          <Input
            label="STORY ID:"
            labelClassName="text-[11px] font-black tracking-widest text-poker-green"
            placeholder="e.g. MIC-100"
            maxLength={20}
            value={storyId}
            onChange={(e) => setStoryId(e.target.value)}
            autoComplete="off"
            autoFocus
          />

          <Input
            label="TITLE:"
            labelClassName="text-[11px] font-black tracking-widest text-poker-green"
            placeholder="As a user, I can..."
            maxLength={80}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoComplete="off"
          />
        </ModalBody>

        <ModalFooter>
          <Dialog.Close render={<Button variant="ghost" size="md" type="button" />}>
            CANCEL
          </Dialog.Close>
          <Button variant="primary" size="md" type="submit" disabled={!isValid}>
            + ADD STORY
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
