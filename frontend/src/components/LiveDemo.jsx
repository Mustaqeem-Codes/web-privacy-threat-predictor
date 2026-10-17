import React, { useState, useRef, useEffect } from 'react';
import { 
  CheckCircle, 
  AlertTriangle, 
  ShieldAlert, 
  Search, 
  Loader2, 
  ArrowUp, 
  ArrowDown, 
  Info 
} from 'lucide-react';
import '../styles/LiveDemo.css';

const SAMPLES = {
  'example-news.test': {
    verdict: 'safe', probability: 0.06, uncertain: false,
    reasons: [
      { feature: 'net_unique_third', value: 1, impact: -0.18 },
      { feature: 'tp_canvas_reads', value: 0, impact: -0.09 },
      { feature: 'beacon_calls', value: 0, impact: -0.06 },
      { feature: 'net_third_ratio', value: 0.08, impact: -0.05 },
      { feature: 'cookie_writes', value: 2, impact: 0.02 }
    ],
    explanation: 'This page talks to almost no outside companies and does not read your browser for fingerprinting. That is typical of a low-tracking site.'
  },
  'shop-demo.test': {
    verdict: 'suspicious', probability: 0.52, uncertain: true,
    reasons: [
      { feature: 'net_unique_third', value: 9, impact: 0.12 },
      { feature: 'beacon_calls', value: 3, impact: 0.08 },
      { feature: 'cookie_writes', value: 7, impact: 0.05 },
      { feature: 'tp_canvas_reads', value: 0, impact: -0.07 },
      { feature: 'geo_calls', value: 0, impact: -0.03 }
    ],
    explanation: 'This page contacts several outside companies and sends tracking pings, but it does not read your canvas. The signals point both ways, so the model is not sure.'
  },
  'ads-heavy.test': {
    verdict: 'threat', probability: 0.93, uncertain: false,
    reasons: [
      { feature: 'net_unique_third', value: 23, impact: 0.34 },
      { feature: 'tp_canvas_reads', value: 2, impact: 0.21 },
      { feature: 'beacon_calls', value: 4, impact: 0.12 },
      { feature: 'cookie_reads', value: 0, impact: -0.05 },
      { feature: 'geo_calls', value: 0, impact: -0.02 }
    ],
    explanation: 'This page connects to many outside trackers and reads your browser canvas, a common way to recognize a device. Together these strongly suggest data harvesting.'
  }
};

const FEATURE_LABELS = {
  'net_unique_third': 'Different outside companies contacted',
  'tp_canvas_reads': 'Outside scripts reading your canvas',
  'beacon_calls': 'Tracking pings sent',
  'net_third_ratio': 'Share of traffic going to outside companies',
  'cookie_writes': 'Cookies saved',
  'cookie_reads': 'Cookies read',
  'geo_calls': 'Location requests'
};

const VERDICT_CONFIG = {
  safe: { icon: CheckCircle, label: 'Safe' },
  suspicious: { icon: AlertTriangle, label: 'Suspicious' },
  threat: { icon: ShieldAlert, label: 'Threat' }
};

