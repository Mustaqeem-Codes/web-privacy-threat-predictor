/**
 * Smoothly scrolls to a section and manages accessibility focus.
 * @param {string} id - The ID of the target element.
 */
export const scrollToSection = (id) => {
  const targetId = id.replace('#', '');
  const element = document.getElementById(targetId);

  if (!element) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  element.scrollIntoView({
    behavior: prefersReducedMotion ? 'auto' : 'smooth',
    block: 'start',
  });

  // Ensure target can receive focus
  if (!element.hasAttribute('tabindex')) {
    element.setAttribute('tabindex', '-1');
  }

  // Update focus for screen readers without jumping the page layout
  element.focus({ preventScroll: true });

  // Update URL hash history
  if (window.history && window.history.replaceState) {
    window.history.replaceState(null, '', `#${targetId}`);
  }
};