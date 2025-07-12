
import React from 'react';
import { motion } from 'framer-motion';

const Sidebar = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed left-0 top-16 h-full w-64 bg-cyan-100 border-r border-cyan-200 z-40"
    >
      <div className="flex items-center justify-center h-32">
        <span className="text-cyan-800 font-medium text-lg transform -rotate-90 whitespace-nowrap">
          Further Features to Be Added
        </span>
      </div>
    </motion.div>
  );
};

export default Sidebar;
