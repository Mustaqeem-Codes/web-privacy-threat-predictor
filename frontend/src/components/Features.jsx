import {
  List, 
  CircleHelp, 
  Shield, 
  History, 
  MessageSquare, 
  ThumbsUp 
} from 'lucide-react';
import '../styles/Features.css';

const FEATURES = [
  {
    title: 'Explained, not just scored',
    description: 'Every verdict comes with the top reasons behind it.',
    icon: List
  },
  {
    title: 'Honest about doubt',
    description: 'When the model is not sure, it tells you.',
    icon: CircleHelp
  },
  {
    title: 'Privacy by design',
    description: "Only the site's hostname is saved, never full addresses or page content.",
    icon: Shield
  },
  {
    title: 'History you can review',
    description: 'Look back at the sites you checked and why they got their verdict.',
    icon: History
  },
  {
    title: 'Plain-English explanations',
    description: 'An AI assistant rewrites the reasons in simple words. It cannot change the verdict.',
    icon: MessageSquare
  },
  {
    title: 'Your feedback counts',
    description: 'Tell us when a verdict looks wrong. Feedback is saved to improve future versions.',
    icon: ThumbsUp
  }
];

export default function Features() {
  return (
    <section id="features" className="features" aria-labelledby="features-heading">
      <div className="container features__container">
        <div className="features__header">
          <h2 id="features-heading" className="features__title">
            Built to be understood, not just obeyed
          </h2>
        </div>
        
        <ul className="features__grid">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <li key={index} className="features__card">
                <div className="features__icon-wrapper">
                  <Icon size={24} aria-hidden="true" />
                </div>
                <div className="features__content">
                  <h3 className="features__card-title">{feature.title}</h3>
                  <p className="features__card-description">{feature.description}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}