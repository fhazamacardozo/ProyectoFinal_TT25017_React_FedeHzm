import { useEffect, useState } from "react";

/**
 * Custom hook to show a scroll-to-top button in mobile when scrolled down.
 * @param {boolean} isMobile - Whether the device is mobile.
 * @param {number} [threshold=300] - Scroll Y threshold to show the button.
 * @returns {boolean} showScrollToTopButton
 */
export function useShowScrollToTopButton(isMobile, threshold = 300) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!isMobile) return;
    const handleScroll = () => {
      setShow(window.scrollY > threshold);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile, threshold]);
  return show;
}
