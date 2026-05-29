import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const file = path.join(process.cwd(), 'data', 'affiliate_offers.json');
    const raw = await fs.promises.readFile(file, 'utf8');
    const offers = JSON.parse(raw);
    return NextResponse.json({ offers });
  } catch {
    return NextResponse.json({ offers: [] });
  }
}
