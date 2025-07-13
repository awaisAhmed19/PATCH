import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Terminal, Shield, Info } from "lucide-react";

interface ScanOutputProps {
  isScanning: boolean;
  fileName: string | null;
  scanComplete: boolean;
  scanResultEndpoint: string;
}

export const ScanOutput = ({ isScanning, fileName, scanComplete, scanResultEndpoint }: ScanOutputProps) => {
  const [output, setOutput] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);

  useEffect(() => {
    if (isScanning && scanResultEndpoint) {
      setOutput([]);
      setCurrentLine(0);

      fetch(scanResultEndpoint)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch scan result");
          return res.text();
        })
        .then((data) => {
          const lines = data.split('\n');
          const interval = setInterval(() => {
            setCurrentLine((prev) => {
              if (prev < lines.length) {
                setOutput((current) => [...current, lines[prev]]);
                return prev + 1;
              } else {
                clearInterval(interval);
                return prev;
              }
            });
          }, 150);
        })
        .catch((err) => {
          setOutput(["❌ Error fetching scan results: " + err.message]);
        });
    }
  }, [isScanning, scanResultEndpoint]);

  const getSeverityBadge = (line: string) => {
    if (line.includes("CRITICAL")) {
      return <Badge variant="destructive" className="ml-2">CRITICAL</Badge>;
    }
    if (line.includes("HIGH")) {
      return <Badge className="ml-2 bg-orange-500 hover:bg-orange-600">HIGH</Badge>;
    }
    if (line.includes("MEDIUM")) {
      return <Badge className="ml-2 bg-yellow-500 hover:bg-yellow-600">MEDIUM</Badge>;
    }
    if (line.includes("LOW")) {
      return <Badge variant="outline" className="ml-2">LOW</Badge>;
    }
    return null;
  };

  return (
    <Card className="bg-gradient-card border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Terminal className="h-5 w-5 text-primary" />
          AI Vulnerability Analysis
          {isScanning && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full"
            />
          )}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-96 w-full rounded-md border bg-background/30 p-4">
          <div className="font-mono text-sm space-y-1">
            <AnimatePresence>
              {output.length === 0 && !isScanning ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-80 text-center"
                >
                  <Shield className="h-16 w-16 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium text-muted-foreground">
                    Scan results will appear here
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Upload a file and start scanning to begin analysis
                  </p>
                </motion.div>
              ) : (
                output.map((line, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex items-center ${
                      line.includes("🔴") || line.includes("CRITICAL")
                        ? "text-destructive font-semibold"
                        : line.includes("🟠") || line.includes("HIGH")
                        ? "text-orange-400 font-semibold"
                        : line.includes("🟡") || line.includes("MEDIUM")
                        ? "text-yellow-400 font-semibold"
                        : line.includes("🔵") || line.includes("LOW")
                        ? "text-blue-400 font-semibold"
                        : line.includes("✅")
                        ? "text-green-400 font-semibold"
                        : line.includes("📊")
                        ? "text-primary font-semibold"
                        : "text-foreground"
                    }`}
                  >
                    <span className="whitespace-pre-wrap">{line}</span>
                    {getSeverityBadge(line)}
                  </motion.div>
                ))
              )}
            </AnimatePresence>

            {isScanning && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-primary"
              >
                ▊
              </motion.div>
            )}
          </div>
        </ScrollArea>

        {scanComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-accent/30 rounded-lg border border-border/50"
          >
            <div className="flex items-center gap-2 mb-2">
              <Info className="h-4 w-4 text-primary" />
              <span className="font-semibold">Scan Complete</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Analysis finished. Check the dashboard for detailed charts and export options.
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};
