import React from 'react';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Inbox, Calendar, Folder } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

export const BottomNav: React.FC = () => {
  const [location] = useLocation();

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
    { path: '/library', label: 'Library', icon: Folder },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="flex justify-around items-center py-2 px-4">
        {tabs.map(({ path, label, icon: Icon }) => {
          const isActive = location === path;
          return (
            <Link key={path} href={path}>
              <motion.div
                className={`flex flex-col items-center p-2 rounded-lg cursor-pointer transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                whileTap={{ scale: 0.95 }}
                onClick={handleTabClick}
              >
                <Icon size={20} />
                <span className="text-xs mt-1">{label}</span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};