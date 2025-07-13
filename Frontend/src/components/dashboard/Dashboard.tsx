import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUpload } from "./FileUpload";
import { ScanOutput } from "./ScanOutput";
import { VulnerabilityCharts } from "./VulnerabilityCharts";
import { Shield, BarChart3, Upload, LogOut, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DashboardProps {
  onLogout: () => void;
}

export const Dashboard = ({ onLogout }: DashboardProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [scanComplete, setScanComplete] = useState(false);
  const { toast } = useToast();

  const handleScanStart = async (file: File, question: string) => {
    setSelectedFile(file);
    setIsScanning(true);
    setScanComplete(false);

    toast({
      title: "Scan Started",
      description: `Analyzing ${file.name} for vulnerabilities...`,
    });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("question", question);

    try {
      const res = await fetch("http://65.2.146.162:8000/llm-response", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Scan failed");

      toast({
        title: "Scan Complete",
        description: "Vulnerabilities detected and analyzed.",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Scan Failed",
        description: "Could not process file.",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
      setScanComplete(true);
    }
  };

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
    onLogout();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Shield className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  PATCH
                </h1>
                <p className="text-sm text-muted-foreground">
                  Vulnerability Detection System
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>Security Analyst</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="scan" className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
              <TabsTrigger value="scan" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Scan
              </TabsTrigger>
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Dashboard
              </TabsTrigger>
            </TabsList>
          </motion.div>

          <TabsContent value="scan" className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <FileUpload
                isScanning={isScanning}
                onScanStart={handleScanStart}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <ScanOutput
                isScanning={isScanning}
                scanComplete={scanComplete}
                fileName={selectedFile?.name || null}
                scanResultEndpoint={`http://65.2.146.162:8008/download-log?date=${new Date().toISOString().slice(0, 10)}`}
              />
            </motion.div>
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">Security Dashboard</h2>
                <p className="text-muted-foreground">
                  Comprehensive vulnerability analytics and reporting
                </p>
              </div>

              <VulnerabilityCharts scanComplete={scanComplete} />
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};
