import React from 'react';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { useTaskStore } from '@/stores/tasks';
import { Inbox, Calendar } from 'lucide-react';
import { AddTaskButton } from '@/components/features/tasks/AddTaskButton';
import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

export const BottomNav: React.FC = () => {
  const [location] = useLocation();
  const { isSelectionMode } = useTaskStore();

  // Hide bottom nav when viewing the settings page (the user requested a clean settings layout)
  if (location === '/settings') return null;

  const handleTabClick = async () => {
    if (Capacitor.isNativePlatform()) {
      try {
        await Haptics.impact({ style: ImpactStyle.Light });
      } catch {
        // Silently fail if haptics not available
      }
    }
  };

  const tabs = [
    { path: '/inbox', label: 'Inbox', icon: Inbox },
    { path: '/today', label: 'Today', icon: Calendar },
  ];
  const leftTab = tabs[0]
  const rightTab = tabs[1]

  const navVariants = {
    visible: { opacity: 1, y: 0, scale: 1 },
    hidden: { opacity: 0, y: 8, scale: 0.98 },
  };

  return (
    <motion.nav
      className="fixed left-1/2 bottom-6 transform -translate-x-1/2 z-50"
      variants={navVariants}
      initial="visible"
      animate={isSelectionMode ? 'hidden' : 'visible'}
      style={{ pointerEvents: isSelectionMode ? 'none' : 'auto' }}
      aria-hidden={isSelectionMode}
      role="navigation"
    >
      <div className="relative max-w-md w-[92%] mx-auto">
        <div className="bg-background border border-border rounded-3xl px-4 py-2 shadow-lg">
          <div className="flex flex-row justify-center w-full items-center gap-2 relative">
            {/* Left tab (Inbox) */}
            <div className="flex items-center justify-start">
              <Link href={tabs[0].path}>
                <motion.div
                  className={`flex flex-col items-center p-2 rounded-xl cursor-pointer transition-colors ${
                    location === tabs[0].path ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleTabClick}
                >
                  <leftTab.icon size={20} />
                  <span className="text-xs mt-1">{tabs[0].label}</span>
                </motion.div>
              </Link>
            </div>

            {/* Center add button */}
                <div className="flex items-center justify-center -mt-6 w-full">
                  <AddTaskButton fixed={false} className="relative z-10 ring-1 ring-offset-2 ring-accent/50 ring-offset-background size-14 -translate-y-2" />
            </div>

            {/* Right tab (Today) */}
            <div className="flex items-center justify-end">
              <Link href={tabs[1].path}>
                <motion.div
                  className={`flex flex-col items-center p-2 rounded-xl cursor-pointer transition-colors ${
                    location === tabs[1].path ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleTabClick}
                >
                  <rightTab.icon size={20} />
                  <span className="text-xs mt-1">{tabs[1].label}</span>
                </motion.div>
              </Link>
            </div>
          </div>
        </div>
      </div>
  </motion.nav>
  )
};
