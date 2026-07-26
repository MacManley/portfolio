const WORDS_PER_MINUTE = 200;

// Strip markdown syntax so code blocks and link URLs don't inflate the count.
export function countWords(markdown = '') {
  const text = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, ' ')
    .replace(/[*_~>|]/g, ' ');

  return text.split(/\s+/).filter(Boolean).length;
}

export function readingMinutes(markdown = '') {
  return Math.max(1, Math.round(countWords(markdown) / WORDS_PER_MINUTE));
}
