// hooks/useImageWithFallback.js
import { useState, useEffect, useRef } from 'react';

// Global cache outside the component (shared across all instances)
const imageCache = new Map();

const useImageWithFallback = (iconName) => {
    const [src, setSrc] = useState('');
    const isLoadingRef = useRef(false);

    useEffect(() => {
        if (!iconName) {
            const defaultUrl = new URL(`../../../assets/default-icon.png`, import.meta.url).href;
            setSrc(defaultUrl);
            return;
        }

        // Check cache first - if exists, use it immediately
        if (imageCache.has(iconName)) {
            setSrc(imageCache.get(iconName));
            return;
        }

        // Prevent duplicate loading
        if (isLoadingRef.current) return;

        isLoadingRef.current = true;

        const imageUrl = new URL(`../../../assets/icon_images/${iconName}`, import.meta.url).href;
        const defaultUrl = new URL(`../../../assets/default-icon.png`, import.meta.url).href;

        const img = new Image();
        img.src = imageUrl;
        
        img.onload = () => {
            imageCache.set(iconName, imageUrl);
            setSrc(imageUrl);
            isLoadingRef.current = false;
        };
        
        img.onerror = () => {
            imageCache.set(iconName, defaultUrl);
            setSrc(defaultUrl);
            isLoadingRef.current = false;
        };
    }, [iconName]);

    return src;
};

export default useImageWithFallback;