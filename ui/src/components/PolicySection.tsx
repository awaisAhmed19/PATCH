
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Settings } from 'lucide-react';

const PolicySection = () => {
  const [selectedPolicy, setSelectedPolicy] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const policies = [
    'Critical Security Patches Only',
    'Weekly Patch Schedule',
    'Monthly Maintenance Window',
    'High Priority CVE Response',
    'Custom Enterprise Policy',
    'Add Your Own...'
  ];

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-700">🎯 Select Patch Management Policy</h3>
      
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-left flex items-center justify-between hover:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
        >
          <div className="flex items-center">
            <Settings className="h-4 w-4 text-gray-400 mr-2" />
            <span className={selectedPolicy ? 'text-gray-900' : 'text-gray-500'}>
              {selectedPolicy || 'Choose a policy...'}
            </span>
          </div>
          <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </motion.button>

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto"
          >
            {policies.map((policy, index) => (
              <motion.button
                key={policy}
                whileHover={{ backgroundColor: '#f0f9ff' }}
                onClick={() => {
                  setSelectedPolicy(policy);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-blue-50 first:rounded-t-lg last:rounded-b-lg transition-colors"
              >
                {policy}
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PolicySection;
