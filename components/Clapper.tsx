/** Decorative clapperboard; the arm snaps shut when it scrolls into view. */
export function Clapper({ production, scene, take }: { production: string; scene: string; take: string }) {
  return (
    <div className="clapper" aria-hidden="true">
      <div className="clapper-arm" />
      <div className="clapper-board">
        <span>Prod. <b>{production}</b></span>
        <span>Scene <b>{scene}</b></span>
        <span>Take <b>{take}</b></span>
      </div>
    </div>
  );
}
