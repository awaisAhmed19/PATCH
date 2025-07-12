
import React from 'react';
import { motion } from 'framer-motion';
import VulnerabilityBarChart from './VulnerabilityBarChart';
import NetworkChart from './NetworkChart';
import PatchStatusPieChart from './PatchStatusPieChart';

const ChartsSection = () => {
  return (
    <div className="bg-gray-100 rounded-xl p-6 shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        📊 Graphical Visualization
      </h2>
      
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <VulnerabilityBarChart />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <NetworkChart />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <PatchStatusPieChart />
        </motion.div>
      </div>
    </div>
  );
};

export default ChartsSection;
