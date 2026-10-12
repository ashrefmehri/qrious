import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Book,
  Calendar,
  Check,
  ChevronRight,
  Clock,
  Code,
  FlaskConical,
  Globe,
  House,
  LayoutGrid,
  Leaf,
  List,
  Lock,
  LogOut,
  Mail,
  Pencil,
  Search,
  Settings,
  Sigma,
  Trophy,
  User,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";

const ICONS = {
  home: House,
  search: Search,
  mosaic: LayoutGrid,
  trophy: Trophy,
  user: User,
  zap: Zap,
  x: X,
  check: Check,
  clock: Clock,
  list: List,
  sigma: Sigma,
  flask: FlaskConical,
  arrowRight: ArrowRight,
  arrowUp: ArrowUp,
  arrowLeft: ArrowLeft,
  chevronRight: ChevronRight,
  leaf: Leaf,
  code: Code,
  book: Book,
  globe: Globe,
  settings: Settings,
  logout: LogOut,
  lock: Lock,
  mail: Mail,
  edit: Pencil,
  calendar: Calendar,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;
export const ICON_NAMES = Object.keys(ICONS) as IconName[];

export type IconProps = {
  name: IconName;
  size?: number;
  stroke?: number;
};

/** Decorative icon (aria-hidden): always pair it with a visible word or an aria-label. */
export function Icon({ name, size = 22, stroke = 1.8 }: IconProps) {
  const Svg = ICONS[name];
  return <Svg aria-hidden size={size} strokeWidth={stroke} />;
}
