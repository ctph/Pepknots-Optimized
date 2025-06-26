// src/hooks/useIsMobile.js
import { useEffect, useState } from 'react';

const MOBILE_BREAKPOINT = 768;          

export default function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    window.matchMedia(`(max-width:${MOBILE_BREAKPOINT}px)`).matches
  );

  useEffect(() => {
    const mq = window.matchMedia(`(max-width:${MOBILE_BREAKPOINT}px)`);
    const handler = e => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return isMobile;
}
