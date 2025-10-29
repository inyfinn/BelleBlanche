// utils/textUtils.ts
export const stripHtml = (html: string | null | undefined): string => {
  if (!html) return '';
  // This is a simple regex for stripping HTML tags. 
  // For production with complex descriptions, a more robust library might be better.
  return html.replace(/<[^>]*>?/gm, '');
};

export const decodeHtmlEntities = (text: string | null | undefined): string => {
    if (!text) return '';
    try {
        if (typeof window !== 'undefined') {
            const textArea = document.createElement('textarea');
            textArea.innerHTML = text;
            return textArea.value;
        }
    } catch (e) {
        console.error("Could not decode HTML entities", e);
    }
    // Fallback for server-side or errors
    return text
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'");
};
