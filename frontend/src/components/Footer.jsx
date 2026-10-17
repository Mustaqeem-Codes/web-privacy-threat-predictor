import { BRAND_NAME, NAV_ITEMS } from '../constants/site'
import { scrollToSection } from '../utils/scrollToSection'
import '../styles/Footer.css'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const handleNavClick = (e, href) => {
    e.preventDefault()
    scrollToSection(href)
  }

  return (
    <footer className="footer">
      <div className="container footer__container">
        <div className="footer__top">
          <div className="footer__brand-col">
            <a
              href="#top"
              className="footer__logo"
              onClick={(e) => handleNavClick(e, '#top')}
            >
              <a
                href="#top"
                className="footer__logo"
                onClick={(e) => handleNavClick(e, '#top')}
              >
                <img
                  src="/logo.svg"
                  alt=""
                  width="24"
                  height="24"
                  className="footer__logo-mark"
                  aria-hidden="true"
                />
                <span className="footer__brand-name">{BRAND_NAME}</span>
              </a>
              <span className="footer__brand-name">{BRAND_NAME}</span>
            </a>
            <p className="footer__tagline">
              A student project: privacy threat prediction in the browser.
            </p>
          </div>

          <nav aria-label="Footer" className="footer__nav">
            <ul className="footer__nav-list">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="footer__nav-link"
                    onClick={(e) => handleNavClick(e, item.href)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="footer__bottom">
          <div className="footer__disclaimer">
            <p>Proof of concept. Verdicts are estimates.</p>
            <p>
              &copy; {currentYear} {BRAND_NAME}.
            </p>
          </div>
          <a
            href="#top"
            className="footer__back-to-top"
            onClick={(e) => handleNavClick(e, '#top')}
          >
            Back to top
          </a>
        </div>
      </div>
    </footer>
  )
}
