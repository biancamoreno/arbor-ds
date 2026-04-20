import { useTheme } from '../../../ecosystem/styled-system/adapters';
import type { SpinnerProps } from '../interfaces';

const SIZE_MAP = { sm: 16, md: 24, lg: 40 } as const;

const KEYFRAMES_ID = 'arbor-spinner-keyframes';

function injectKeyframes() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(KEYFRAMES_ID)) return;
  const style = document.createElement('style');
  style.id = KEYFRAMES_ID;
  style.textContent = `@keyframes arbor-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`;
  document.head.appendChild(style);
}

export function Spinner({ size = 'md', color, label = 'Carregando', style, ...props }: SpinnerProps) {
  const theme = useTheme();
  const px = SIZE_MAP[size];
  const strokeColor = color ?? theme.colors.brand.base;
  const strokeWidth = size === 'sm' ? 2 : 3;
  const r = (px - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * r;

  injectKeyframes();

  return (
    <svg
      role="status"
      aria-label={label}
      width={px}
      height={px}
      viewBox={`0 0 ${px} ${px}`}
      fill="none"
      style={{ animation: 'arbor-spin 0.8s linear infinite', ...style }}
      {...props}
    >
      {/* trilha de fundo */}
      <circle
        cx={px / 2}
        cy={px / 2}
        r={r}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        opacity={0.2}
      />
      {/* arco girante */}
      <circle
        cx={px / 2}
        cy={px / 2}
        r={r}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * 0.75}
      />
    </svg>
  );
}
