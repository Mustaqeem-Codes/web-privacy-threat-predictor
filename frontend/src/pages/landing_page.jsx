import Header from '../components/Header';
import Hero from '../components/Hero';
import SignalsStrip from '../components/SignalsStrip';
import LiveDemo from '../components/LiveDemo';
import HowItWorks from '../components/HowItWorks';
import VerdictLevels from '../components/VerdictLevels';
import Features from '../components/Features';
import PrivacyHonesty from '../components/PrivacyHonesty';
import Faq from '../components/Faq';
import FinalCta from '../components/FinalCta';
import Footer from '../components/Footer';

export default function LandingPage() {
  return (
    <>
      <Header />
      <main id="main-content" tabIndex="-1" style={{ outline: 'none' }}>
        <Hero />
        <SignalsStrip />
        <LiveDemo />
        <HowItWorks />
        <VerdictLevels />
        <Features />
        <PrivacyHonesty />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}