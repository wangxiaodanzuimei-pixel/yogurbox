import { useState, useEffect, useCallback } from "react";

interface OnboardingStep {
  targetId: string;
  message: string;
}

interface OnboardingOverlayProps {
  steps: OnboardingStep[];
  storageKey: string;
}

const OnboardingOverlay = ({ steps, storageKey }: OnboardingOverlayProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const seen = localStorage.getItem(storageKey);
    if (!seen) {
      // Delay to let page animations finish
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, [storageKey]);

  const updateRect = useCallback(() => {
    if (!visible) return;
    const step = steps[currentStep];
    if (!step) return;
    const el = document.getElementById(step.targetId);
    if (el) {
      setRect(el.getBoundingClientRect());
    }
  }, [visible, currentStep, steps]);

  useEffect(() => {
    updateRect();
    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect, true);
    return () => {
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect, true);
    };
  }, [updateRect]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      setVisible(false);
      localStorage.setItem(storageKey, "true");
    }
  };

  const handleSkip = () => {
    setVisible(false);
    localStorage.setItem(storageKey, "true");
  };

  if (!visible || !rect) return null;

  const padding = 8;
  const highlightStyle = {
    top: rect.top - padding,
    left: rect.left - padding,
    width: rect.width + padding * 2,
    height: rect.height + padding * 2,
  };

  // Position tooltip below or above the highlight
  const tooltipBelow = rect.top < window.innerHeight / 2;
  const tooltipStyle = tooltipBelow
    ? { top: rect.bottom + padding + 12, left: 24, right: 24 }
    : { bottom: window.innerHeight - rect.top + padding + 12, left: 24, right: 24 };

  return (
    <div className="fixed inset-0 z-[100]" onClick={handleNext}>
      {/* Dark overlay with cutout */}
      <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none" }}>
        <defs>
          <mask id={`onboarding-mask-${currentStep}`}>
            <rect width="100%" height="100%" fill="white" />
            <rect
              x={highlightStyle.left}
              y={highlightStyle.top}
              width={highlightStyle.width}
              height={highlightStyle.height}
              rx="16"
              fill="black"
            />
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="rgba(0,0,0,0.5)"
          mask={`url(#onboarding-mask-${currentStep})`}
        />
      </svg>

      {/* Highlight border */}
      <div
        className="absolute rounded-2xl ring-2 ring-primary/60 pointer-events-none"
        style={highlightStyle}
      />

      {/* Tooltip */}
      <div
        className="absolute bg-card rounded-2xl border-2 border-border note-shadow p-4 animate-slide-up"
        style={{ ...tooltipStyle, position: "fixed", maxWidth: "calc(100vw - 48px)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-sm font-body text-foreground leading-relaxed mb-3">
          {steps[currentStep].message}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-body text-muted-foreground">
            {currentStep + 1} / {steps.length}
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleSkip}
              className="text-[10px] font-body px-3 py-1.5 rounded-full text-muted-foreground hover:text-foreground gentle-transition"
            >
              跳过
            </button>
            <button
              onClick={handleNext}
              className="text-[10px] font-body px-4 py-1.5 rounded-full bg-primary text-primary-foreground gentle-transition hover:scale-105"
            >
              {currentStep < steps.length - 1 ? "下一步" : "知道了"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingOverlay;
