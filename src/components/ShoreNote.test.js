import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import ShoreNote from './ShoreNote';

const english = {
  shoreSurprise: 'Discover a little shoreline surprise',
  shoreNoteTitle: 'A note from the shore',
  shoreNoteMessage: 'A little curiosity goes a long way. Thanks for exploring.',
  closeShoreNote: 'Close the shoreline note',
};

const japanese = {
  shoreSurprise: '海辺の小さなおまけを見る',
  shoreNoteTitle: '海辺からのメッセージ',
  shoreNoteMessage: '小さな好奇心が、次の発見につながります。見てくださってありがとうございます。',
  closeShoreNote: '海辺のメッセージを閉じる',
};

function note(labels = english) {
  return <ShoreNote labels={labels} copyright={<small>Trace Dugar</small>}
    backToTop={<a href="#home">Back to top</a>} />;
}

test('the optional note starts closed and opens without moving focus away from its trigger', () => {
  render(note());
  const trigger = screen.getByRole('button', { name: english.shoreSurprise });
  expect(trigger).toHaveAttribute('aria-expanded', 'false');
  expect(screen.queryByRole('region', { name: english.shoreNoteTitle })).not.toBeInTheDocument();
  trigger.focus();
  fireEvent.click(trigger);
  const disclosure = screen.getByRole('region', { name: english.shoreNoteTitle });
  expect(trigger).toHaveAttribute('aria-controls', disclosure.id);
  expect(trigger).toHaveAttribute('aria-expanded', 'true');
  expect(trigger).toHaveFocus();
  expect(screen.getByText(english.shoreNoteMessage)).toBeInTheDocument();
  fireEvent.click(trigger);
  expect(trigger).toHaveAttribute('aria-expanded', 'false');
  expect(screen.queryByRole('region', { name: english.shoreNoteTitle })).not.toBeInTheDocument();
});

test('Escape closes the note from the disclosure or trigger and restores trigger focus', () => {
  render(note());
  const trigger = screen.getByRole('button', { name: english.shoreSurprise });
  fireEvent.click(trigger);
  const close = screen.getByRole('button', { name: english.closeShoreNote });
  close.focus();
  fireEvent.keyDown(close, { key: 'Escape' });
  expect(trigger).toHaveFocus();
  expect(trigger).toHaveAttribute('aria-expanded', 'false');
  fireEvent.click(trigger);
  fireEvent.keyDown(trigger, { key: 'Escape' });
  expect(trigger).toHaveFocus();
  expect(screen.queryByRole('region', { name: english.shoreNoteTitle })).not.toBeInTheDocument();
});

test('the close button returns focus to the shell trigger', () => {
  render(note());
  const trigger = screen.getByRole('button', { name: english.shoreSurprise });
  fireEvent.click(trigger);
  const close = screen.getByRole('button', { name: english.closeShoreNote });
  close.focus();
  fireEvent.click(close);
  expect(trigger).toHaveFocus();
  expect(screen.queryByRole('region', { name: english.shoreNoteTitle })).not.toBeInTheDocument();
});

test('changing language translates an open note and keeps its disclosure association stable', () => {
  const { rerender } = render(note());
  const trigger = screen.getByRole('button', { name: english.shoreSurprise });
  fireEvent.click(trigger);
  const originalId = trigger.getAttribute('aria-controls');
  rerender(note(japanese));
  const translatedTrigger = screen.getByRole('button', { name: japanese.shoreSurprise });
  expect(translatedTrigger).toHaveAttribute('aria-expanded', 'true');
  expect(translatedTrigger).toHaveAttribute('aria-controls', originalId);
  expect(screen.getByRole('region', { name: japanese.shoreNoteTitle })).toHaveAttribute('id', originalId);
  expect(screen.getByText(japanese.shoreNoteMessage)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: japanese.closeShoreNote })).toBeInTheDocument();
  expect(screen.queryByText(english.shoreNoteMessage)).not.toBeInTheDocument();
});
