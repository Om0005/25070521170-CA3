/**
 * Fixed, non-interactive backdrop: a soft aurora made of drifting colour
 * blobs, a faint grid and a top highlight. Gives every glass panel something
 * colourful to blur against.
 */
export default function Backdrop() {
  return (
    <div className="app-bg" aria-hidden="true">
      <span className="app-bg__blob app-bg__blob--1" />
      <span className="app-bg__blob app-bg__blob--2" />
      <span className="app-bg__blob app-bg__blob--3" />
      <span className="app-bg__blob app-bg__blob--4" />
      <span className="app-bg__blob app-bg__blob--5" />
      <span className="app-bg__grid" />
      <span className="app-bg__glow" />
    </div>
  );
}
