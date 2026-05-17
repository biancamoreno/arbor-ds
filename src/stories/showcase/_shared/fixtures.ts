/**
 * @platform shared
 * Fixtures para as demos vitrine da RFC-0041 PR3. Dados realistas (não lorem)
 * para que a tipografia e a hierarquia sejam exercitadas em condições reais.
 * Imagens de produto vêm de Unsplash com fallback handled pelo `<Image>` do DS.
 */

export type ShowcaseProduct = {
  id: string;
  title: string;
  category: string;
  price: string;
  originalPrice?: string;
  rating: number;
  reviews: number;
  imageUrl: string;
  imageAlt: string;
  badge?: 'new' | 'sale' | 'lowStock';
};

export const products: ShowcaseProduct[] = [
  {
    id: 'p1',
    title: 'Tênis runner UltraFlow',
    category: 'Calçados',
    price: 'R$ 489,00',
    originalPrice: 'R$ 619,00',
    rating: 4.7,
    reviews: 1284,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80&auto=format&fit=crop',
    imageAlt: 'Tênis esportivo vermelho em fundo neutro',
    badge: 'sale',
  },
  {
    id: 'p2',
    title: 'Jaqueta corta-vento Trail',
    category: 'Vestuário',
    price: 'R$ 329,00',
    rating: 4.5,
    reviews: 412,
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80&auto=format&fit=crop',
    imageAlt: 'Jaqueta verde esportiva pendurada em mostruário',
    badge: 'new',
  },
  {
    id: 'p3',
    title: 'Mochila urbana 24L',
    category: 'Acessórios',
    price: 'R$ 259,00',
    rating: 4.8,
    reviews: 967,
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80&auto=format&fit=crop',
    imageAlt: 'Mochila preta com detalhes em couro',
  },
  {
    id: 'p4',
    title: 'Garrafa térmica 750ml',
    category: 'Acessórios',
    price: 'R$ 149,00',
    rating: 4.6,
    reviews: 2103,
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80&auto=format&fit=crop',
    imageAlt: 'Garrafa térmica metálica em mesa de madeira',
    badge: 'lowStock',
  },
  {
    id: 'p5',
    title: 'Camiseta tech merino',
    category: 'Vestuário',
    price: 'R$ 219,00',
    rating: 4.4,
    reviews: 318,
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80&auto=format&fit=crop',
    imageAlt: 'Camiseta neutra dobrada em superfície clara',
  },
  {
    id: 'p6',
    title: 'Boné técnico Aventura',
    category: 'Acessórios',
    price: 'R$ 119,00',
    originalPrice: 'R$ 159,00',
    rating: 4.3,
    reviews: 224,
    imageUrl: 'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=600&q=80&auto=format&fit=crop',
    imageAlt: 'Boné esportivo bege em fundo neutro',
    badge: 'sale',
  },
];

export const productCategories = ['Todos', 'Calçados', 'Vestuário', 'Acessórios'] as const;
export const productSorts = ['Relevância', 'Mais vendidos', 'Menor preço', 'Maior preço'] as const;

export type ShowcaseKpi = {
  label: string;
  value: string;
  delta: string;
  trend: 'up' | 'down' | 'flat';
  hint: string;
};

export const kpis: ShowcaseKpi[] = [
  {
    label: 'Receita do mês',
    value: 'R$ 184.320',
    delta: '+12,4%',
    trend: 'up',
    hint: 'vs. abril/2026',
  },
  {
    label: 'Pedidos confirmados',
    value: '2.847',
    delta: '+8,1%',
    trend: 'up',
    hint: '154 hoje',
  },
  {
    label: 'Taxa de conversão',
    value: '3,82%',
    delta: '−0,3 p.p.',
    trend: 'down',
    hint: 'meta 4,0%',
  },
  {
    label: 'Ticket médio',
    value: 'R$ 287',
    delta: '+R$ 14',
    trend: 'up',
    hint: '7 dias',
  },
];

export type ShowcaseOrder = {
  id: string;
  customer: string;
  email: string;
  total: string;
  status: 'paid' | 'shipped' | 'delivered' | 'pending' | 'canceled';
  date: string;
  items: number;
};

export const orders: ShowcaseOrder[] = [
  { id: '#48217', customer: 'Mariana Coelho', email: 'mari@coelho.app', total: 'R$ 689,00', status: 'paid',      date: '07 mai · 14:22', items: 2 },
  { id: '#48216', customer: 'Eduardo Pacheco', email: 'edu.p@gmail.com',  total: 'R$ 219,00', status: 'shipped',   date: '07 mai · 13:48', items: 1 },
  { id: '#48215', customer: 'Cláudia Tavares',  email: 'claudia@tavares.io',total: 'R$ 1.189,00', status: 'delivered', date: '07 mai · 12:01', items: 4 },
  { id: '#48214', customer: 'Henrique Salles',  email: 'h.salles@me.com',  total: 'R$ 89,00',  status: 'pending',   date: '07 mai · 10:30', items: 1 },
  { id: '#48213', customer: 'Larissa Andrade',  email: 'lari@andrade.dev', total: 'R$ 459,00', status: 'paid',      date: '06 mai · 22:14', items: 2 },
  { id: '#48212', customer: 'Otávio Fontes',    email: 'otavio@fontes.eco',total: 'R$ 329,00', status: 'canceled',  date: '06 mai · 19:55', items: 1 },
];

