import type { Metadata } from 'next';

// Paths resolve against layout.metadataBase. Keep staging noindex inherited;
// do not infer verified company data or a public-launch decision from metadata.
export function pageMetadata(title: string, description: string, path: string, absoluteTitle = false): Metadata {
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, locale: 'vi_VN', type: 'website', siteName: 'Sunflower' },
  };
}
