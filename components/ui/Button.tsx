import Link from "next/link";
import type { MouseEvent, ReactNode } from "react";
import { Icon, type IconName } from "./Icon";

export type ButtonProps = {
  /** primary: the main action (one per screen). reward and on-nuit: on nuit panels. */
  variant?: "primary" | "secondary" | "ghost" | "reward" | "on-nuit";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  icon?: IconName;
  /** Renders a link instead of a button. */
  href?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: (event: MouseEvent) => void;
  /** Width and margins only. Never colors, and never display (`hidden`): wrap the button to hide it. */
  className?: string;
  children: ReactNode;
};

const VARIANTS = {
  primary: "bg-action text-sur-action hover:brightness-112",
  secondary: "border-trait text-encre hover:border-encre",
  ghost: "text-magenta-texte hover:bg-magenta-clair",
  reward: "bg-jaune text-sur-jaune hover:brightness-105",
  "on-nuit": "border-sur-nuit-douce text-sur-nuit",
};

const SIZES = {
  sm: "min-h-11 text-sm",
  md: "min-h-12 text-base",
  lg: "min-h-14 text-[17px]",
};

// Ghost buttons keep a tight padding at every size.
const PADDINGS = { sm: "px-3.5", md: "px-5", lg: "px-6" };

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  icon,
  href,
  type = "button",
  disabled,
  onClick,
  className = "",
  children,
}: ButtonProps) {
  const classes = [
    "q-pressable inline-flex items-center justify-center gap-2 rounded-m border-2 border-transparent font-text leading-5 font-bold",
    "disabled:cursor-not-allowed disabled:opacity-45",
    SIZES[size],
    variant === "ghost" ? "px-3" : PADDINGS[size],
    VARIANTS[variant],
    fullWidth ? "w-full" : "",
    className,
  ].join(" ");

  const content = (
    <>
      {icon && <Icon name={icon} size={20} />}
      {children}
    </>
  );

  if (href) {
    return (
      <Link href={href} onClick={onClick} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} disabled={disabled} onClick={onClick} className={classes}>
      {content}
    </button>
  );
}
