import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { BRAND_NAME } from '../constants/site';
import { scrollToSection } from '../utils/scrollToSection';
import '../styles/hero.css';

const ChromeIcon = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="4" />
    <line x1="21.17" y1="8" x2="12" y2="8" />
    <line x1="3.95" y1="6.06" x2="8.54" y2="14" />
    <line x1="10.88" y1="21.94" x2="15.46" y2="14" />
  </svg>
);

export default function Hero() {
  const handleDemoClick = (e) => {
    e.preventDefault();
    scrollToSection('#demo');
  };

  return (
    <section id="top" className="hero" aria-labelledby="hero-heading">
      <div className="hero__glow" aria-hidden="true"></div>
      
      <div className="container hero__container">
        <div className="hero__content">
          <p className="hero__eyebrow">Chrome extension for browser privacy</p>
          <h1 id="hero-heading" className="hero__title">
            Know what a website is doing with your data, as it happens.
          </h1>
          <p className="hero__subtitle">
            {BRAND_NAME} watches fingerprinting, tracking, and data-sending behavior in your browser, then tells you in plain English whether a site looks safe, suspicious, or a threat.
          </p>
          
          <div className="hero__actions">
            <button type="button" className="btn btn--primary btn--lg hero__btn-primary">
              <ChromeIcon size={24} />
              Add to Chrome
            </button>
            <a 
              href="#demo" 
              className="btn btn--secondary btn--lg hero__btn-secondary"
              onClick={handleDemoClick}
            >
              Try the live demo
            </a>
          </div>
          
          <p className="hero__microcopy">
            Made for Chrome. Looks at what a page does, not what you type.
          </p>
        </div>

        <div className="hero__visual-wrapper">
          <div className="hero__mockup" aria-hidden="true">
            <div className="hero__mockup-header">
              <span className="hero__mockup-brand">
                <img 
                  src="/logo.svg" 
                  alt="" 
                  width="16" 
                  height="16" 
                  aria-hidden="true" 
                />
                {BRAND_NAME}
              </span>
            </div>
            
            <div className="hero__mockup-body">
              <div className="hero__mockup-domain">ads-heavy.test</div>
              
              <div className="hero__mockup-verdict hero__mockup-verdict--threat">
                <ShieldAlert size={20} />
                <span>Threat likelihood 93%</span>
              </div>
              
              <div className="hero__mockup-reasons">
                <div className="hero__mockup-reason">
                  <div className="hero__mockup-reason-header">
                    <span>Different outside companies contacted</span>
                    <span className="hero__mockup-reason-val">23</span>
                  </div>
                  <div className="hero__mockup-bar-track">
                    <div className="hero__mockup-bar-fill" style={{ '--bar-w': '85%' }}></div>
                  </div>
                </div>
                
                <div className="hero__mockup-reason">
                  <div className="hero__mockup-reason-header">
                    <span>Outside scripts reading your canvas</span>
                    <span className="hero__mockup-reason-val">2</span>
                  </div>
                  <div className="hero__mockup-bar-track">
                    <div className="hero__mockup-bar-fill" style={{ '--bar-w': '60%' }}></div>
                  </div>
                </div>
                
                <div className="hero__mockup-reason">
                  <div className="hero__mockup-reason-header">
                    <span>Tracking pings sent</span>
                    <span className="hero__mockup-reason-val">4</span>
                  </div>
                  <div className="hero__mockup-bar-track">
                    <div className="hero__mockup-bar-fill" style={{ '--bar-w': '45%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="hero__mockup-caption">Illustration with sample data.</p>
        </div>
      </div>
    </section>
  );
}