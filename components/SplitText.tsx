import type { CSSProperties } from 'react';

type Props = {
  text: string;
  as?: 'span' | 'em';
  className?: string;
  /** Adds the rise-in animation (letters hidden until `.is-in`); off for hover-only text. */
  animate?: boolean;
  /** Reveal when scrolled into view (handled by RevealObserver). */
  onView?: boolean;
  /** Extra delay before the first letter, in ms. */
  delay?: number;
};

/** Renders text as one span per letter, with a screen-reader copy of the whole string. */
export function SplitText({ text, as: Tag = 'span', className, animate = true, onView, delay }: Props) {
  const cls = [animate && 'split', className].filter(Boolean).join(' ') || undefined;
  return (
    <Tag
      className={cls}
      data-split-on-view={onView ? '' : undefined}
      style={delay ? ({ '--sd': `${delay}ms` } as CSSProperties) : undefined}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {Array.from(text).map((ch, i) => (
          <span key={i} className="char" style={{ '--i': i } as CSSProperties}>
            {ch === ' ' ? ' ' : ch}
          </span>
        ))}
      </span>
    </Tag>
  );
}
