import { useState } from 'react';

// Several covers are logos on white. Blurring one of those into an ambient fill
// produces a grey wash, so measure each cover once and let the CSS treat light
// ones differently. Cached per project id — the sample never changes.
const coverToneCache = new Map();

function measureCoverTone(image) {
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) return null;

    context.drawImage(image, 0, 0, 16, 16);
    const { data } = context.getImageData(0, 0, 16, 16);

    let total = 0;
    for (let i = 0; i < data.length; i += 4) {
        total += 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
    }

    return total / (data.length / 4) > 150 ? 'light' : 'dark';
}

/**
 * Cover art for a project card: the image is contained, never cropped, over a
 * blurred and scaled copy of itself. The box can therefore be any shape — the
 * picture stays whole and only the ambient fill changes as the card resizes.
 */
export default function ProjectCover({ project, eager = false, children }) {
    const [tone, setTone] = useState(() => coverToneCache.get(project.id) || 'dark');
    // A project without a cover asset would otherwise render the alt text across
    // the card — fall back to a plain monogram plate instead.
    const [failed, setFailed] = useState(false);
    const src = `/assets/${project.id}.webp`;

    const handleLoad = (event) => {
        if (coverToneCache.has(project.id)) return;

        try {
            const measured = measureCoverTone(event.currentTarget);
            if (measured) {
                coverToneCache.set(project.id, measured);
                setTone(measured);
            }
        } catch {
            // Tainted canvas (cross-origin cover) — keep the dark default.
        }
    };

    const loading = eager ? 'eager' : 'lazy';

    return (
        <div className={`project-image${tone === 'light' ? ' has-light-cover' : ''}`}>
            {failed ? (
                <div className="cover-missing" aria-hidden="true">
                    {project.projectName.charAt(0)}
                </div>
            ) : (
                <>
                    <img
                        className="cover-backdrop"
                        src={src}
                        alt=""
                        aria-hidden="true"
                        loading={loading}
                        decoding="async"
                        onLoad={handleLoad}
                        onError={() => setFailed(true)}
                    />
                    <img
                        className="cover-art"
                        src={src}
                        alt={project.projectName}
                        loading={loading}
                        decoding="async"
                        {...(eager ? { fetchPriority: 'high' } : {})}
                        onError={() => setFailed(true)}
                    />
                </>
            )}
            {children}
        </div>
    );
}
