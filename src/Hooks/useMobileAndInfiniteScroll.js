import { useEffect } from 'react';

/**
 * Custom hook to handle infinite scroll for mobile devices.
 * @param {boolean} isMobile - Whether the device is mobile.
 * @param {number} mobileLoadedCount - Number of products currently loaded for infinite scroll.
 * @param {function} setMobileLoadedCount - Setter for loaded count.
 * @param {Array} filteredProducts - All filtered products.
 * @param {number} pageSize - Number of products to load per scroll.
 */
export function useInfiniteScroll({ isMobile, mobileLoadedCount, setMobileLoadedCount, filteredProducts, pageSize }) {
    useEffect(() => {
        if (!isMobile) return;
        const handleScroll = () => {
        if (
            window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
            mobileLoadedCount < filteredProducts.length
        ) {
            setMobileLoadedCount((prev) => Math.min(prev + pageSize, filteredProducts.length));
        }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isMobile, mobileLoadedCount, filteredProducts.length, pageSize, setMobileLoadedCount]);
}

/**
 * Custom hook to detect if the device is mobile (width < 768px).
 * Returns a boolean state and updates on resize.
 */
import { useState } from 'react';
export function useIsMobile() {
    const [isMobile, setIsMobile] = useState(() => {
        if (typeof window !== 'undefined') {
        return window.innerWidth < 768;
        }
        return false;
    });

    useEffect(() => {
        const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return isMobile;
}
