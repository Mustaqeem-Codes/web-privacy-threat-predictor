import { CheckCircle, AlertTriangle, ShieldAlert } from 'lucide-react';
import '../styles/VerdictLevels.css';

const LEVELS = [
  {
    id: 'safe',
    label: 'Safe',
    description: 'Little or no tracking behavior seen.',
    icon: CheckCircle
  },
  {
    id: 'suspicious',
    label: 'Suspicious',
    description: 'Some tracking signals. Worth a closer look.',
    icon: AlertTriangle
  },
  {
    id: 'threat',
    label: 'Threat',
    description: 'Strong signs of data harvesting.',
    icon: ShieldAlert
  }
];

export default function VerdictLevels() {
  return (
    <section className="verdict-levels" aria-labelledby="verdict-levels-heading">
      <div className="container verdict-levels__container">
        <h2 id="verdict-levels-heading" className="verdict-levels__title">
          Three levels, always labelled
        </h2>
        
        <div className="verdict-levels__grid">
          {LEVELS.map((level) => {
            const Icon = level.icon;
            return (
              <div key={level.id} className={`verdict-levels__card verdict-levels__card--${level.id}`}>
                <div className="verdict-levels__header">
                  <Icon size={28} aria-hidden="true" />
                  <h3 className="verdict-levels__label">{level.label}</h3>
                </div>
                <p className="verdict-levels__description">{level.description}</p>
              </div>
            );
          })}
        </div>
        
        <p className="verdict-levels__footer-note">
          When the model is unsure, it says "I'm not sure" instead of guessing.
        </p>
      </div>
    </section>
  );
}