import { Sector } from "recharts";

export default function MiddleFillGauge({
  value,
  maxValue = 100,
  size = 1000,
  height = 520,
}: {
  value: number;
  maxValue?: number;
  size?: number;
  height?: number
}) {
  const centerAngle = 90; // pointing up
  const totalAngle = 180; // gauge span

  // Clamp and convert to percentage 0–100
  const percent = Math.min(Math.max(value, 0), maxValue) / maxValue * 100;

  // Left: decrease fill when value < 50
  const leftAngle = (Math.max(50 - percent, 0) / 50) * (totalAngle / 2);

  // Right: increase fill when value > 50
  const rightAngle = (Math.max(percent - 50, 0) / 50) * (totalAngle / 2);

  const cx = size / 2;
  const cy = size / 2;
  const innerRadius = size * 0.4;
  const outerRadius = size * 0.48;

  // Calculate pointer angle (in degrees)
  // The gauge covers from centerAngle - totalAngle/2 (left end) to centerAngle + totalAngle/2 (right end)
  // So for percent=0 → angle = centerAngle + totalAngle/2
  // for percent=100 → angle = centerAngle - totalAngle/2
  // So angle decreases as percent increases
  const pointerAngle = centerAngle + totalAngle / 2 - (percent / 100) * totalAngle;

  // Convert degrees to radians for math functions
  const pointerAngleRad = (pointerAngle * Math.PI) / 180;

  // Pointer length (slightly less than outerRadius)
  const pointerLength = outerRadius * 0.9;

  // Calculate pointer tip coordinates
  const pointerX = cx + pointerLength * Math.cos(pointerAngleRad);
  const pointerY = cy - pointerLength * Math.sin(pointerAngleRad); // y is inverted in SVG

  return (
    <svg width={size} height={height}>
      {/* Background arc */}
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={centerAngle + totalAngle / 2}
        endAngle={centerAngle - totalAngle / 2}
        fill="#eee"
      />

      {/* Left fill */}
      {percent < 50 && (
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={centerAngle}
          endAngle={centerAngle + leftAngle}
          fill="#00C49F"
        />
      )}

      {/* Right fill */}
      {percent > 50 && (
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={centerAngle}
          endAngle={centerAngle - rightAngle}
          fill="#00C49F"
        />
      )}

      {/* Middle baseline fill for exactly 50 */}
      {percent === 50 && (
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={centerAngle}
          endAngle={centerAngle}
          fill="#00C49F"
        />
      )}

      {/* Pointer line */}
      <line
        x1={cx}
        y1={cy}
        x2={pointerX}
        y2={pointerY}
        stroke="#FF5252"
        strokeWidth={5}
        strokeLinecap="round"
      />

      {/* Pointer center circle */}
      <circle cx={cx} cy={cy} r={6} fill="#FF5252" />
    </svg>
  );
}
