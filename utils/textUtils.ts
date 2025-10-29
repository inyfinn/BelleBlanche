// utils/textUtils.ts
export const stripHtml = (html: string | null | undefined): string => {
  if (!html) return '';
  // This is a simple regex for stripping HTML tags. 
  // For production with complex descriptions, a more robust library might be better.
  return html.replace(/<[^>]*>?/gm, '');
};
