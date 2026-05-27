'use client';

import { useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { ImageCompare } from '@/components/shared/ImageCompare';

interface EditorCanvasProps {
  originalUrl: string | null;
  resultUrl: string | null;
  /** Raw SVG markup string. When set (and `resultUrl` is empty), it is rendered as the result. */
  resultSvg?: string | null;
  isLoading?: boolean;
  bgColor?: string | null;
  bgImageUrl?: string | null;
}

/** Convert raw SVG markup to a data URL usable as an <img> src. */
function svgStringToDataUrl(svg: string): string {
  // Use UTF-8 URL encoding (safer than btoa for non-ASCII characters).
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const CHECKER_BG = `
  linear-gradient(45deg, #ccc 25%, transparent 25%),
  linear-gradient(-45deg, #ccc 25%, transparent 25%),
  linear-gradient(45deg, transparent 75%, #ccc 75%),
  linear-gradient(-45deg, transparent 75%, #ccc 75%)
`;

export function EditorCanvas({ originalUrl, resultUrl, resultSvg, isLoading, bgColor, bgImageUrl }: EditorCanvasProps) {
  // Prefer an explicit resultUrl; otherwise derive one from the SVG string.
  const effectiveResultUrl = useMemo(() => {
    if (resultUrl) return resultUrl;
    if (resultSvg && resultSvg.trim().length > 0) return svgStringToDataUrl(resultSvg);
    return null;
  }, [resultUrl, resultSvg]);

  return (
    <div
      className="relative flex flex-1 items-center justify-center overflow-hidden rounded-xl"
      style={{
        backgroundImage: CHECKER_BG,
        backgroundSize: '16px 16px',
        backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
        backgroundColor: '#f0f0f0',
      }}
    >
      {!originalUrl ? (
        <div className="text-center text-muted-foreground">
          <p className="text-sm">No image loaded</p>
        </div>
      ) : effectiveResultUrl ? (
        /* Result available — show animated compare slider */
        <ImageCompare
          minHeight="230px"
          key={effectiveResultUrl}
          originalUrl={originalUrl}
          resultUrl={effectiveResultUrl}
          autoPlay
          bgColor={bgColor}
          bgImageUrl={bgImageUrl}
        />
      ) : (
        /* No result yet — show original with optional loading overlay */
        <div className="relative">
          <img
            src={originalUrl}
            alt="Original"
            className="block max-h-[70vh] max-w-full object-contain rounded-[20px] shadow-2xl"
            draggable={false}
          />
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-[20px] bg-background/70 backdrop-blur-sm"
              >
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm font-medium text-muted-foreground">Processing...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

