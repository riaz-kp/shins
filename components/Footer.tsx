import { site } from '@/lib/content';
import { SplitText } from './SplitText';

export function Footer() {
  return (
    <footer className="footer">
      <p className="footer-name" aria-hidden="true"><SplitText text={site.name} animate={false} /></p>
      <div className="footer-row">
        <span>© 2026 {site.name} · {site.location}</span>
        <span>Architecture · Set Design · Illustration · Wall Art</span>
        <a href="#top" className="to-top">Back to top ↑</a>
      </div>
    </footer>
  );
}
