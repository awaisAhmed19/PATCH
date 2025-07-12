
import React from 'react';
import { motion } from 'framer-motion';
import { FileCode, FileText } from 'lucide-react';
import { toast } from 'sonner';

const ActionButtons = () => {
  const handleCreateTemplate = () => {
    toast.success('Jinja2 template generated successfully!');
    // Simulate template generation
    console.log('Creating Jinja2 template...');
  };

  const handleConvertToPDF = () => {
    toast.success('PDF report generated and ready for download!');
    // Simulate PDF generation
    console.log('Converting to PDF...');
  };

  return (
    <div className="flex items-center justify-center space-x-8 mt-8">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleCreateTemplate}
        className="flex flex-col items-center justify-center w-24 h-24 bg-gray-200 hover:bg-gray-300 rounded-full transition-colors group"
      >
        <FileCode className="h-8 w-8 text-gray-600 group-hover:text-gray-800 mb-1" />
        <span className="text-xs text-gray-600 group-hover:text-gray-800 text-center leading-tight">
          Create Jinja2 Template
        </span>
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleConvertToPDF}
        className="flex flex-col items-center justify-center w-24 h-24 bg-gray-200 hover:bg-gray-300 rounded-full transition-colors group"
      >
        <FileText className="h-8 w-8 text-gray-600 group-hover:text-gray-800 mb-1" />
        <span className="text-xs text-gray-600 group-hover:text-gray-800 text-center leading-tight">
          Convert to PDF
        </span>
      </motion.button>
    </div>
  );
};

export default ActionButtons;
