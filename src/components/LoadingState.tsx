export function LoadingState() {
  return (
    <div className="state-card" role="status">
      <span className="loading-mark" aria-hidden="true" />
      <p>La forge chauffe…</p>
    </div>
  );
}
