"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy, ChevronDown } from "lucide-react";
import ProjectLayout from "@/components/layouts/ProjectLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import useProjectStore from "@/store/useProjectStore";

export default function AddToSitePage() {
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();
  const { selectedProject, getProjectById } = useProjectStore();

  useEffect(() => {
    getProjectById(selectedProject?._id);
  }, []);
  const demoScript =
    selectedProject?.embedCode || "<script>// Loading...</script>";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(demoScript);
      setIsCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "Installation code has been copied to your clipboard.",
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try copying manually.",
        variant: "destructive",
      });
    }
  };

  return (
    <ProjectLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 flex items-center justify-between border-b border-gray-200">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Installation
                </h2>
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-base text-gray-600">
                Add the installation code to your website
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <p className="text-gray-700">
              Paste this code{" "}
              <span className="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">
                snippet
              </span>{" "}
              before the closing{" "}
              <span className="text-blue-600">{"</body>"}</span> tag on all
              pages you want the widget to appear.
            </p>

            {/* Code Block */}
            <div className="relative group">
              <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopy}
                  className="h-10 w-10 bg-gray-800/90 hover:bg-gray-700 text-gray-400 hover:text-white rounded-lg"
                >
                  {isCopied ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Copy className="h-5 w-5" />
                  )}
                </Button>
              </div>
              <pre className="p-4 bg-[#1e1e1e] text-white rounded-lg overflow-x-auto">
                <code
                  dangerouslySetInnerHTML={{
                    __html: demoScript
                      .replace(/</g, "&lt;")
                      .replace(/>/g, "&gt;")
                      .replace(
                        /(script|type|text\/javascript)/g,
                        '<span style="color: #569CD6">$1</span>'
                      )
                      .replace(
                        /(function|var|window|document)/g,
                        '<span style="color: #569CD6">$1</span>'
                      )
                      .replace(
                        /(projectId|apiKey|config|theme|position|welcomeMessage|agentName|src|onload|parentNode|insertBefore|type):/g,
                        '<span style="color: #9CDCFE">$1:</span>'
                      )
                      .replace(
                        /"([^"]+)"/g,
                        '<span style="color: #CE9178">"$1"</span>'
                      )
                      .replace(
                        /\b(true|false)\b/g,
                        '<span style="color: #569CD6">$1</span>'
                      )
                      .replace(
                        /(\{|\}|\$|\$|;|,)/g,
                        '<span style="color: #D4D4D4">$1</span>'
                      )
                      .split("\n")
                      .map((line) => `<span class="line">${line}</span>`)
                      .join("\n"),
                  }}
                  className="text-sm font-mono block leading-6"
                />
              </pre>
            </div>
          </div>
        </motion.div>
      </div>
    </ProjectLayout>
  );
}

// Add this CSS to your global styles or as a styled-jsx block
const styles = `
.line {
  display: block;
  min-height: 1.5rem;
}

pre {
  tab-size: 2;
}

pre code {
  font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
}
`;

