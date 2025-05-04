import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Brain,
  Loader2,
  Lightbulb,
  TrendingUp,
  Megaphone,
  Copy,
  Check,
} from "lucide-react";

export function ProjectAIModal({ project, trigger }) {
  const [open, setOpen] = useState(false);
  const [analysisType, setAnalysisType] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const analyzeProject = async () => {
    if (!analysisType) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/analyze-project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectData: project,
          analysisType,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get analysis");
      }

      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (err) {
      console.error("Analysis error:", err);
      setError("Failed to generate analysis. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!analysis) return;

    try {
      await navigator.clipboard.writeText(analysis);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const analysisOptions = [
    {
      value: "market_analysis",
      label: "Market Analysis",
      icon: <TrendingUp className="h-4 w-4" />,
    },
    {
      value: "project_planning",
      label: "Project Planning",
      icon: <Lightbulb className="h-4 w-4" />,
    },
    {
      value: "marketing_strategy",
      label: "Marketing Strategy",
      icon: <Megaphone className="h-4 w-4" />,
    },
  ];

  // Reset state when modal is closed
  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
    if (!newOpen) {
      setAnalysisType("");
      setAnalysis(null);
      setError(null);
      setCopied(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Assistant
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Project Assistant
          </DialogTitle>
          <DialogDescription>
            Get AI-powered insights and analysis for your project.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col space-y-4">
          <div className="flex gap-4">
            <Select value={analysisType} onValueChange={setAnalysisType}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select analysis type" />
              </SelectTrigger>
              <SelectContent>
                {analysisOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      {option.icon}
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              onClick={analyzeProject}
              disabled={!analysisType || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze"
              )}
            </Button>
          </div>

          {error && (
            <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
              {error}
            </div>
          )}

          {analysis && (
            <div className="flex-1 flex flex-col min-h-0">
              <div className="relative flex-1">
                <div className="absolute top-0 right-0 z-10">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={copyToClipboard}
                    className="h-8 px-2"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 mr-1" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <div className="h-full bg-muted rounded-lg p-4 pr-24 overflow-y-auto">
                  <h4 className="font-semibold mb-2">AI Analysis Results</h4>
                  <div className="whitespace-pre-wrap">{analysis}</div>
                </div>
              </div>
            </div>
          )}

          {!analysis && !error && !loading && (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <p>
                Select an analysis type and click Analyze to get AI insights
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
