export function TruckCardSkeleton() {
  return (
    <div className="sk-card" aria-hidden="true">
      <div className="sk-img" />
      <div className="sk-body">
        <div className="sk-line sk-title" />
        <div className="sk-line sk-sub" />
        <div className="sk-row">
          <div className="sk-line sk-tag" />
          <div className="sk-line sk-tag" />
        </div>
        <div className="sk-line sk-price" />
      </div>
      <style>{`
        .sk-card {
          border-radius: 16px;
          overflow: hidden;
          background: var(--surface);
          border: 1px solid var(--line);
          box-shadow: var(--shadow);
          animation: sk-pulse 1.4s ease-in-out infinite;
        }
        .sk-img {
          width: 100%;
          aspect-ratio: 4/3;
          background: var(--soft);
        }
        .sk-body {
          padding: 12px 14px 14px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .sk-line {
          border-radius: 6px;
          background: var(--soft);
        }
        .sk-title { height: 16px; width: 80%; }
        .sk-sub   { height: 13px; width: 55%; }
        .sk-row   { display: flex; gap: 8px; }
        .sk-tag   { height: 22px; width: 60px; border-radius: 99px; }
        .sk-price { height: 20px; width: 45%; margin-top: 4px; }
        @keyframes sk-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: .45; }
        }
      `}</style>
    </div>
  );
}

export function TruckGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 18 }}>
      {Array.from({ length: count }).map((_, i) => <TruckCardSkeleton key={i} />)}
    </div>
  );
}
