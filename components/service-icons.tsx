"use client";

type P = { className?: string };

const base = "fill-none stroke-[1.8] stroke-black/50";
const accent = "fill-none stroke-[2.2] stroke-[#ffc400]";

export function IconNewBuildCheck({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path className={base} d="M4 10.5V20h16V10.5" />
      <path className={base} d="M3 10.5 12 4l9 6.5" />
      <path className={base} d="M9 20v-6h6v6" />
      <path className={accent} d="M7.2 12.6l1.6 1.7 3.2-3.6" />
    </svg>
  );
}

export function IconThermal({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path className={base} d="M10 14.5V5.8a2 2 0 1 1 4 0v8.7" />
      <path className={base} d="M8.8 14.2a4.2 4.2 0 1 0 6.4 0" />
      <path className={accent} d="M12 18.4c1.2 0 2-.8 2-1.8s-.8-1.8-2-1.8-2 .8-2 1.8.8 1.8 2 1.8Z" />
    </svg>
  );
}

export function IconEMI({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path className={base} d="M9 4h6v16H9z" />
      <path className={base} d="M11 7h2M11 10h2M11 13h2" />
      <path className={accent} d="M18.2 9.2a4 4 0 0 1 0 5.6" />
      <path className={accent} d="M19.9 7.5a6.5 6.5 0 0 1 0 9" />
    </svg>
  );
}

export function IconRadiation({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path className={base} d="M12 13.2a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4Z" />
      <path className={base} d="M12 4a8 8 0 1 0 8 8" />
      <path className={accent} d="M12 12l-4.2 7.2" />
      <path className={accent} d="M12 12l4.2 7.2" />
      <path className={accent} d="M12 12l8-1.2" />
    </svg>
  );
}

export function IconConclusion({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path className={base} d="M7 3h7l3 3v15H7z" />
      <path className={base} d="M14 3v3h3" />
      <path className={base} d="M9 10h6M9 13h6" />
      <path className={accent} d="M9.2 17.2l1.6 1.6 3.7-4" />
    </svg>
  );
}

export function IconPlan({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path className={base} d="M4 6h10v12H4z" />
      <path className={base} d="M14 9h6v9h-6z" />
      <path className={accent} d="M6 9h6M6 12h6M6 15h4" />
      <path className={accent} d="M15.5 12h3" />
    </svg>
  );
}