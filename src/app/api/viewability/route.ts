import fs from 'fs';
import os from 'os';
import path from 'path';
import { NextResponse } from 'next/server';

type ViewabilityEvent = Record<string, unknown>;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const events: ViewabilityEvent[] = Array.isArray(body.events) ? body.events : [];
    const dataDir = process.env.VIEWABILITY_DATA_PATH || path.join(os.tmpdir(), 'pulsevian', 'analytics');
    const outPath = path.join(dataDir, 'viewability.ndjson');
    await fs.promises.mkdir(path.dirname(outPath), { recursive: true });
    const lines = events.map((event) => JSON.stringify({ receivedAt: Date.now(), ...event })).join('\n') + '\n';
    await fs.promises.appendFile(outPath, lines, 'utf8');
    return NextResponse.json({ ok: true, stored: events.length, path: outPath });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
