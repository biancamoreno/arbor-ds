/**
 * @platform native
 *
 * Catálogo curado de ícones para React Native (RFC-0028).
 * Espelha 1:1 as chaves de `icon-map.ts` (web). Paridade testada por
 * `icon-map.parity.test.ts`.
 *
 * Para adicionar/remover ícone: alterar **ambos** os arquivos (`icon-map.ts` + este).
 */
import {
  // Navigation & direction
  ArrowDown, ArrowLeft, ArrowRight, ArrowUp,
  ChevronDown, ChevronLeft, ChevronRight, ChevronUp,
  ChevronsDown, ChevronsLeft, ChevronsRight, ChevronsUp,
  Compass, EllipsisVertical, Menu, MoreHorizontal,
  // Status & feedback
  Check, CheckCheck, CircleAlert, CircleCheck, CircleHelp,
  Info, LoaderCircle, RefreshCw, RotateCcw, TriangleAlert, X,
  // Actions
  Copy, Download, Filter, Minus, Pencil, Plus, Save, Search,
  Send, Settings, Share2, Trash2, Upload, ZoomIn, ZoomOut,
  // User & auth
  KeyRound, Lock, LogIn, LogOut, Unlock, User, UserCheck, UserPlus, Users, UserX,
  // Communication
  AtSign, Bell, BellOff, Mail, Megaphone, MessageCircle, MessageSquare, Phone,
  // Files & links
  ExternalLink, File, FileImage, FilePlus, FileText, Folder, FolderOpen,
  Image, ImageOff, Link, Link2, Paperclip,
  // E-commerce
  Box, CreditCard, Gift, Heart, Bookmark, Package, Receipt, ShoppingBag,
  ShoppingCart, Store, Tag, Tags, Truck, Wallet,
  // Rating & reaction
  Star, StarHalf, ThumbsDown, ThumbsUp,
  // Time
  Calendar, CalendarCheck, CalendarDays, Clock, Timer,
  // Media
  Camera, Mic, Pause, Play, SkipBack, SkipForward, Square, Video, Volume2, VolumeX,
  // UI & theme
  Circle, Eye, EyeOff, Globe, House, MapPin, Maximize, Minimize, Moon, Sun,
  // Layout
  GripVertical, LayoutDashboard, LayoutGrid, LayoutList, List, Grid3x3, Move, SlidersHorizontal,
  // Tech
  Bug, Code, Cpu, Database, Server, Smartphone, Terminal,
  // Highlight
  Award, Flag, Sparkles, Zap,
} from 'lucide-react-native';

export const iconMap = {
  // Navigation & direction
  ArrowDown, ArrowLeft, ArrowRight, ArrowUp,
  ChevronDown, ChevronLeft, ChevronRight, ChevronUp,
  ChevronsDown, ChevronsLeft, ChevronsRight, ChevronsUp,
  Compass, EllipsisVertical, Menu, MoreHorizontal,
  // Status & feedback
  Check, CheckCheck, CircleAlert, CircleCheck, CircleHelp,
  Info, LoaderCircle, RefreshCw, RotateCcw, TriangleAlert, X,
  // Actions
  Copy, Download, Filter, Minus, Pencil, Plus, Save, Search,
  Send, Settings, Share2, Trash2, Upload, ZoomIn, ZoomOut,
  // User & auth
  KeyRound, Lock, LogIn, LogOut, Unlock, User, UserCheck, UserPlus, Users, UserX,
  // Communication
  AtSign, Bell, BellOff, Mail, Megaphone, MessageCircle, MessageSquare, Phone,
  // Files & links
  ExternalLink, File, FileImage, FilePlus, FileText, Folder, FolderOpen,
  Image, ImageOff, Link, Link2, Paperclip,
  // E-commerce
  Box, CreditCard, Gift, Heart, Bookmark, Package, Receipt, ShoppingBag,
  ShoppingCart, Store, Tag, Tags, Truck, Wallet,
  // Rating & reaction
  Star, StarHalf, ThumbsDown, ThumbsUp,
  // Time
  Calendar, CalendarCheck, CalendarDays, Clock, Timer,
  // Media
  Camera, Mic, Pause, Play, SkipBack, SkipForward, Square, Video, Volume2, VolumeX,
  // UI & theme
  Circle, Eye, EyeOff, Globe, House, MapPin, Maximize, Minimize, Moon, Sun,
  // Layout
  GripVertical, LayoutDashboard, LayoutGrid, LayoutList, List, Grid3x3, Move, SlidersHorizontal,
  // Tech
  Bug, Code, Cpu, Database, Server, Smartphone, Terminal,
  // Highlight
  Award, Flag, Sparkles, Zap,
} as const;

export type IconName = keyof typeof iconMap;
