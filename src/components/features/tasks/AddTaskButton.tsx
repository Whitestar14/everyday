"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { useLocation } from "wouter";

export function AddTaskButton() {
  const [, navigate] = useLocation();
  const { getButtonPositionStyles } = useSettings();

  const handleClick = () => {
    navigate("/inbox");
    return;
  };
  return (
    <motion.button
      onClick={handleClick}
      className={`fixed bottom-20 size-14 cursor-pointer bg-primary text-primary-foreground rounded-full shadow-lg active:scale-95 transition-transform flex items-center justify-center z-50 ${getButtonPositionStyles()}`}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.5, type: "spring", stiffness: 300, damping: 20 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Plus className="size-6" />
    </motion.button>
  );
}