export default function LiveDemo() {
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | result | not-found
  const [result, setResult] = useState(null);
  const [inputError, setInputError] = useState(false);
  const resultHeadingRef = useRef(null);
  const errorRef = useRef(null);

  const normalizeDomain = (str) => {
    return str.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
  };

  const runScan = (domainToScan) => {
    const normalized = normalizeDomain(domainToScan);
    
    if (!normalized) {
      setInputError(true);
      setStatus('idle');
      return;
    }
    
    setInputError(false);
    setStatus('loading');
    setResult(null);

    // Fake network delay for visibility of system status
    setTimeout(() => {
      if (SAMPLES[normalized]) {
        setResult({ domain: normalized, ...SAMPLES[normalized] });
        setStatus('result');
      } else {
        setStatus('not-found');
      }
    }, 900);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    runScan(inputValue);
  };

  const handleChipClick = (domain) => {
    setInputValue(domain);
    runScan(domain);
  };

  // Manage focus after state transitions
  useEffect(() => {
    if (status === 'result' && resultHeadingRef.current) {
      resultHeadingRef.current.focus({ preventScroll: true });
    } else if (status === 'not-found' && errorRef.current) {
      errorRef.current.focus({ preventScroll: true });
    }
  }, [status]);

  return (
    <section id="demo" className="live-demo" aria-labelledby="demo-heading">
      <div className="container live-demo__container">
        
        <header className="live-demo__header">
          <h2 id="demo-heading" className="live-demo__title">Try it on a sample site</h2>
          <p id="demo-helper" className="live-demo__helper">
            Pick a sample or type its name. This demo uses built-in sample data. The extension scans real pages.
          </p>
        </header>

        <div className="live-demo__interaction">
          <form className="live-demo__form" onSubmit={handleSubmit}>
            <div className="live-demo__input-group">
              <label htmlFor="demo-input" className="live-demo__label">Website domain</label>
              <div className="live-demo__input-wrapper">
                <Search className="live-demo__input-icon" size={20} aria-hidden="true" />
                <input
                  id="demo-input"
                  type="text"
                  inputMode="url"
                  autoComplete="off"
                  className="live-demo__input"
                  placeholder="example-news.test"
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    if (inputError) setInputError(false);
                  }}
                  aria-invalid={inputError}
                  aria-describedby={`demo-helper ${inputError ? 'demo-error' : ''}`}
                />
                <button 
                  type="submit" 
                  className="btn btn--primary live-demo__submit"
                  disabled={status === 'loading'}
                  aria-disabled={status === 'loading'}
                >
                  Scan site
                </button>
              </div>
              {inputError && (
                <p id="demo-error" className="live-demo__error-msg" role="alert">
                  Enter a domain, for example example-news.test.
                </p>
              )}
            </div>
          </form>

          <div className="live-demo__chips" aria-label="Sample domains">
            {Object.keys(SAMPLES).map((domain) => (
              <button
                key={domain}
                type="button"
                className="live-demo__chip"
                onClick={() => handleChipClick(domain)}
                disabled={status === 'loading'}
              >
                {domain}
              </button>
            ))}
          </div>
        </div>

        <div className="live-demo__output" aria-live="polite" aria-atomic="true">
          {status === 'loading' && (
            <div className="live-demo__loading">
              <Loader2 className="live-demo__spinner" size={32} aria-hidden="true" />
              <p>Checking sample site...</p>
            </div>
          )}

          {status === 'not-found' && (
            <div 
              className="live-demo__not-found" 
              tabIndex="-1" 
              ref={errorRef}
            >
              <Info size={24} aria-hidden="true" className="live-demo__not-found-icon" />
              <div className="live-demo__not-found-text">
                <p><strong>This demo only has three sample sites.</strong></p>
                <p>Install the extension to scan real pages. Try one of these samples:</p>
                <div className="live-demo__chips live-demo__chips--inline">
                  {Object.keys(SAMPLES).map((domain) => (
                    <button
                      key={`retry-${domain}`}
                      type="button"
                      className="live-demo__chip"
                      onClick={() => handleChipClick(domain)}
                    >
                      {domain}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {status === 'result' && result && (
            <article className="live-demo__result-card">
              <div className="live-demo__banner">
                <Info size={16} aria-hidden="true" /> Sample data, not a real scan
              </div>
              
              <div className="live-demo__result-body">
                <h3 
                  className="live-demo__domain" 
                  tabIndex="-1" 
                  ref={resultHeadingRef}
                >
                  {result.domain}
                </h3>

                <div className="live-demo__verdict-row">
                  <div className={`live-demo__badge live-demo__badge--${result.verdict}`}>
                    {React.createElement(VERDICT_CONFIG[result.verdict].icon, { size: 24, 'aria-hidden': 'true' })}
                    <span>{VERDICT_CONFIG[result.verdict].label}</span>
                  </div>
                  
                  <div className="live-demo__meter-group">
                    <label htmlFor="threat-meter" className="live-demo__meter-label">
                      Threat likelihood
                    </label>
                    <div className="live-demo__meter-wrapper">
                      <meter 
                        id="threat-meter" 
                        className="live-demo__meter"
                        value={result.probability} 
                        min="0" 
                        max="1"
                        aria-valuenow={Math.round(result.probability * 100)}
                      >
                        {Math.round(result.probability * 100)}%
                      </meter>
                      <span className="live-demo__meter-text">{Math.round(result.probability * 100)}%</span>
                    </div>
                  </div>
                </div>

                {result.uncertain && (
                  <div className="live-demo__uncertain">
                    <AlertTriangle size={20} aria-hidden="true" />
                    <div className="live-demo__uncertain-text">
                      <strong>I'm not sure</strong>
                      <p>The signals point both ways. This verdict is a best guess.</p>
                    </div>
                  </div>
                )}

                <div className="live-demo__reasons-section">
                  <h4 className="live-demo__reasons-title">Top reasons</h4>
                  <ul className="live-demo__reasons-list">
                    {result.reasons.map((r, i) => {
                      const isPositive = r.impact > 0;
                      // Calculate a visible bar width based on max expected impact ~0.40
                      const barWidth = Math.min(Math.abs(r.impact) * 250, 100); 
                      
                      return (
                        <li key={i} className="live-demo__reason">
                          <div className="live-demo__reason-header">
                            <div>
                              <div className="live-demo__reason-name">
                                {FEATURE_LABELS[r.feature] || r.feature}
                              </div>
                              <div className="live-demo__reason-raw">
                                {r.feature} (val: {r.value})
                              </div>
                            </div>
                            <div className={`live-demo__impact live-demo__impact--${isPositive ? 'high' : 'low'}`}>
                              {isPositive ? <ArrowUp size={16} aria-hidden="true" /> : <ArrowDown size={16} aria-hidden="true" />}
                              <span>{isPositive ? 'raises risk' : 'lowers risk'}</span>
                            </div>
                          </div>
                          <div className="live-demo__bar-track" aria-hidden="true">
                            <div 
                              className={`live-demo__bar-fill live-demo__bar-fill--${isPositive ? 'high' : 'low'}`} 
                              style={{ '--bar-width': `${barWidth}%` }}
                            ></div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="live-demo__explanation">
                  <p>{result.explanation}</p>
                  <p className="live-demo__explanation-note">
                    The AI assistant only rewrites the model's reasons. It never changes the verdict.
                  </p>
                </div>

                <div className="live-demo__feedback">
                  <span className="live-demo__feedback-prompt">Was this right?</span>
                  <button type="button" className="btn btn--secondary" onClick={() => {}}>Yes</button>
                  <button type="button" className="btn btn--secondary" onClick={() => {}}>No</button>
                </div>

              </div>
            </article>
          )}
        </div>
        
      </div>
    </section>
  );
}