import React, { useState } from 'react';

interface SwipeNavigationProps {
  onNext: () => void;
  onPrev: () => void;
  isNextDisabled: boolean;
  isPrevDisabled: boolean;
}

const MIN_SWIPE_DISTANCE = 50;

export const useSwipeNavigation = ({ onNext, onPrev, isNextDisabled, isPrevDisabled }: SwipeNavigationProps) => {
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const [touchEndY, setTouchEndY] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchEndY(null);
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchStartY(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
    setTouchEndY(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX || !touchStartY || !touchEndY) return;

    const distanceX = touchStartX - touchEndX;
    const distanceY = touchStartY - touchEndY;

    // Only trigger swipe if horizontal movement is greater than vertical to avoid conflicting with scrolling
    if (Math.abs(distanceX) < Math.abs(distanceY)) {
      setTouchStartX(null);
      setTouchStartY(null);
      setTouchEndX(null);
      setTouchEndY(null);
      return;
    }

    const isLeftSwipe = distanceX > MIN_SWIPE_DISTANCE;
    const isRightSwipe = distanceX < -MIN_SWIPE_DISTANCE;

    if (isLeftSwipe && !isNextDisabled) {
      onNext();
    } else if (isRightSwipe && !isPrevDisabled) {
      onPrev();
    }

    setTouchStartX(null);
    setTouchStartY(null);
    setTouchEndX(null);
    setTouchEndY(null);
  };

  return { handleTouchStart, handleTouchMove, handleTouchEnd };
};
