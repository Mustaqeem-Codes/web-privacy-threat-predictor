import { Check, X, Info } from 'lucide-react';
import '../styles/PrivacyHonesty.css';

export default function PrivacyHonesty() {
  return (
    <section id="privacy" className="privacy-honesty" aria-labelledby="privacy-heading">
      <div className="container privacy-honesty__container">
        <h2 id="privacy-heading" className="privacy-honesty__title">
          Your privacy, and our limits
        </h2>

        <div className="privacy-honesty__cards">
          <div className="privacy-honesty__card">
            <h3 className="privacy-honesty__card-title">What we keep</h3>
            <ul className="privacy-honesty__list">
              <li>
                <Check className="privacy-honesty__icon privacy-honesty__icon--keep" size={20} aria-hidden="true" />
                <span>The site's hostname</span>
              </li>
              <li>
                <Check className="privacy-honesty__icon privacy-honesty__icon--keep" size={20} aria-hidden="true" />
                <span>The verdict and reasons</span>
              </li>
              <li>
                <Check className="privacy-honesty__icon privacy-honesty__icon--keep" size={20} aria-hidden="true" />
                <span>Your feedback</span>
              </li>
            </ul>
          </div>

          <div className="privacy-honesty__card">
            <h3 className="privacy-honesty__card-title">What we never keep</h3>
            <ul className="privacy-honesty__list">
              <li>
                <X className="privacy-honesty__icon privacy-honesty__icon--never" size={20} aria-hidden="true" />
                <span>Full page addresses</span>
              </li>
              <li>
                <X className="privacy-honesty__icon privacy-honesty__icon--never" size={20} aria-hidden="true" />
                <span>Search words</span>
              </li>
              <li>
                <X className="privacy-honesty__icon privacy-honesty__icon--never" size={20} aria-hidden="true" />
                <span>Page content</span>
              </li>
              <li>
                <X className="privacy-honesty__icon privacy-honesty__icon--never" size={20} aria-hidden="true" />
                <span>Anything you type</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="privacy-honesty__limits">
          <div className="privacy-honesty__limits-header">
            <Info className="privacy-honesty__limits-icon" size={24} aria-hidden="true" />
            <h3 className="privacy-honesty__limits-title">Good to know</h3>
          </div>
          <ul className="privacy-honesty__limits-list">
            <li><strong>Proof of concept:</strong> Trained on a few hundred sites.</li>
            <li><strong>Data sources:</strong> Labels come from public tracker-domain lists, not proven harm.</li>
            <li><strong>Scope:</strong> Analyzes homepages only, no clicks.</li>
            <li><strong>Accuracy:</strong> Verdicts are estimates, not guarantees.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}