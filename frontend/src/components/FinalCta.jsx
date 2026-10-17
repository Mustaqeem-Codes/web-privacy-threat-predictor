import { scrollToSection } from '../utils/scrollToSection';
import '../styles/FinalCta.css';

const ChromeIcon = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="4" />
    <line x1="21.17" y1="8" x2="12" y2="8" />
    <line x1="3.95" y1="6.06" x2="8.54" y2="14" />
    <line x1="10.88" y1="21.94" x2="15.46" y2="14" />
  </svg>
);

export default function FinalCta() {
  const handleDemoClick = (e) => {
    e.preventDefault();
    scrollToSection('#demo');
  };

  return (
    <section className="final-cta" aria-labelledby="final-cta-heading">
      <div className="container final-cta__container">
        <h2 id="final-cta-heading" className="final-cta__title">
          Check the next site before you trust it.
        </h2>
        
        <div className="final-cta__actions">
          <button type="button" className="btn btn--lg final-cta__btn-primary" onClick={() => {}}>
            <ChromeIcon size={24} />
            Add to Chrome
          </button>
          <a 
            href="#demo" 
            className="btn btn--lg final-cta__btn-secondary"
            onClick={handleDemoClick}
          >
            Try the live demo
          </a>
        </div>
      </div>
    </section>
  );
}