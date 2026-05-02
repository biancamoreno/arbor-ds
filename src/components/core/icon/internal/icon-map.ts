/**
 * @platform web
 *
 * Catálogo curado de ícones (RFC-0028).
 *
 * `<Icon name="..." />` resolve contra este mapa estático em vez de `lucide.icons`.
 * Bundlers conseguem tree-shake-friendly: no pior caso o consumidor inclui ~150 ícones
 * (≈150 kB) em vez do catálogo completo do lucide (≈600 kB).
 *
 * Para adicionar um ícone novo:
 * 1. Verifique que o nome existe em `lucide-react` (https://lucide.dev).
 * 2. Adicione o import nomeado abaixo (mantendo ordem alfabética dentro da seção).
 * 3. Adicione a chave correspondente em `iconMap`.
 * 4. Replique no `icon-map.native.ts` (paridade obrigatória — gate `icon-map.parity.test.ts`).
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
} from 'lucide-react';

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
