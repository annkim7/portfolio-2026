"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";

export type SlideDirection = 1 | -1;

type UseSlideNavigationOptions = {
  count: number;
  duration: number;
  loop?: boolean;
  ids?: string[];
  onEdge?: (direction: SlideDirection) => void;
  rootRef?: RefObject<HTMLElement | null>;
};

type UseSlideNavigationResult = {
  index: number;
  direction: SlideDirection;
  goTo: (index: number) => void;
  next: () => void;
  prev: () => void;
  isAnimating: boolean;
};

const WHEEL_THRESHOLD = 40;
const WHEEL_QUIET_MS = 150;
const SWIPE_DISTANCE = 50;
const SWIPE_VELOCITY = 0.4;

function hashIndex(ids: string[] | undefined) {
  if (typeof window === "undefined" || !ids?.length) return 0;
  const hash = decodeURIComponent(window.location.hash.replace(/^#/, ""));
  const found = ids.indexOf(hash);
  return found >= 0 ? found : 0;
}

export function useSlideNavigation({
  count,
  duration,
  loop = false,
  ids,
  onEdge,
  rootRef,
}: UseSlideNavigationOptions): UseSlideNavigationResult {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<SlideDirection>(1);
  const [isAnimating, setIsAnimating] = useState(false);

  const indexRef = useRef(0);
  const animatingRef = useRef(false);
  const idsRef = useRef(ids);
  const onEdgeRef = useRef(onEdge);
  const accumulatorRef = useRef(0);
  const lastWheelRef = useRef(0);
  const awaitingQuietRef = useRef(false);
  const touchRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const rootRefLive = useRef(rootRef);

  useEffect(() => {
    idsRef.current = ids;
  }, [ids]);

  useEffect(() => {
    rootRefLive.current = rootRef;
  }, [rootRef]);

  useEffect(() => {
    onEdgeRef.current = onEdge;
  }, [onEdge]);

  const commit = useCallback(
    (nextIndex: number, nextDirection: SlideDirection) => {
      if (animatingRef.current || nextIndex === indexRef.current) return;

      indexRef.current = nextIndex;
      animatingRef.current = true;
      setIndex(nextIndex);
      setDirection(nextDirection);
      setIsAnimating(true);

      const slideId = idsRef.current?.[nextIndex];
      if (slideId) {
        const hash = `#${slideId}`;
        if (window.location.hash !== hash) {
          window.history.replaceState(null, "", hash);
        }
      }

      window.setTimeout(() => {
        animatingRef.current = false;
        setIsAnimating(false);
      }, duration);
    },
    [duration],
  );

  const go = useCallback(
    (nextDirection: SlideDirection) => {
      if (animatingRef.current) return;

      const target = indexRef.current + nextDirection;
      if (target < 0 || target >= count) {
        if (loop) {
          commit((target + count) % count, nextDirection);
          return;
        }
        onEdgeRef.current?.(nextDirection);
        return;
      }

      commit(target, nextDirection);
    },
    [commit, count, loop],
  );

  const goTo = useCallback(
    (target: number) => {
      if (target < 0 || target >= count || target === indexRef.current) return;
      commit(target, target > indexRef.current ? 1 : -1);
    },
    [commit, count],
  );

  const next = useCallback(() => go(1), [go]);
  const prev = useCallback(() => go(-1), [go]);

  useLayoutEffect(() => {
    const start = hashIndex(idsRef.current);
    if (start === 0) return;
    indexRef.current = start;
    setIndex(start);
  }, []);

  useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const now = performance.now();
      const delta =
        Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;

      if (animatingRef.current || awaitingQuietRef.current) {
        const quietEnough =
          !animatingRef.current && now - lastWheelRef.current >= WHEEL_QUIET_MS;
        if (!quietEnough) {
          lastWheelRef.current = now;
          return;
        }
        awaitingQuietRef.current = false;
        accumulatorRef.current = 0;
      } else if (now - lastWheelRef.current > WHEEL_QUIET_MS) {
        accumulatorRef.current = 0;
      }

      lastWheelRef.current = now;
      accumulatorRef.current += delta;

      if (Math.abs(accumulatorRef.current) < WHEEL_THRESHOLD) return;

      const nextDirection: SlideDirection = accumulatorRef.current > 0 ? 1 : -1;
      accumulatorRef.current = 0;
      awaitingQuietRef.current = true;
      go(nextDirection);
    };

    const onTouchStart = (event: TouchEvent) => {
      const touch = event.changedTouches[0];
      if (!touch) return;
      touchRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: performance.now(),
      };
    };

    const onTouchMove = (event: TouchEvent) => {
      if (event.cancelable) event.preventDefault();
    };

    const onTouchEnd = (event: TouchEvent) => {
      const start = touchRef.current;
      const touch = event.changedTouches[0];
      touchRef.current = null;
      if (!start || !touch) return;

      const dx = touch.clientX - start.x;
      const dy = touch.clientY - start.y;
      const elapsed = Math.max(performance.now() - start.time, 1);
      const horizontal = Math.abs(dx) > Math.abs(dy);
      const distance = horizontal ? dx : dy;
      const velocity = distance / elapsed;

      if (
        Math.abs(distance) < SWIPE_DISTANCE &&
        Math.abs(velocity) < SWIPE_VELOCITY
      ) {
        return;
      }

      go(distance < 0 ? 1 : -1);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }

      const root = rootRefLive.current?.current;
      const active = document.activeElement;
      if (
        root &&
        active instanceof Node &&
        active !== document.body &&
        active !== document.documentElement &&
        !root.contains(active)
      ) {
        return;
      }

      if (
        event.key === "ArrowDown" ||
        event.key === "ArrowRight" ||
        event.key === "PageDown" ||
        event.key === " "
      ) {
        event.preventDefault();
        next();
        return;
      }

      if (
        event.key === "ArrowUp" ||
        event.key === "ArrowLeft" ||
        event.key === "PageUp"
      ) {
        event.preventDefault();
        prev();
        return;
      }

      if (event.key === "Home") {
        event.preventDefault();
        goTo(0);
        return;
      }

      if (event.key === "End") {
        event.preventDefault();
        goTo(count - 1);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [count, go, goTo, next, prev]);

  return { index, direction, goTo, next, prev, isAnimating };
}