export type ShowcaseService = {
  id: string;
  title: string;
  provider: string;
  duration: string;
  price: string;
  imageUrl: string;
  imageAlt: string;
  rating: number;
  available: boolean;
};

export const services: ShowcaseService[] = [
  {
    id: 's1',
    title: 'Corte e barba clássico',
    provider: 'Estúdio Norte · Rafael',
    duration: '45 min',
    price: 'R$ 89',
    imageUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80&auto=format&fit=crop',
    imageAlt: 'Cliente em cadeira de barbearia recebendo corte',
    rating: 4.9,
    available: true,
  },
  {
    id: 's2',
    title: 'Limpeza de pele profunda',
    provider: 'Pele Studio · Camila',
    duration: '90 min',
    price: 'R$ 220',
    imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80&auto=format&fit=crop',
    imageAlt: 'Cabine de tratamento estético com luz natural',
    rating: 4.8,
    available: true,
  },
  {
    id: 's3',
    title: 'Massagem relaxante 60 min',
    provider: 'Casa Hana · Bruno',
    duration: '60 min',
    price: 'R$ 180',
    imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80&auto=format&fit=crop',
    imageAlt: 'Sala de massagem com toalhas dobradas',
    rating: 4.7,
    available: false,
  },
  {
    id: 's4',
    title: 'Manicure + esmaltação em gel',
    provider: 'Atelier Lúmen · Vanessa',
    duration: '75 min',
    price: 'R$ 135',
    imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80&auto=format&fit=crop',
    imageAlt: 'Mãos em sessão de manicure com esmalte rosa',
    rating: 4.6,
    available: true,
  },
];

export const serviceCategories = ['Cabelo', 'Estética', 'Bem-estar', 'Unhas', 'Massagem'] as const;

export type ShowcaseHero = {
  badge: string;
  title: string;
  subtitle: string;
  primaryCta: string;
  secondaryCta: string;
  socialProof: string;
};

export const hero: ShowcaseHero = {
  badge: 'Novo · v1 do design system',
  title: 'Interfaces que crescem com seu produto.',
  subtitle:
    'Arbor é o design system multi-produto que entrega tipografia, cor, motion e densidade ' +
    'prontos para web e mobile. Importe, componha, tematize. Sem sair do contrato.',
  primaryCta: 'Começar agora',
  secondaryCta: 'Ver no Storybook',
  socialProof: 'Construído sobre tokens auditáveis · WCAG AA por construção · cross-platform real',
};

export type ShowcaseFeature = {
  icon: string;
  title: string;
  description: string;
};

export const features: ShowcaseFeature[] = [
  {
    icon: 'LayoutDashboard',
    title: 'Cascade de 5 níveis',
    description: 'Primitives, semantics, presets, component tokens e CSS vars. Override no nível certo, sem fork.',
  },
  {
    icon: 'Smartphone',
    title: 'Cross-platform real',
    description: 'API única entre web e React Native. 36 componentes em paridade — não é polyfill, é convergência.',
  },
  {
    icon: 'CircleCheck',
    title: 'Acessível por default',
    description: 'WCAG 2.4.7, 2.4.11 e 2.5.5 cobertos sem opt-in. Touch target 44px. Foco visível com glow.',
  },
  {
    icon: 'Sparkles',
    title: 'Tematização rica',
    description: 'Cores, tipografia, motion, densidade, sombras e raios. createTheme() entrega identidade em uma chamada.',
  },
  {
    icon: 'Zap',
    title: 'Bundle disciplinado',
    description: 'Catálogo de ícones curado, tree-shake por construção, peers externalizadas. 27 KB no consumidor.',
  },
  {
    icon: 'Code',
    title: 'Governado por RFC',
    description: 'Cada decisão pública passa por proposta. Nenhuma quebra surpresa. Cada token tem dono.',
  },
];

export type ShowcaseTestimonial = {
  quote: string;
  author: string;
  role: string;
};

export const testimonials: ShowcaseTestimonial[] = [
  {
    quote: 'Trocamos 4 forks de DS por um único tema. Tempo de feature de produto caiu pela metade.',
    author: 'Renata Vilaça',
    role: 'Head of Design · Plural',
  },
  {
    quote: 'Cross-platform que finalmente respeita o que cada plataforma faz bem. App e web com mesma DX.',
    author: 'Igor Bandeira',
    role: 'Engenheiro Mobile · Tropos',
  },
];
