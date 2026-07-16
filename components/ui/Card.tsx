import React from "react";

interface CardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  titleStyle?: React.CSSProperties;
}

export function Card({ title, subtitle, children, className = "", style, titleStyle }: CardProps) {
  return (
    <div className={`painel-card ${className}`} style={style}>
      <h3 className="painel-card-title" style={titleStyle}>{title}</h3>
      {subtitle && <p className="painel-card-sub">{subtitle}</p>}
      {children}
    </div>
  );
}
