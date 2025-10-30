import { useEffect, useState, useRef } from 'react';

interface UseInViewOptions {
  threshold?: number;
}

export function useInView(options: UseInViewOptions = {}) {
  const { threshold = 0.1 } = options;
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isInView };
}

