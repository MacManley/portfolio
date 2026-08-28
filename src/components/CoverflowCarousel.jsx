import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import './CoverflowCarousel.css';

// Past this much pointer travel a press was a drag, and the release must not
// also read as a click on the card underneath.
const DRAG_SLOP = 6;

/**
 * A coverflow rake: cards sit on one ring, tilting and receding as they travel
 * out from the centre. Position is a single fractional index — dragging moves it
 * continuously, keys and dots settle it onto whole numbers, and looping folds
 * the distance the short way round rather than cloning any nodes.
 */
export default function CoverflowCarousel({
    slides,
    renderSlide,
    onActivate,
    onFocusSlide,
    rotate = 44,
    depth = 0.6,
    perspective = 3,
    falloff = 0.56,
    fade = 0.1,
    gap = 0.05,
    loop = true,
    label = 'Project covers',
}) {
    const count = slides.length;

    const frameRef = useRef(null);
    const cardRefs = useRef([]);
    /** Fractional card index at the centre. The single source of truth. */
    const posRef = useRef(0);
    /** Where the current settle is headed. Stepping off `pos` instead would
        swallow a keypress that lands mid-flight, before the round-off moves. */
    const targetRef = useRef(0);
    const widthRef = useRef(0);
    const rafRef = useRef(null);
    const dragRef = useRef(null);
    const draggedRef = useRef(false);

    const [selected, setSelected] = useState(0);

    /** Nearest whole card, folded back into 0..count-1. */
    const indexAt = useCallback(
        (pos) => ((Math.round(pos) % count) + count) % count,
        [count]
    );

    // Paint straight to the DOM. Sixty state updates a second would re-render
    // every card for numbers React never needs to see.
    const paint = useCallback(() => {
        const width = widthRef.current;
        if (!width) return;
        const pitch = width * (1 + gap);
        const pos = posRef.current;

        cardRefs.current.forEach((card, index) => {
            if (!card) return;

            // Fold the distance into the shorter way round the ring. This is the
            // whole looping mechanism — no cloned nodes, no shuffling the DOM.
            let offset = index - pos;
            if (loop) {
                offset = ((offset % count) + count) % count;
                if (offset > count / 2) offset -= count;
            }

            const distance = Math.abs(offset);
            // Both the tilt and the recession ease off as cards travel out —
            // doubling the distance adds only about half again as much of each.
            // A linear ramp folds the second card shut; this keeps it readable.
            const ramp = Math.pow(distance, falloff);
            // Capped short of edge-on so a far card never turns its back.
            const tilt = Math.min(rotate * ramp, 82) * Math.sign(offset);

            card.style.transform =
                `translateX(calc(-50% + ${offset * pitch}px)) ` +
                `translateZ(${-depth * width * ramp}px) rotateY(${-tilt}deg)`;

            // A card is teleported across the ring at exactly half a turn out, so
            // it has to be gone by then or the jump is visible.
            const edge = loop ? Math.min(1, Math.max(0, count / 2 - distance)) : 1;
            card.style.opacity = String(Math.max(0, 1 - fade * distance) * edge);
            card.style.zIndex = String(100 - Math.round(distance));
            // Only the front card takes the pointer; the rest are scenery.
            card.style.pointerEvents = distance < 0.5 ? 'auto' : 'none';
        });
    }, [count, depth, fade, falloff, gap, loop, rotate]);

    const settle = useCallback(
        (target) => {
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
            targetRef.current = target;
            setSelected(indexAt(target));

            const step = () => {
                const remaining = target - posRef.current;
                if (Math.abs(remaining) < 0.0004) {
                    posRef.current = target;
                    paint();
                    rafRef.current = null;
                    return;
                }
                // Exponential ease-out, not a spring — no overshoot wanted here.
                posRef.current += remaining * 0.16;
                paint();
                rafRef.current = requestAnimationFrame(step);
            };
            rafRef.current = requestAnimationFrame(step);
        },
        [indexAt, paint]
    );

    const clamp = useCallback(
        (pos) => (loop ? pos : Math.max(0, Math.min(count - 1, pos))),
        [count, loop]
    );

    const goTo = useCallback(
        (index) => {
            // Take the shorter way round rather than unwinding the whole ring.
            const target = loop
                ? index + Math.round((targetRef.current - index) / count) * count
                : index;
            settle(clamp(target));
        },
        [clamp, count, loop, settle]
    );

    const nudge = useCallback(
        (by) => settle(clamp(Math.round(targetRef.current) + by)),
        [clamp, settle]
    );

    const onPointerDown = (event) => {
        if (rafRef.current !== null) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }
        event.currentTarget.setPointerCapture(event.pointerId);
        targetRef.current = posRef.current;
        draggedRef.current = false;
        dragRef.current = {
            id: event.pointerId,
            x: event.clientX,
            pos: posRef.current,
            v: 0,
            t: performance.now(),
            travel: 0,
        };
    };

    const onPointerMove = (event) => {
        const drag = dragRef.current;
        if (!drag || drag.id !== event.pointerId) return;

        const pitch = widthRef.current * (1 + gap);
        if (!pitch) return;

        drag.travel = Math.max(drag.travel, Math.abs(event.clientX - drag.x));
        if (drag.travel > DRAG_SLOP) draggedRef.current = true;

        const now = performance.now();
        const previous = posRef.current;
        posRef.current = clamp(drag.pos - (event.clientX - drag.x) / pitch);
        // Cards per second, for the throw.
        drag.v = ((posRef.current - previous) / Math.max(now - drag.t, 1)) * 1000;
        drag.t = now;

        const index = indexAt(posRef.current);
        if (index !== selected) setSelected(index);
        paint();
    };

    const endDrag = (event) => {
        const drag = dragRef.current;
        if (!drag || drag.id !== event.pointerId) return;
        dragRef.current = null;
        // Let a flick carry, but never more than two cards.
        const carried = Math.max(-2, Math.min(2, drag.v * 0.18));
        settle(clamp(Math.round(posRef.current + carried)));
    };

    // Card width drives pitch, depth and perspective, so it is the only thing
    // worth measuring — and only when the box actually changes.
    useLayoutEffect(() => {
        const frame = frameRef.current;
        if (!frame) return;

        const measure = () => {
            const card = cardRefs.current[0];
            if (!card) return;
            widthRef.current = card.offsetWidth;
            paint();
        };

        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(frame);
        return () => observer.disconnect();
    }, [paint]);

    useEffect(() => () => {
        if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    }, []);

    // Hovering the front card should prime the same work a list row primes.
    useEffect(() => {
        if (onFocusSlide && slides[selected]) onFocusSlide(slides[selected], selected);
    }, [selected, slides, onFocusSlide]);

    if (count === 0) return null;

    return (
        <div className="coverflow" role="region" aria-roledescription="carousel" aria-label={label}>
            <div
                ref={frameRef}
                className="coverflow-frame"
                tabIndex={0}
                style={{ perspective: `calc(var(--cf-card) * ${perspective})` }}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                onKeyDown={(event) => {
                    if (event.key === 'ArrowLeft') {
                        event.preventDefault();
                        nudge(-1);
                    } else if (event.key === 'ArrowRight') {
                        event.preventDefault();
                        nudge(1);
                    } else if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        onActivate?.(slides[selected], selected);
                    }
                }}
            >
                <div className="coverflow-stage">
                    {slides.map((slide, index) => (
                        <div
                            key={slide.id ?? index}
                            ref={(node) => { cardRefs.current[index] = node; }}
                            className="coverflow-card"
                            role="group"
                            aria-roledescription="slide"
                            aria-label={`${index + 1} of ${count}`}
                            onClick={() => {
                                // A release that ended a drag is not a click.
                                if (draggedRef.current) return;
                                if (index === selected) onActivate?.(slide, index);
                                else goTo(index);
                            }}
                        >
                            {renderSlide(slide, index === selected)}
                        </div>
                    ))}
                </div>
            </div>

            <div className="coverflow-dots">
                {slides.map((slide, index) => (
                    <button
                        key={slide.id ?? index}
                        type="button"
                        className={`coverflow-dot${index === selected ? ' is-active' : ''}`}
                        aria-label={`Go to project ${index + 1}`}
                        aria-current={index === selected}
                        onClick={() => goTo(index)}
                    />
                ))}
            </div>
        </div>
    );
}
