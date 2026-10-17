import { Palette, Box, Mic, MapPin, Database, Radio, Globe } from 'lucide-react';
import '../styles/SignalsStrip.css';

const SIGNALS = [
  { label: 'Canvas fingerprinting', icon: Palette },
  { label: 'WebGL fingerprinting', icon: Box },
  { label: 'Audio fingerprinting', icon: Mic },
  { label: 'Location requests', icon: MapPin },
  { label: 'Cookies and storage', icon: Database },
  { label: 'Tracking beacons', icon: Radio },
  { label: 'Third-party traffic', icon: Globe }
];

export default function SignalsStrip() {
  return (
    <section className="signals-strip" aria-labelledby="signals-heading">
      <div className="container signals-strip__container">
        <div className="signals-strip__header">
          <h2 id="signals-heading" className="signals-strip__title">What it watches for</h2>
          <p className="signals-strip__description">
            Fingerprinting means a site quietly measures your browser and device to recognize you without cookies.
          </p>
        </div>
        
        <ul className="signals-strip__list">
          {SIGNALS.map((signal, index) => {
            const Icon = signal.icon;
            return (
              <li key={index} className="signals-strip__item">
                <div className="signals-strip__icon-wrapper">
                  <Icon size={24} aria-hidden="true" />
                </div>
                <span className="signals-strip__label">{signal.label}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}