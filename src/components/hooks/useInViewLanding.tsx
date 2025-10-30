import { useEffect, useState, useRef, useCallback } from 'react';

interface UseInViewOptions {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useInView(options: UseInViewOptions = {}) {
  const { threshold = 0.15, rootMargin = '-80px', triggerOnce = true } = options;
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const hasTriggered = useRef(false);

  const handleIntersection = useCallback(
    ([entry]: IntersectionObserverEntry[]) => {
      if (entry.isIntersecting && !hasTriggered.current) {
        // Usar requestAnimationFrame para optimizar la animación
        requestAnimationFrame(() => {
          setIsInView(true);
        });
        
        if (triggerOnce) {
          hasTriggered.current = true;
        }
      }
    },
    [triggerOnce]
  );

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Si ya se activó y es triggerOnce, no hacer nada
    if (triggerOnce && hasTriggered.current) {
      return;
    }

    const observer = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce, handleIntersection]);

  return { ref, isInView };
}
