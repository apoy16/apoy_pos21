import React, { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';

interface BarcodeRendererProps {
  value: string;
  format?: 'CODE128' | 'CODE39' | 'EAN13' | 'UPC';
  width?: number;
  height?: number;
  displayValue?: boolean;
  fontSize?: number;
  background?: string;
  lineColor?: string;
  className?: string;
}

export const BarcodeRenderer: React.FC<BarcodeRendererProps> = ({
  value,
  format = 'CODE128',
  width = 1.5,
  height = 40,
  displayValue = true,
  fontSize = 12,
  background = 'transparent',
  lineColor = '#1e293b',
  className = '',
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (svgRef.current && value) {
      try {
        JsBarcode(svgRef.current, value, {
          format,
          width,
          height,
          displayValue,
          fontSize,
          background,
          lineColor,
          margin: 4,
          font: 'monospace',
        });
      } catch (err) {
        console.warn('JsBarcode render error:', err);
      }
    }
  }, [value, format, width, height, displayValue, fontSize, background, lineColor]);

  return (
    <div className={`inline-flex flex-col items-center ${className}`}>
      <svg ref={svgRef} className="max-w-full h-auto overflow-visible" />
    </div>
  );
};
