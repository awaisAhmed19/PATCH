
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, MessageCircle, Loader } from 'lucide-react';
import { toast } from 'sonner';

const LLMQuerySection = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    
    // Simulate API call to Gemini
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResponse = `Based on your query about "${query}", I recommend implementing a phased patch deployment strategy. This approach minimizes downtime while ensuring security coverage across your infrastructure.

Key recommendations:
• Prioritize critical security patches (CVSS 7.0+)
• Test patches in development environment first
• Schedule deployment during maintenance windows
• Monitor system performance post-deployment`;

      setResponse(mockResponse);
      toast.success('LLM analysis completed successfully!');
    } catch (error) {
      toast.error('Failed to process query. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-700">💬 LLM Query Interface</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about patch management strategies, vulnerability analysis, or deployment recommendations..."
            className="w-full h-24 px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={!query.trim() || isLoading}
            className="absolute bottom-3 right-3 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-300 text-white p-2 rounded-lg transition-colors"
          >
            {isLoading ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </motion.button>
        </div>
      </form>

      {response && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-200 rounded-lg p-4"
        >
          <div className="flex items-center mb-2">
            <MessageCircle className="h-4 w-4 text-cyan-500 mr-2" />
            <span className="text-sm font-medium text-gray-700">LLM Response</span>
          </div>
          <div className="text-sm text-gray-600 whitespace-pre-line">
            {response}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default LLMQuerySection;
