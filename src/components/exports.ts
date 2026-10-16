import { cheatSheetFileName, cheatSheetHtml } from '../engine/cheatsheet';
import type { Build } from '../engine/build';
import type { Item } from '../data/schema';
import { useStore } from '../store/build';

export function downloadFile(name: string, content: string, type: string) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([content], { type }));
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

/** Item reveal level from the gear page's spoiler settings. */
function revealFromStore() {
  const { spoilerLevel, revealed } = useStore.getState();
  return (item: Item) => Math.max(spoilerLevel, revealed[item.id] ?? 0) as 0 | 1 | 2;
}

export function downloadCheatSheet(build: Build) {
  downloadFile(cheatSheetFileName(build), cheatSheetHtml(build, { reveal: revealFromStore() }), 'text/html');
}

/** Opens the sheet in a new tab with the print dialog (Save as PDF). Returns false if a popup blocker stopped it. */
export function printCheatSheet(build: Build): boolean {
  const html = cheatSheetHtml(build, { reveal: revealFromStore(), autoPrint: true });
  const url = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
  const win = window.open(url, '_blank');
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
  return !!win;
}
