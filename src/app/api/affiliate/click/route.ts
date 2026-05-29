import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const outPath = path.join(process.cwd(), 'data', 'affiliate_clicks.ndjson');
    await fs.promises.mkdir(path.dirname(outPath), { recursive: true });
    const record = { receivedAt: Date.now(), ...body };
    await fs.promises.appendFile(outPath, JSON.stringify(record) + '\n', 'utf8');
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
