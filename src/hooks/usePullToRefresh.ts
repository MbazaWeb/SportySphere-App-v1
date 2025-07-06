import { useState, useEffect, useCallback, RefObject } from 'react';

export const usePullToRefresh = (
  elementRef: RefObject<HTMLElement>,
  onRefresh: () => Promise<void>,
  threshold = 60
) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [startY, setStartY] = useState(0);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (elementRef.current?.scrollTop === 0) {
      setStartY(e.touches[0].clientY);
      setIsPulling(true);
    }
  }, [elementRef]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isPulling || !elementRef.current) return;

    const currentY = e.touches[0].clientY;
    const distance = Math.max(0, currentY - startY);
    
    if (distance > 0) {
      e.preventDefault();
      setPullDistance(distance * 0.5);
    }
  }, [isPulling, startY]);

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling) return;

    setIsPulling(false);

    if (pullDistance > threshold && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }

    setPullDistance(0);
  }, [isPulling, pullDistance, threshold, onRefresh, isRefreshing]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return { pullDistance, isPulling, isRefreshing };
};