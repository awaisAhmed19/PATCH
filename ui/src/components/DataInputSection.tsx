
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText } from 'lucide-react';
import { toast } from 'sonner';

const DataInputSection = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && isValidFileType(file)) {
      setSelectedFile(file);
      toast.success(`File "${file.name}" uploaded successfully!`);
    } else {
      toast.error('Please select a valid file (.xml, .json, .csv)');
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file && isValidFileType(file)) {
      setSelectedFile(file);
      toast.success(`File "${file.name}" uploaded successfully!`);
    } else {
      toast.error('Please select a valid file (.xml, .json, .csv)');
    }
  };

  const isValidFileType = (file: File) => {
    const validTypes = ['.xml', '.json', '.csv'];
    return validTypes.some(type => file.name.toLowerCase().endsWith(type));
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-700">📂 Upload Input</h3>
      
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging 
            ? 'border-lime-400 bg-lime-50' 
            : 'border-gray-300 hover:border-lime-400 hover:bg-lime-50'
        }`}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
        <p className="text-sm text-gray-600 mb-2">
          Drop your file here or click to browse
        </p>
        <p className="text-xs text-gray-500 mb-4">
          Supports .xml, .json, .csv files only
        </p>
        
        <input
          type="file"
          accept=".xml,.json,.csv"
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
        />
        
        <label htmlFor="file-upload">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-lime-500 hover:bg-lime-600 text-white px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer inline-block"
            type="button"
          >
            Choose File
          </motion.button>
        </label>
        
        {selectedFile && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 flex items-center justify-center text-sm text-green-600"
          >
            <FileText className="h-4 w-4 mr-1" />
            {selectedFile.name}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default DataInputSection;
