import { ChevronDown } from 'lucide-react';
import '../styles/Faq.css';

const FAQ_ITEMS = [
  {
    question: 'Does it read my pages or what I type?',
    answer: 'No. It counts browser actions and network connections. It does not store page content or what you type.'
  },
  {
    question: 'How accurate is it?',
    answer: 'This is a proof of concept trained on a few hundred sites. The labels come from public tracker lists, so verdicts are estimates, not guarantees.'
  },
  {
    question: 'Can the AI change a verdict?',
    answer: "No. It only rewrites the model's reasons in plain English."
  },
  {
    question: "What does 'I'm not sure' mean?",
    answer: 'The threat probability is close to a threshold, so the model prefers to say it is unsure rather than guessing.'
  },
  {
    question: 'Which browsers does it support?',
    answer: 'Chrome for now, built on Manifest V3.'
  },
  {
    question: 'Who built this?',
    answer: 'A student team project that combines data science, machine learning, and human-computer interaction (HCI).'
  }
];

export default function Faq() {
  return (
    <section id="faq" className="faq" aria-labelledby="faq-heading">
      <div className="container faq__container">
        <h2 id="faq-heading" className="faq__title">Questions, answered</h2>
        
        <div className="faq__list">
          {FAQ_ITEMS.map((item, index) => (
            <details key={index} className="faq__item" name="faq-accordion">
              <summary className="faq__summary">
                <span className="faq__question">{item.question}</span>
                <ChevronDown className="faq__icon" size={20} aria-hidden="true" />
              </summary>
              <div className="faq__answer">
                <p>{item.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}