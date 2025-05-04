import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

export function ProjectAIAssistant({ project }) {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI Project Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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

          <Button onClick={analyzeProject} disabled={!analysisType || loading}>
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
          <div className="prose prose-sm max-w-none">
            <div className="relative">
              <div className="absolute top-2 right-2">
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
              <div className="p-4 pr-24 bg-muted rounded-lg max-h-[400px] overflow-y-auto">
                <h4 className="font-semibold mb-2">AI Analysis Results</h4>
                <div className="whitespace-pre-wrap">{analysis}</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
