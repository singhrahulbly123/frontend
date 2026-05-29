'use client';

import React, { useEffect, useState } from 'react';

type Offer = { id: string; title: string; price?: string; commission?: number; url: string; pros?: string[] };

export default function AffiliateComparison({ source = '/api/affiliate/offers' }: { source?: string }) {
  const [offers, setOffers] = useState<Offer[]>([]);

  useEffect(() => {
    fetch(source).then((r) => r.json()).then((data) => setOffers(data.offers || [])).catch(() => setOffers([]));
  }, [source]);

  async function handleClick(offer: Offer) {
    try {
      await fetch('/api/affiliate/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: offer.id, url: offer.url }),
      });
    } catch {}
    // navigate
    window.open(offer.url, '_blank', 'noopener');
  }

  if (!offers.length) return null;

  return (
    <div className="affiliate-comparison" style={{ border: '1px solid #eee', padding: 12, borderRadius: 8 }}>
      <h3>Compare Offers</h3>
      <div style={{ display: 'flex', gap: 12, overflowX: 'auto' }}>
        {offers.map((o) => (
          <div key={o.id} style={{ minWidth: 220, border: '1px solid #ddd', padding: 12, borderRadius: 6 }}>
            <h4 style={{ margin: 0 }}>{o.title}</h4>
            <p style={{ margin: '8px 0' }}>{o.price ? `Price: ${o.price}` : ''}</p>
            <p style={{ margin: '8px 0' }}>{o.commission ? `Commission: ₹${o.commission}` : ''}</p>
            <ul style={{ margin: '8px 0', paddingLeft: 16 }}>
              {(o.pros || []).slice(0, 3).map((p, i) => <li key={i}>{p}</li>)}
            </ul>
            <button onClick={() => handleClick(o)} style={{ background: '#f97316', color: '#fff', border: 'none', padding: '8px 10px', borderRadius: 4 }}>
              View Offer
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
