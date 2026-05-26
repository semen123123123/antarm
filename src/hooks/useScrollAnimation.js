import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for scroll-triggered entrance animations using IntersectionObserver.
 *
 * @param {Object} options - Configuration options
 * @param {number} options.threshold - Visibility threshold (0-1) to trigger animation. Default: 0.1
 * @param {string} options.rootMargin - Root margin for intersection observer. Default: '0px 0px -50px 0px'
 * @param {boolean} options.triggerOnce - Whether to trigger animation only once. Default: true
 * @returns {[React.RefObject, boolean]} - [ref to attach to element, isVisible state]
 *
 * @example
 * const [ref, isVisible] = useScrollAnimation();
 * return <div ref={ref} className={`animate-on-scroll animate-fade-up ${isVisible ? 'is-visible' : ''}`} />
 */
export default function useScrollAnimation({
  threshold = 0.1,
  rootMargin = '0px 0px -50px 0px',
  triggerOnce = true,
} = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  return [ref, isVisible];
}

/**
 * Hook for staggered scroll animations on a list of elements.
 * Returns an array of [ref, isVisible] tuples, one per item.
 *
 * @param {number} count - Number of items to animate
 * @param {Object} options - Same options as useScrollAnimation, plus:
 * @param {number} options.staggerDelay - Delay between each item in ms. Default: 100
 * @returns {Array<[React.RefObject, boolean]>} - Array of [ref, isVisible] tuples
 */
export function useStaggeredAnimation(count, {
  threshold = 0.1,
  rootMargin = '0px 0px -50px 0px',
  triggerOnce = true,
  staggerDelay = 100,
} = {}) {
  const refs = useRef([]);
  const [visibleItems, setVisibleItems] = useState(new Set());
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          for (let i = 0; i < count; i++) {
            setTimeout(() => {
              setVisibleItems(prev => new Set([...prev, i]));
            }, i * staggerDelay);
          }
          if (triggerOnce) {
            observer.unobserve(container);
          }
        } else if (!triggerOnce) {
          setVisibleItems(new Set());
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [count, threshold, rootMargin, triggerOnce, staggerDelay]);

  const items = Array.from({ length: count }, (_, i) => {
    const ref = (el) => { refs.current[i] = el; };
    const isVisible = visibleItems.has(i);
    return [ref, isVisible];
  });

  return [containerRef, items];
}