import { useState } from 'react';

export default function TimelineLogo({ src, alt }) {
  const [errored, setErrored] = useState(false);

  return (
    <div className="timeline-logo">
      {!errored && (
        <img src={src} alt={alt} onError={() => setErrored(true)} />
      )}
      {errored && <span className="timeline-logo-fallback">{alt.charAt(0)}</span>}
    </div>
  );
}
