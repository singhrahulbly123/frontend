import fs from 'fs';
import path from 'path';

type ViewabilityEvent = {
  slot?: string;
  durationMs?: number | string;
};

export default async function Page() {
  const filePath = path.join(process.cwd(), 'data', 'viewability.ndjson');
  let lines: string[] = [];
  try {
    const raw = await fs.promises.readFile(filePath, 'utf8');
    lines = raw.split('\n').filter(Boolean);
  } catch {
    // no data yet
  }
  const events = lines.map((l) => {
    try {
      return JSON.parse(l) as ViewabilityEvent;
    } catch {
      return null;
    }
  }).filter((event): event is ViewabilityEvent => event !== null);

  const agg: Record<string, { impressions: number; totalVisibleMs: number; avgVisibleMs: number }> = {};
  events.forEach((ev) => {
    const slot = ev.slot || 'unknown';
    if (!agg[slot]) agg[slot] = { impressions: 0, totalVisibleMs: 0, avgVisibleMs: 0 };
    agg[slot].impressions += 1;
    agg[slot].totalVisibleMs += Number(ev.durationMs || 0);
  });
  Object.keys(agg).forEach((k) => {
    const a = agg[k];
    a.avgVisibleMs = a.impressions ? Math.round(a.totalVisibleMs / a.impressions) : 0;
  });

  return (
    <div style={{ padding: 20 }}>
      <h1>Viewability Dashboard</h1>
      <p>Aggregated viewability from `frontend/data/viewability.ndjson`</p>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: 8 }}>Slot</th>
            <th style={{ textAlign: 'right', padding: 8 }}>Impressions</th>
            <th style={{ textAlign: 'right', padding: 8 }}>Total Visible (ms)</th>
            <th style={{ textAlign: 'right', padding: 8 }}>Avg Visible (ms)</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(agg).map(([slot, data]) => (
            <tr key={slot}>
              <td style={{ padding: 8, borderTop: '1px solid #eee' }}>{slot}</td>
              <td style={{ padding: 8, borderTop: '1px solid #eee', textAlign: 'right' }}>{data.impressions}</td>
              <td style={{ padding: 8, borderTop: '1px solid #eee', textAlign: 'right' }}>{data.totalVisibleMs}</td>
              <td style={{ padding: 8, borderTop: '1px solid #eee', textAlign: 'right' }}>{data.avgVisibleMs}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
