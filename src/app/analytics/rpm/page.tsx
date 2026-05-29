import fs from 'fs';
import path from 'path';

type ViewabilityEvent = { slot?: string };
type RevenueEvent = { slot?: string; revenue?: number | string };

export default async function Page() {
  const viewPath = path.join(process.cwd(), 'data', 'viewability.ndjson');
  const rpmPath = path.join(process.cwd(), 'data', 'rpm.ndjson');
  let viewLines: string[] = [];
  let rpmLines: string[] = [];
  try {
    const raw = await fs.promises.readFile(viewPath, 'utf8');
    viewLines = raw.split('\n').filter(Boolean);
  } catch {}
  try {
    const raw2 = await fs.promises.readFile(rpmPath, 'utf8');
    rpmLines = raw2.split('\n').filter(Boolean);
  } catch {}

  const views = viewLines.map((line) => JSON.parse(line) as ViewabilityEvent).filter(Boolean);
  const revenues = rpmLines.map((line) => JSON.parse(line) as RevenueEvent).filter(Boolean);

  const aggViews: Record<string, { impressions: number }> = {};
  views.forEach((v) => {
    const s = v.slot || 'unknown';
    aggViews[s] = aggViews[s] || { impressions: 0 };
    aggViews[s].impressions += 1;
  });

  const aggRev: Record<string, { revenue: number }> = {};
  revenues.forEach((r) => {
    const s = r.slot || 'unknown';
    aggRev[s] = aggRev[s] || { revenue: 0 };
    aggRev[s].revenue += Number(r.revenue || 0);
  });

  const rows = Object.keys({ ...aggViews, ...aggRev }).map((slot) => {
    const impressions = aggViews[slot]?.impressions || 0;
    const revenue = aggRev[slot]?.revenue || 0;
    const rpm = impressions ? (revenue / (impressions / 1000)) : 0;
    return { slot, impressions, revenue: Math.round(revenue * 100) / 100, rpm: Math.round(rpm * 100) / 100 };
  });

  return (
    <div style={{ padding: 20 }}>
      <h1>RPM Dashboard (Estimated)</h1>
      <p>This computes RPM = revenue / (impressions/1000). Revenue must be ingested via `/api/rpm`.</p>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: 8 }}>Slot</th>
            <th style={{ textAlign: 'right', padding: 8 }}>Impressions</th>
            <th style={{ textAlign: 'right', padding: 8 }}>Revenue</th>
            <th style={{ textAlign: 'right', padding: 8 }}>RPM</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.slot}>
              <td style={{ padding: 8, borderTop: '1px solid #eee' }}>{r.slot}</td>
              <td style={{ padding: 8, borderTop: '1px solid #eee', textAlign: 'right' }}>{r.impressions}</td>
              <td style={{ padding: 8, borderTop: '1px solid #eee', textAlign: 'right' }}>{r.revenue}</td>
              <td style={{ padding: 8, borderTop: '1px solid #eee', textAlign: 'right' }}>{r.rpm}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
