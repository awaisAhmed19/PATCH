import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileText, AlertCircle, Play, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  isScanning: boolean;
  onScanStart: (file: File, question: string) => void;
}

export const FileUpload = ({ isScanning, onScanStart }: FileUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [question, setQuestion] = useState<string>("");
  const { toast } = useToast();

  const validateFile = (file: File): boolean => {
    const validTypes = ['.xml', '.json', '.csv'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

    if (!validTypes.includes(fileExtension)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a .xml, .json, or .csv file",
        variant: "destructive",
      });
      return false;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "File size must be less than 10MB",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
      toast({
        title: "File Selected",
        description: `${file.name} is ready for scanning`,
      });
    }
  }, [toast]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
      toast({
        title: "File Selected",
        description: `${file.name} is ready for scanning`,
      });
    }
  };

  const handleScanClick = () => {
    if (selectedFile && typeof onScanStart === "function") {
      onScanStart(selectedFile, question);
    }
  };

  return (
    <Card className="bg-gradient-card border-border/50">
      <CardContent className="p-8 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Upload File for Scanning</h2>
          <p className="text-muted-foreground">
            Upload XML, JSON, or CSV files to detect vulnerabilities
          </p>
        </div>

        {/* Drag & Drop Box */}
        <motion.div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
            dragActive
              ? "border-primary bg-primary/5 scale-105"
              : "border-border hover:border-primary/50"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <input
            type="file"
            accept=".xml,.json,.csv"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isScanning}
          />

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="space-y-4"
          >
            {selectedFile ? (
              <div className="space-y-2">
                <FileText className="h-12 w-12 mx-auto text-primary" />
                <p className="font-medium text-foreground">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="text-lg font-medium">Drop your file here</p>
                <p className="text-sm text-muted-foreground">or click to browse</p>
              </div>
            )}
          </motion.div>

          {dragActive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-primary/10 rounded-lg flex items-center justify-center"
            >
              <p className="text-lg font-medium text-primary">Drop to upload</p>
            </motion.div>
          )}
        </motion.div>

        {/* Question Text Box */}
        <div className="flex items-center gap-2 mt-4">
          <MessageCircle className="h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question about the file (optional)"
            className="flex-1 bg-background border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            disabled={isScanning}
          />
        </div>

        {/* Info Text */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <AlertCircle className="h-4 w-4" />
          <span>Supported formats: XML, JSON, CSV (max 10MB)</span>
        </div>

        {/* Scan Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            variant="scan"
            size="xl"
            className="w-full"
            onClick={handleScanClick}
            disabled={!selectedFile || isScanning}
          >
            <Play className="h-5 w-5 mr-2" />
            {isScanning ? "Scanning..." : "Start Vulnerability Scan"}
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  );
};
