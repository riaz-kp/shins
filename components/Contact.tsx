import { site } from '@/lib/content';
import { Magnetic } from './Magnetic';
import { SplitText } from './SplitText';

export function Contact() {
  return (
    <section className="contact" id="contact" aria-labelledby="contact-title">
      <p className="label" data-reveal>(05) Contact</p>
      <h2 id="contact-title" className="contact-title">
        <span className="line"><SplitText text="Let’s make" onView /></span>
        <span className="line"><SplitText text="something." as="em" onView /></span>
      </h2>
      <svg className="scribble" viewBox="0 0 600 40" aria-hidden="true">
        <path pathLength={1} d="M4 30c80-22 160-24 240-10s170 12 250-8c30-7 60-10 100-6" />
      </svg>
      <p className="contact-lede" data-reveal>A home, a film set, an illustration or a wall that needs a story — say hello.</p>
      <div className="contact-links" data-reveal>
        <Magnetic className="btn btn--big" href={site.instagram} target="_blank" rel="noopener">
          Instagram <span>@shinsjoy</span> ↗
        </Magnetic>
        <Magnetic className="btn btn--ghost" href={site.threads} target="_blank" rel="noopener">Threads ↗</Magnetic>
        {site.email && <Magnetic className="btn btn--ghost" href={`mailto:${site.email}`}>Email ↗</Magnetic>}
      </div>
    </section>
  );
}
