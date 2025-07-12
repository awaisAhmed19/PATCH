
import React from 'react';
import { motion } from 'framer-motion';

const TopBar = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 h-16 bg-cyan-100 border-b border-cyan-200 z-50"
    >
      <div className="flex items-center justify-center h-full">
        <span className="text-cyan-800 font-medium text-lg">
          Further Features to Be Added
        </span>
      </div>
    </motion.div>
  );
};

export default TopBar;
