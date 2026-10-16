import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast';
import { originProgress } from '../components/progress';
import { downloadCheatSheet, downloadFile, printCheatSheet } from '../components/exports';
import { deriveBuild } from '../engine/build';
import { encodeShare, exportBuild, parseChoices } from '../engine/share';
import { useBuild, useStore } from '../store/build';

export function Builds() {
  const build = useBuild();
  const { saved, save, load, remove, reset, replace } = useStore();
  const file = useRef<HTMLInputElement>(null);
  const toast = useToast();
  const navigate = useNavigate();
  const title = build.choices.name || `${build.subrace?.name ?? build.race.name} ${build.cls.name}`;

  const shareUrl = () => `${location.origin}${location.pathname}#/share/${encodeShare(build.choices)}`;

  const download = () =>
    downloadFile(`${title.replace(/[^a-z0-9]+/gi, '-').toLowerCase() || 'build'}.bg3build.json`, exportBuild(build.choices), 'application/json');

  const importFile = async (f: File) => {
    try {
      const choices = parseChoices(JSON.parse(await f.text()));
      if (!choices) throw new Error('invalid');
      replace(choices);
      toast.show('Build imported');
      navigate('/character');
    } catch {
      toast.show('That file is not a valid build');
    }
  };

  return (
    <div className="stack">
      {toast.node}
      <div className="page-head">
        <div>
          <h1>Builds</h1>
          <p>Builds are saved in this browser. Export a file or share a link to move a build to another device.</p>
        </div>
      </div>
      <div className="card">
        <h2>Current: {title}</h2>
        <p className="muted small">
          {build.subrace?.name ?? build.race.name} {build.cls.name} · {build.sub.name} · {build.background.name} ·{' '}
          {originProgress(build)}
        </p>
        <div className="row">
          <button className="btn btn-primary" onClick={() => toast.show(`Saved “${save()}”`)}>
            Save
          </button>
          <button
            className="btn"
            onClick={() =>
              navigator.clipboard?.writeText(shareUrl()).then(
                () => toast.show('Share link copied'),
                () => toast.show('Could not copy the link'),
              )
            }
          >
            Copy share link
          </button>
          <button className="btn" onClick={download}>
            Export file
          </button>
          <button className="btn" onClick={() => file.current?.click()}>
            Import file
          </button>

          <input
            ref={file}
            type="file"
            accept=".json,application/json"
            hidden
            onChange={(e) => e.target.files?.[0] && importFile(e.target.files[0])}
          />
          <button
            className="btn btn-danger"
            onClick={() => {
              if (confirm('Start a new character? Unsaved changes to the current build will be lost.')) {
                reset();
                navigate('/origin');
              }
            }}
          >
            New character
          </button>
        </div>
      </div>
      <div className="card">
        <h2>Cheat sheet</h2>
        <p className="muted small">
          A one-page reference to keep next to the game: what to pick in the character creator, stats, the level-by-level
          plan, spells, gear goals and your backstory. Gear names and locations appear only if you revealed them on the
          Gear page.
        </p>
        <div className="row">
          <button className="btn btn-primary" onClick={() => downloadCheatSheet(build)} data-testid="cheatsheet-download">
            Download cheat sheet (.html)
          </button>
          <button className="btn" onClick={() => printCheatSheet(build) || toast.show('Allow pop-ups to print the cheat sheet')}>
            Print / save as PDF
          </button>
        </div>
      </div>
      <div className="card">
        <h2>Saved builds</h2>
        {saved.length === 0 && <div className="empty">No saved builds yet.</div>}
        {saved.map((b) => {
          const d = deriveBuild(b.choices);
          return (
            <div className="build-row" key={b.id}>
              <div>
                <b>{b.name}</b>
                <div className="faint">
                  {d.subrace?.name ?? d.race.name} {d.cls.name} · {d.sub.name} · saved {new Date(b.savedAt).toLocaleString()}
                </div>
              </div>
              <div className="row">
                <button
                  className="btn btn-sm"
                  onClick={() => {
                    load(b.id);
                    navigate('/character');
                  }}
                >
                  Load
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => confirm(`Delete “${b.name}”?`) && remove(b.id)}>
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
