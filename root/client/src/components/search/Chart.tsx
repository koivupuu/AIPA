import React, { useRef, useState, useEffect, FC } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import { getSuitabilityColor } from './SuitabilityColors';

// Define the expected shape of the props
interface ChartProps {
  graphData: {
    suitabilityScore: number;
    value: number;
    deadline: string;
  }[];
  isSelected: boolean;
}

// Define the expected shape of the CustomTooltip props
interface CustomTooltipProps {
  active?: boolean;
  payload?: { value: number }[];
}

const Chart: FC<ChartProps> = ({ graphData, isSelected }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>(400);

  const CustomTooltip: FC<CustomTooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const originalValue = Math.pow(10, payload[0].value).toLocaleString();

      return (
        <div className="custom-tooltip">
          <p className="label">{`Value : ${originalValue}`}</p>
        </div>
      );
    }

    return null;
  };

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.offsetWidth);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isSelected]);

  return (
    <div>
      {graphData && graphData.length > 0 && (
        <div ref={containerRef}>
          <BarChart width={width} height={200} data={graphData}>
            <Bar dataKey="value">
              {graphData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getSuitabilityColor(entry.suitabilityScore)}
                />
              ))}
            </Bar>
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="deadline" />
            <YAxis
              tickFormatter={(logValue) => {
                const value = Math.pow(10, logValue);
                if (value >= 1e6) {
                  return `${(value / 1e6).toFixed(1)}M`;
                } else if (value >= 1e3) {
                  return `${(value / 1e3).toFixed(1)}K`;
                } else {
                  return value.toLocaleString();
                }
              }}
              tick={{ fontSize: 12 }}
              width={20}
            />
            <Tooltip content={<CustomTooltip />} />
          </BarChart>
        </div>
      )}
    </div>
  );
};

export default Chart;
