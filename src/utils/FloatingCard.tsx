import React from 'react';
import { motion } from 'framer-motion';

interface FloatingCardProps {
  children: React.ReactNode;
  className?: string;
}

const FloatingCard: React.FC<FloatingCardProps> = ({ children, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`bg-white/10 backdrop-blur-xl border border-white/20 hover:border-white/30 rounded-2xl p-6 shadow-xl shadow-black/20 transition-all duration-300 ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default FloatingCard;
