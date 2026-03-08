import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from '@studio-freight/lenis';

export default function SmoothScroll({ children }) {
  const lenisRef = useRef(null);
  const { pathname } = useLocation();

  useEffect(() => {
    // Apple-style: crisp, snappy, native-feeling scroll — applies to ALL pages
    const lenis = new Lenis({
      wrapper: window,         // scroll container = window (works for all layouts incl. AppLayout)
      content: document.body, // content = body
      duration: 0.5,
      easing: (t) => 1 - Math.pow(1 - t, 5), // quintic ease-out — snaps to stop like macOS
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.8,
      touchMultiplier: 2.2,
      infinite: false,
    });

    lenisRef.current = lenis;

    // RAF loop
    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Expose globally so AppLayout scroll-progress bar & anchor links work
    window.__lenis = lenis;

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);

  // Scroll to top instantly on every route change
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }
  }, [pathname]);

  return <>{children}</>;
}
