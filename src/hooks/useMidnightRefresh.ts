import { useEffect, useState } from 'react';
import { setupMidnightRunner, onMidnightTick } from '../services/MidnightService';

export function useMidnightRefresh() {
  const [isNewDay, setIsNewDay] = useState(false);

  useEffect(() => {
    const checkNewDay = () => {
      const now = new Date();
      const lastVisit = localStorage.getItem('lastVisit');
      const lastDate = lastVisit ? new Date(lastVisit).toDateString() : null;

      if (!lastDate || now.toDateString() !== lastDate) {
        localStorage.setItem('lastVisit', now.toISOString());
        setIsNewDay(true);
      } else {
        setIsNewDay(false);
      }
    };

    // Initial check on mount
    checkNewDay();

    // Setup midnight runner (idempotent, can be called multiple times safely)
    setupMidnightRunner();

    // Register callback for midnight ticks
    const midnightCallback = () => {
      checkNewDay();
    };
    onMidnightTick(midnightCallback);

    // Note: Cleanup for callbacks not implemented in MidnightService yet,
    // but since this hook is likely used in a single component (TodayPage),
    // and the interval is global, it's acceptable for now.
  }, []);

  return { isNewDay };
}