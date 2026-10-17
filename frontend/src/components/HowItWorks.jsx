import { Eye, Brain, MessageSquare } from 'lucide-react';
import '../styles/HowItWorks.css';

const STEPS = [
  {
    title: 'Observe',
    description: 'The extension counts sensitive browser actions on the page, such as canvas reads, location requests, and connections to outside companies.',
    icon: Eye,
  },
  {
    title: 'Predict',
    description: 'A machine-learning model turns 60 measurements into a verdict and a threat likelihood.',
    icon: Brain,
  },
  {
    title: 'Explain',
    description: "You see the top reasons behind the verdict in plain English. The AI assistant only rewrites the model's reasons. It never changes the verdict.",
    icon: MessageSquare,
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="how-it-works" aria-labelledby="how-it-works-heading">
      <div className="container how-it-works__container">
        <h2 id="how-it-works-heading" className="how-it-works__title">
          How it works
        </h2>
        
        {/* role="list" added because some browsers strip semantic list behavior when list-style: none is used */}
        <ol className="how-it-works__list" role="list">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <li key={index} className="how-it-works__item">
                <div className="how-it-works__card">
                  <div className="how-it-works__header">
                    <div className="how-it-works__icon-wrapper">
                      <Icon size={24} aria-hidden="true" />
                    </div>
                    <div className="how-it-works__number" aria-hidden="true">
                      {index + 1}
                    </div>
                  </div>
                  
                  <div className="how-it-works__content">
                    <h3 className="how-it-works__step-title">
                      <span className="visually-hidden">Step {index + 1}: </span>
                      {step.title}
                    </h3>
                    <p className="how-it-works__description">
                      {step.description}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}