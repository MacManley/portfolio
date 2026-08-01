import { useState } from 'react';

export default function TimelineLogo({ src, alt }) {
  const [errored, setErrored] = useState(false);
  // No src at all renders the alt text in a broken <img>, so treat it as a miss.
  const showFallback = errored || !src;

  return (
    <div className="timeline-logo">
      {!showFallback && (
        <img src={src} alt={alt} onError={() => setErrored(true)} />
      )}
      {showFallback && <span className="timeline-logo-fallback">{alt.charAt(0)}</span>}
    </div>
  );
}
