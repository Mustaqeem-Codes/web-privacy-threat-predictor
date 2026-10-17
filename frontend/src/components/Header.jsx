import { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import { BRAND_NAME, NAV_ITEMS } from '../constants/site';
import { scrollToSection } from '../utils/scrollToSection';
import '../styles/Header.css';

// SVG Chrome icon matching lucide styling for the CTA
const ChromeIcon = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="4" />
    <line x1="21.17" y1="8" x2="12" y2="8" />
    <line x1="3.95" y1="6.06" x2="8.54" y2="14" />
    <line x1="10.88" y1="21.94" x2="15.46" y2="14" />
  </svg>
);

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuToggleRef = useRef(null);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    if (isMenuOpen) setIsMenuOpen(false);
    scrollToSection(href);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
        menuToggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMenuOpen]);

  return (
    <header className="header">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <div className="container header__container">
        
        <a href="#top" className="header__logo" onClick={(e) => handleNavClick(e, '#top')}>
  <img 
    src="/logo.svg" 
    alt="" 
    width="28" 
    height="28" 
    className="header__logo-mark" 
    aria-hidden="true" 
  />
  <span className="header__brand">{BRAND_NAME}</span>
</a>

        {/* Desktop Navigation */}
        <nav aria-label="Main" className="header__nav">
          <ul className="header__nav-list">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="header__nav-link" onClick={(e) => handleNavClick(e, item.href)}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header__actions">
          {/* A11y & Theme slots (Rendered once, CSS handles placement) */}
          <div className="header__slots">
            <div id="a11y-toolbar-slot" aria-label="Accessibility settings placeholder"></div>
            <div id="theme-toggle-slot" aria-label="Theme toggle placeholder"></div>
          </div>
          
          <button type="button" className="btn btn--primary header__cta-desktop" onClick={() => {}}>
            <ChromeIcon size={20} />
            Add to Chrome
          </button>
          
          <button 
            type="button" 
            className="header__menu-toggle" 
            aria-expanded={isMenuOpen} 
            aria-controls="mobile-menu"
            aria-label="Toggle navigation menu"
            onClick={toggleMenu}
            ref={menuToggleRef}
          >
            {isMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div id="mobile-menu" className={`header__mobile-menu ${isMenuOpen ? 'is-open' : ''}`}>
        <nav aria-label="Mobile Main" className="header__mobile-nav">
          <ul className="header__mobile-nav-list">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="header__mobile-nav-link" onClick={(e) => handleNavClick(e, item.href)}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="header__mobile-footer">
          <button type="button" className="btn btn--primary btn--lg header__cta-mobile" onClick={() => {}}>
            <ChromeIcon size={20} />
            Add to Chrome
          </button>
        </div>
      </div>
    </header>
  );
}