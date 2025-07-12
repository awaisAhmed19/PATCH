
import React from 'react';
import { motion } from 'framer-motion';
import TopBar from '../components/TopBar';
import Sidebar from '../components/Sidebar';
import DataInputSection from '../components/DataInputSection';
import PolicySection from '../components/PolicySection';
import LLMQuerySection from '../components/LLMQuerySection';
import PatchOptionsSection from '../components/PatchOptionsSection';
import ActionButtons from '../components/ActionButtons';
import ChartsSection from '../components/ChartsSection';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <TopBar />
      
      <div className="flex">
        {/* Left Sidebar */}
        <Sidebar />
        
        {/* Main Content Area */}
        <div className="flex-1 p-6 ml-64 mt-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Input & Control Area */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2"
            >
              <div className="bg-gray-100 rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  Insert the Data You Want to Analyze
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <DataInputSection />
                  <PolicySection />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <LLMQuerySection />
                  <PatchOptionsSection />
                </div>
                
                <ActionButtons />
              </div>
            </motion.div>
            
            {/* Right Charts Area */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <ChartsSection />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
