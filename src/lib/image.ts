import type { ImageLoaderProps } from 'next/image';

const optimizer = process.env.NEXT_PUBLIC_IMAGE_OPTIMIZER;
const imagekitEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
const cloudflareDomain = process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGE_PROXY_DOMAIN;

export function getOptimizedImageUrl(src: string, width = 0, quality = 75): string {
  if (!src) {
    return src;
  }

  const normalizedSrc = src.trim();
  if (optimizer === 'imagekit' && imagekitEndpoint) {
    const endpoint = imagekitEndpoint.replace(/\/+$/, '');
    const params = [`f-auto`, `q-${Math.max(1, Math.min(100, quality))}`];
    if (width > 0) {
      params.unshift(`w-${width}`);
    }

    return `${endpoint}/tr:${params.join(',')}/${encodeURIComponent(normalizedSrc)}`;
  }

  if (optimizer === 'cloudflare' && cloudflareDomain) {
    const params = [];
    if (width > 0) {
      params.push(`width=${width}`);
    }
    params.push(`quality=${Math.max(1, Math.min(100, quality))}`);
    params.push('format=auto');

    if (normalizedSrc.startsWith('/')) {
      return `https://${cloudflareDomain}/cdn-cgi/image/${params.join(',')}${normalizedSrc}`;
    }

    try {
      const url = new URL(normalizedSrc);
      if (url.host === cloudflareDomain) {
        return `https://${cloudflareDomain}/cdn-cgi/image/${params.join(',')}${url.pathname}${url.search}`;
      }
    } catch {
      // ignore invalid URL and fall through to return raw src
    }

    return normalizedSrc;
  }

  return normalizedSrc;
}

export function optimizedImageLoader({ src, width, quality }: ImageLoaderProps): string {
  return getOptimizedImageUrl(src, width, quality ?? 75);
}
