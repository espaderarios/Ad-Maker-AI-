function debounce(fn, wait = 120) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

function updateResponsiveVars() {
  const w = window.innerWidth;
  // Compute a base font-size that scales between 13px and 20px
  const base = Math.round(Math.max(13, Math.min(20, 12 + w / 100)));
  document.documentElement.style.fontSize = base + 'px';
  document.documentElement.style.setProperty('--font-base', base + 'px');

  // Spacing scale derived from base
  const s1 = Math.round(base * 0.5);
  const s2 = Math.round(base * 0.75);
  const s3 = Math.round(base * 1.0);
  const s4 = Math.round(base * 1.5);

  document.documentElement.style.setProperty('--space-1', s1 + 'px');
  document.documentElement.style.setProperty('--space-2', s2 + 'px');
  document.documentElement.style.setProperty('--space-3', s3 + 'px');
  document.documentElement.style.setProperty('--space-4', s4 + 'px');

  // Container width
  if (w < 640) {
    document.documentElement.setAttribute('data-breakpoint', 'mobile');
    document.documentElement.style.setProperty('--container-padding', '16px');
    document.documentElement.style.setProperty('--container-max-width', '100%');
  } else if (w < 1024) {
    document.documentElement.setAttribute('data-breakpoint', 'tablet');
    document.documentElement.style.setProperty('--container-padding', '24px');
    document.documentElement.style.setProperty('--container-max-width', '900px');
  } else {
    document.documentElement.setAttribute('data-breakpoint', 'desktop');
    document.documentElement.style.setProperty('--container-padding', '32px');
    document.documentElement.style.setProperty('--container-max-width', '1200px');
  }
}

// Initialize and attach resize listener
function initResponsive() {
  if (typeof window === 'undefined') return;
  updateResponsiveVars();
  window.addEventListener('resize', debounce(updateResponsiveVars, 120));
}

// Auto-run when imported
initResponsive();

export default initResponsive;
