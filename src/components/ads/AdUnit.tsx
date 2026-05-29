'use client';

import React, { useEffect } from 'react';

type Props = {
  slot: string;
  format?: string;
  className?: string;
  style?: React.CSSProperties;
};

const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

export default function AdUnit({ slot, format = 'auto', className, style }: Props) {
  const shouldRender = Boolean(adsenseClient && slot);

  useEffect(() => {
    if (!shouldRender) return;

    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // swallow errors; ad script may not be loaded in dev
    }
  }, [slot, shouldRender]);

  if (!shouldRender) return null;

  return (
    <div className={className} style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={adsenseClient}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
