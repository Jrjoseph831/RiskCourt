"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { useState } from "react";

interface ErrorStateProps {
  title?: string;
  message?: string;
  details?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Unable to load markets",
  message = "We're having trouble connecting to our data sources. Please try again in a moment.",
  details,
  onRetry,
}: ErrorStateProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="border-y border-[#1a1a1a] bg-[#0a0a0a] py-12">
      <div className="mx-auto max-w-md px-6 text-center">
        <div className="mx-auto flex h-10 w-10 items-center justify-center">
          <AlertCircle className="h-6 w-6 text-red-400" />
        </div>
        
        <h3 className="mt-4 text-sm font-medium">{title}</h3>
        <p className="mt-2 text-xs text-[#666] leading-relaxed">{message}</p>

        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-6 flex items-center gap-1.5 bg-[#00bfa5] px-3 py-1.5 text-xs font-medium text-black hover:bg-[#00897b] transition-colors mx-auto"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Try Again
          </button>
        )}

        {details && (
          <div className="mt-6">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-[10px] uppercase tracking-wider text-[#666] hover:text-[#a0a0a0]"
            >
              {showDetails ? "Hide" : "Show"} technical details
            </button>
            {showDetails && (
              <pre className="mt-2 bg-[#1a1a1a] border border-[#2a2a2a] p-3 text-left text-[10px] text-[#666] overflow-auto font-mono">
                {details}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
