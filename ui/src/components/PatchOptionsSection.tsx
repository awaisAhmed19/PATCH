
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

const PatchOptionsSection = () => {
  const patchOptions = [
    {
      title: 'Critical Security Fix',
      description: 'Immediate deployment for critical vulnerabilities',
      icon: AlertTriangle,
      color: 'red',
      priority: 'High'
    },
    {
      title: 'Scheduled Maintenance',
      description: 'Deploy during next maintenance window',
      icon: Clock,
      color: 'yellow',
      priority: 'Medium'
    },
    {
      title: 'Standard Update',
      description: 'Regular patch cycle deployment',
      icon: CheckCircle,
      color: 'green',
      priority: 'Low'
    },
    {
      title: 'Security Hardening',
      description: 'Comprehensive security enhancement',
      icon: Shield,
      color: 'blue',
      priority: 'Medium'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      red: 'bg-red-50 border-red-200 text-red-700',
      yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
      green: 'bg-green-50 border-green-200 text-green-700',
      blue: 'bg-blue-50 border-blue-200 text-blue-700'
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-700">🛠 Patch Options</h3>
      
      <div className="space-y-3">
        {patchOptions.map((option, index) => (
          <motion.div
            key={option.title}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className={`p-4 border rounded-lg cursor-pointer transition-all ${getColorClasses(option.color)}`}
          >
            <div className="flex items-start space-x-3">
              <option.icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-sm">{option.title}</h4>
                  <span className="text-xs px-2 py-1 bg-white rounded-full">
                    {option.priority}
                  </span>
                </div>
                <p className="text-xs opacity-80">{option.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PatchOptionsSection;
