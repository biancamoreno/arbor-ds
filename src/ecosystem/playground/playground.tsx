import React from 'react';
import './playground.css';

type ScreenId =
  | 'home'
  | 'catalogo'
  | 'produto'
  | 'editar'
  | 'criar'
  | 'carrinho'
  | 'checkout'
  | 'aprovacao3d'
  | 'pedido'
  | 'dashboard';

type Screen = {
  id: ScreenId;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
};

const screens: Screen[] = [
  { id: 'home', label: 'Home', eyebrow: 'Entrada principal', title: 'Transforme sua ideia em produto real', description: 'Home com hero claro, jornadas de entrada, prova de confiança e produtos em destaque.' },
  { id: 'catalogo', label: 'Vitrine', eyebrow: 'Exploração', title: 'Catálogo com filtros e ações rápidas', description: 'Grid de produtos com favoritar, escolher direto ou iniciar edição personalizada.' },
  { id: 'produto', label: 'Produto pronto', eyebrow: 'Compra direta', title: 'Escolha algo da vitrine com previsibilidade', description: 'Detalhes do item, variantes, quantidade, prazo e explicação de aprovação do modelo 3D.' },
  { id: 'editar', label: 'Editar produto', eyebrow: 'Personalização guiada', title: 'Edite um produto existente com texto e imagem', description: 'Fluxo assistido por IA com preview, versões, feedback e aprovação antes do carrinho.' },
  { id: 'criar', label: 'Crie o seu', eyebrow: 'Criação do zero', title: 'Texto ou imagem viram preview e modelo 3D', description: 'Stepper visível para reduzir ansiedade e deixar claro o que acontece antes e depois do pagamento.' },
  { id: 'carrinho', label: 'Carrinho', eyebrow: 'Revisão', title: 'Itens prontos, editados e criados em um só lugar', description: 'Resumo com origem do item, prazo, observações críticas e CTA para checkout.' },
  { id: 'checkout', label: 'Checkout', eyebrow: 'Conversão', title: 'Fluxo seguro, curto e confiável', description: 'Identificação, endereço, entrega, pagamento e comunicação de compra protegida.' },
  { id: 'aprovacao3d', label: 'Aprovação 3D', eyebrow: 'Pós-pagamento', title: 'Seu pedido só segue após aprovação final', description: 'Tela dedicada para visualizar o modelo 3D, reprovar com observações e acompanhar revisões.' },
  { id: 'pedido', label: 'Status do pedido', eyebrow: 'Acompanhamento', title: 'Timeline clara do pedido', description: 'Etapas visuais, previsão, rastreio, prévias aprovadas e contexto completo do pedido.' },
  { id: 'dashboard', label: 'Área logada', eyebrow: 'Relacionamento', title: 'Pedidos, favoritos e suporte em uma navegação unificada', description: 'Dashboard com histórico, listas salvas, revisões passadas e dados pessoais.' },
];

const featuredProducts = [
  { name: 'Luminária Orbit', price: 'R$ 149', tag: 'Decoração', eta: '7 a 10 dias' },
  { name: 'Organizador de mesa Wave', price: 'R$ 89', tag: 'Utilidades', eta: '5 a 8 dias' },
  { name: 'Topo de bolo personalizado', price: 'R$ 69', tag: 'Presentes', eta: '4 a 7 dias' },
  { name: 'Miniatura pet em 3D', price: 'R$ 219', tag: 'Personalizados', eta: '10 a 14 dias' },
];

const flowSteps = ['Enviar ideia', 'Gerar preview', 'Aprovar preview', 'Pagar', 'Aprovar modelo 3D', 'Produção', 'Envio'];

const coreGroups = [
  { title: 'Fundação', items: ['Tokens de cor', 'Espaçamentos', 'Tipografia', 'Elevação', 'Raio', 'Grid responsivo'] },
  { title: 'Inputs e ação', items: ['Button', 'Icon Button', 'Text Input', 'Text Area', 'Select', 'Uploader', 'Counter', 'Search'] },
  { title: 'Comércio', items: ['Product Card', 'Product Gallery', 'Price Block', 'Favorite Button', 'Cart Item', 'Order Summary'] },
  { title: 'Fluxos assistidos', items: ['Stepper', 'Preview Panel', 'Revision History', 'Feedback Box', 'Status Badge', 'Approval Modal'] },
];

const implementationPhases = [
  { title: 'Fase 1', text: 'Fechar foundations e componentes básicos de ação e formulário com tokens, acessibilidade e estados.' },
  { title: 'Fase 2', text: 'Construir patterns de e-commerce: card, galeria, resumo do pedido, badges, filtros e drawer de carrinho.' },
  { title: 'Fase 3', text: 'Adicionar patterns do serviço: stepper, uploader assistido, preview panel, revisão, histórico e aprovação 3D.' },
  { title: 'Fase 4', text: 'Consolidar templates de páginas e regras de conteúdo para home, catálogo, checkout, pós-pagamento e dashboard.' },
];

function SectionHeader({ title, text }: { title: string; text: string }) {
  return (
    <div className="fp-section-header">
      <span className="fp-eyebrow">Design system + protótipo</span>
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  );
}

function ScreenNav({
  activeScreen,
  setActiveScreen,
}: {
  activeScreen: ScreenId;
  setActiveScreen: React.Dispatch<React.SetStateAction<ScreenId>>;
}) {
  return (
    <div className="fp-screen-nav">
      {screens.map((screen) => (
        <button key={screen.id} type="button" className={screen.id === activeScreen ? 'fp-screen-tab is-active' : 'fp-screen-tab'} onClick={() => setActiveScreen(screen.id)}>
          <span>{screen.label}</span>
          <small>{screen.eyebrow}</small>
        </button>
      ))}
    </div>
  );
}

function HomeScreen() {
  return <div className="fp-screen-layout"><section className="fp-hero"><div className="fp-hero-copy"><span className="fp-pill">Impressão 3D personalizada para todo o Brasil</span><h1>Você imagina, a gente modela e imprime.</h1><p>Escolha algo pronto, edite um produto da vitrine ou crie do zero a partir de texto e foto. O FazPraMim gera preview, modelo 3D para aprovação e produz com entrega nacional.</p><div className="fp-cta-row"><button type="button" className="fp-btn fp-btn-primary">Escolher produto</button><button type="button" className="fp-btn fp-btn-secondary">Editar produto</button><button type="button" className="fp-btn fp-btn-ghost">Criar o meu</button></div><div className="fp-trust-row"><div><strong>+3.200</strong><span>pedidos entregues</span></div><div><strong>2 aprovações</strong><span>preview e modelo 3D</span></div><div><strong>Brasil inteiro</strong><span>produção e envio rastreado</span></div></div></div><div className="fp-hero-preview"><div className="fp-preview-card is-highlight"><span className="fp-card-badge">Fluxo guiado</span><h3>Do prompt ao produto físico</h3><ol><li>Envie sua ideia</li><li>Aprove o preview visual</li><li>Aprove o modelo 3D final</li><li>Receba em casa</li></ol></div><div className="fp-preview-grid"><article className="fp-mock-product salmon"><span>Presente</span><strong>Topo de bolo</strong></article><article className="fp-mock-product mint"><span>Organização</span><strong>Suporte desk</strong></article><article className="fp-mock-product sand"><span>Decoração</span><strong>Luminária 3D</strong></article></div></div></section><section className="fp-grid-3">{[['Escolha da vitrine', 'Produtos prontos com preço inicial, prazo e compra direta.'], ['Edite um produto', 'Personalize um modelo existente com texto, imagem e revisões.'], ['Crie o seu', 'Envie sua ideia e receba uma proposta visual e técnica guiada.']].map(([title, text]) => <article key={title} className="fp-feature-card"><span className="fp-card-badge">{title}</span><p>{text}</p></article>)}</section><section className="fp-panel"><div className="fp-panel-header"><h3>Como funciona</h3><span>Clareza do fluxo para reduzir dúvidas</span></div><div className="fp-step-row">{flowSteps.slice(0, 4).map((step, index) => <div key={step} className="fp-step-card"><strong>{String(index + 1).padStart(2, '0')}</strong><span>{step}</span></div>)}</div></section><section className="fp-panel"><div className="fp-panel-header"><h3>Produtos em destaque</h3><span>Cards com foco em preview e CTA</span></div><div className="fp-product-grid">{featuredProducts.map((product) => <article key={product.name} className="fp-product-card"><div className="fp-product-image"><span>{product.tag}</span></div><div className="fp-product-body"><h4>{product.name}</h4><p>A partir de {product.price}</p><small>{product.eta}</small></div><div className="fp-card-actions"><button type="button" className="fp-btn fp-btn-primary">Escolher</button><button type="button" className="fp-icon-btn" aria-label="Favoritar">♡</button></div></article>)}</div></section></div>;
}

function CatalogScreen() {
  return <div className="fp-screen-layout"><section className="fp-panel"><div className="fp-toolbar"><div><span className="fp-eyebrow">Vitrine</span><h3>Encontre um ponto de partida</h3></div><div className="fp-toolbar-actions"><input className="fp-input" placeholder="Buscar por presente, decoração, pet..." /><select className="fp-select" defaultValue="relevancia"><option value="relevancia">Mais relevantes</option><option value="preco">Menor preço</option><option value="prazo">Menor prazo</option></select></div></div><div className="fp-chip-row">{['Decoração', 'Presentes', 'Organizadores', 'Infantil', 'Utilidades', 'Personalizados'].map((chip, index) => <button key={chip} type="button" className={index === 0 ? 'fp-chip is-active' : 'fp-chip'}>{chip}</button>)}</div></section><section className="fp-product-grid">{featuredProducts.concat(featuredProducts).map((product, index) => <article key={`${product.name}-${index}`} className="fp-product-card"><div className={`fp-product-image ${index % 3 === 0 ? 'is-accent' : ''}`}><span>{product.tag}</span></div><div className="fp-product-body"><h4>{product.name}</h4><p>{product.price}</p><small>{product.eta}</small></div><div className="fp-card-actions fp-card-actions-spread"><button type="button" className="fp-btn fp-btn-primary">Escolher produto</button><button type="button" className="fp-btn fp-btn-secondary">Editar produto</button><button type="button" className="fp-icon-btn" aria-label="Favoritar">♥</button></div></article>)}</section></div>;
}

function ProductScreen() {
  return <div className="fp-detail-layout"><div className="fp-gallery-panel"><div className="fp-gallery-main"><span className="fp-card-badge">Preview do produto</span></div><div className="fp-gallery-thumbs"><div /><div /><div /></div></div><aside className="fp-summary-panel"><span className="fp-eyebrow">Escolha direta</span><h3>Luminária Orbit personalizada</h3><p className="fp-price">A partir de R$ 149</p><p className="fp-muted">Após a compra, o modelo 3D será gerado para aprovação. Se você reprovar, poderá enviar observações para ajuste.</p><div className="fp-form-stack"><label>Cor<select className="fp-select" defaultValue="areia"><option value="areia">Areia</option><option value="verde">Verde névoa</option><option value="grafite">Grafite</option></select></label><label>Mensagem gravada<input className="fp-input" placeholder="Ex.: Para a sala nova" /></label><div className="fp-counter"><button type="button">-</button><span>1</span><button type="button">+</button></div></div><div className="fp-order-box"><div><span>Prazo estimado</span><strong>7 a 10 dias úteis</strong></div><div><span>Frete</span><strong>Calculado no checkout</strong></div><div><span>Aprovação final</span><strong>Modelo 3D antes da produção</strong></div></div><button type="button" className="fp-btn fp-btn-primary fp-btn-block">Adicionar ao carrinho</button></aside></div>;
}

function EditScreen() {
  return <div className="fp-detail-layout"><div className="fp-panel"><div className="fp-panel-header"><h3>Personalizar produto da vitrine</h3><span>Processo criativo assistido</span></div><div className="fp-form-stack"><label>O que você quer mudar?<textarea className="fp-textarea" placeholder="Descreva forma, nome, cor, uso e estilo desejado." rows={5} /></label><label>Imagem de referência<div className="fp-uploader">Arraste a imagem aqui ou selecione um arquivo</div></label><label>Observações adicionais<textarea className="fp-textarea" placeholder="Ex.: manter o tamanho, reforçar a base, usar acabamento fosco." rows={4} /></label><div className="fp-cta-row"><button type="button" className="fp-btn fp-btn-primary">Gerar preview</button><button type="button" className="fp-btn fp-btn-secondary">Regenerar</button></div></div></div><aside className="fp-summary-panel"><span className="fp-eyebrow">Preview em aprovação</span><div className="fp-preview-stage"><div className="fp-preview-image"><span>Versão 03</span></div><div className="fp-version-row"><button type="button" className="fp-version-chip is-active">V3</button><button type="button" className="fp-version-chip">V2</button><button type="button" className="fp-version-chip">V1</button></div></div><div className="fp-feedback-box"><strong>Feedback do cliente</strong><p>Gostei da silhueta, mas quero a alça mais grossa e a base menos alta.</p></div><div className="fp-cta-row"><button type="button" className="fp-btn fp-btn-primary">Aprovar preview</button><button type="button" className="fp-btn fp-btn-ghost">Rejeitar</button></div><button type="button" className="fp-btn fp-btn-secondary fp-btn-block">Adicionar ao carrinho</button></aside></div>;
}

function CreateScreen() {
  return <div className="fp-screen-layout"><section className="fp-panel"><div className="fp-panel-header"><h3>Crie o seu do zero</h3><span>Texto ou imagem como ponto de partida</span></div><div className="fp-stepper">{flowSteps.map((step, index) => <div key={step} className={index < 3 ? 'fp-stepper-item is-done' : index === 3 ? 'fp-stepper-item is-current' : 'fp-stepper-item'}><strong>{index + 1}</strong><span>{step}</span></div>)}</div><div className="fp-create-grid"><article className="fp-create-card"><span className="fp-card-badge">Caminho A</span><h4>Enviar imagem</h4><div className="fp-uploader">Upload de foto, rascunho ou referência</div><button type="button" className="fp-btn fp-btn-primary">Gerar preview inicial</button></article><article className="fp-create-card"><span className="fp-card-badge">Caminho B</span><h4>Descrever por texto</h4><textarea className="fp-textarea" rows={6} defaultValue="Quero um organizador de mesa minimalista com espaço para canetas, celular e cartões." /><div className="fp-state-row"><span className="fp-state is-loading">Gerando preview</span><span className="fp-state">Aguardando aprovação</span></div><button type="button" className="fp-btn fp-btn-secondary">Gerar imagem</button></article></div></section><section className="fp-detail-layout"><div className="fp-panel"><div className="fp-preview-stage large"><div className="fp-preview-image is-3d"><span>Preview e modelo preliminar</span></div></div></div><aside className="fp-summary-panel"><h3>Ações</h3><div className="fp-cta-row fp-cta-column"><button type="button" className="fp-btn fp-btn-primary">Aprovar preview</button><button type="button" className="fp-btn fp-btn-secondary">Ajustar</button><button type="button" className="fp-btn fp-btn-ghost">Rejeitar</button></div><label>Observações para ajuste<textarea className="fp-textarea" rows={5} placeholder="Ex.: deixar mais compacto e arredondar os cantos." /></label></aside></section></div>;
}

function CartScreen() {
  return <div className="fp-detail-layout"><div className="fp-panel"><div className="fp-panel-header"><h3>Carrinho</h3><span>Pronto para seguir ao checkout</span></div><div className="fp-cart-list">{[['Luminária Orbit', 'Vitrine', 'R$ 149'], ['Topo de bolo editado', 'Editado', 'R$ 92'], ['Organizador criado do zero', 'Criado do zero', 'R$ 174']].map(([name, origin, price]) => <article key={name} className="fp-cart-item"><div className="fp-cart-thumb" /><div className="fp-cart-copy"><h4>{name}</h4><p>Origem: {origin}</p><small>Prazo estimado entre 5 e 12 dias úteis</small></div><strong>{price}</strong></article>)}</div></div><aside className="fp-summary-panel"><h3>Resumo</h3><div className="fp-order-box"><div><span>Subtotal</span><strong>R$ 415</strong></div><div><span>Frete estimado</span><strong>R$ 28</strong></div><div><span>Total</span><strong>R$ 443</strong></div></div><div className="fp-feedback-box"><strong>Importante</strong><p>O pagamento confirma o início do processo. Depois disso, você ainda aprova o modelo 3D final antes da produção.</p></div><button type="button" className="fp-btn fp-btn-primary fp-btn-block">Ir para checkout</button></aside></div>;
}

function CheckoutScreen() {
  return <div className="fp-detail-layout"><div className="fp-panel"><div className="fp-panel-header"><h3>Checkout</h3><span>Compra protegida e fluxo simples</span></div><div className="fp-checkout-grid"><div className="fp-form-stack"><label>Nome completo<input className="fp-input" placeholder="Seu nome" /></label><label>E-mail<input className="fp-input" placeholder="voce@email.com" /></label><label>CPF<input className="fp-input" placeholder="000.000.000-00" /></label></div><div className="fp-form-stack"><label>CEP<input className="fp-input" placeholder="00000-000" /></label><label>Endereço<input className="fp-input" placeholder="Rua, número, complemento" /></label><label>Entrega<select className="fp-select" defaultValue="normal"><option value="normal">Entrega padrão</option><option value="expressa">Entrega expressa</option></select></label></div></div><div className="fp-payment-row"><button type="button" className="fp-payment-card is-active">Cartão</button><button type="button" className="fp-payment-card">Pix</button><button type="button" className="fp-payment-card">Boleto</button></div></div><aside className="fp-summary-panel"><h3>Resumo do pedido</h3><div className="fp-order-box"><div><span>Itens</span><strong>3 produtos</strong></div><div><span>Cupom</span><strong>FAZ10</strong></div><div><span>Total</span><strong>R$ 443</strong></div></div><div className="fp-state-row"><span className="fp-state is-success">Compra protegida</span><span className="fp-state">Acompanhamento completo</span></div><p className="fp-muted">Antes da produção final, você aprova o modelo 3D gerado para o pedido.</p><button type="button" className="fp-btn fp-btn-primary fp-btn-block">Finalizar compra</button></aside></div>;
}

function Approval3DScreen() {
  return <div className="fp-detail-layout"><div className="fp-panel"><div className="fp-panel-header"><h3>Aprovação do modelo 3D final</h3><span>Seu pedido só segue para produção após sua aprovação final do modelo</span></div><div className="fp-approval-viewer"><div className="fp-preview-image is-3d viewer"><span>Mock de visualização 3D</span></div><div className="fp-tech-notes"><div><span>Escala</span><strong>18 cm</strong></div><div><span>Material</span><strong>PLA Premium</strong></div><div><span>Espessura mínima</span><strong>2.4 mm</strong></div></div></div></div><aside className="fp-summary-panel"><div className="fp-feedback-box"><strong>Histórico de revisões</strong><p>V1 reprovada: base muito estreita. V2 ajustada com reforço estrutural.</p></div><label>Observações do cliente<textarea className="fp-textarea" rows={5} placeholder="Descreva o que precisa ser ajustado caso reprove." /></label><div className="fp-cta-row fp-cta-column"><button type="button" className="fp-btn fp-btn-primary">Aprovar modelo</button><button type="button" className="fp-btn fp-btn-secondary">Solicitar ajuste</button></div></aside></div>;
}

function OrderScreen() {
  const statuses = ['Efetuado', 'Confirmado', 'Em produção', 'Preparando envio', 'Em transporte', 'Entregue'];
  return <div className="fp-screen-layout"><section className="fp-panel"><div className="fp-toolbar"><div><span className="fp-eyebrow">Pedido #FPM-2048</span><h3>Acompanhamento completo</h3></div><span className="fp-state is-success">Entrega estimada: 24 de abril</span></div><div className="fp-timeline">{statuses.map((status, index) => <div key={status} className={index < 3 ? 'fp-timeline-item is-done' : index === 3 ? 'fp-timeline-item is-current' : 'fp-timeline-item'}><strong>{status}</strong><span>{index < 3 ? 'Concluído' : index === 3 ? 'Etapa atual' : 'Próxima etapa'}</span></div>)}</div></section><section className="fp-grid-3"><article className="fp-feature-card"><span className="fp-card-badge">Itens</span><p>Luminária Orbit, Topo de bolo editado e Organizador criado do zero.</p></article><article className="fp-feature-card"><span className="fp-card-badge">Prévias aprovadas</span><p>Preview visual aprovado e modelo 3D final registrado no pedido.</p></article><article className="fp-feature-card"><span className="fp-card-badge">Rastreio</span><p>Disponível quando o pedido entrar em transporte.</p></article></section></div>;
}

function DashboardScreen() {
  return <div className="fp-dashboard-layout"><aside className="fp-dashboard-nav">{['Meus pedidos', 'Detalhes e status', 'Favoritos', 'Dados pessoais', 'Endereços', 'Pagamentos', 'Suporte'].map((item, index) => <button key={item} type="button" className={index === 0 ? 'fp-dashboard-link is-active' : 'fp-dashboard-link'}>{item}</button>)}</aside><div className="fp-dashboard-content"><div className="fp-grid-3"><article className="fp-feature-card"><span className="fp-card-badge">Pedidos ativos</span><p>2 pedidos em andamento, com revisões e prazos centralizados.</p></article><article className="fp-feature-card"><span className="fp-card-badge">Favoritos</span><p>Listas por tema: Casa nova, Presente criativo e Organização.</p></article><article className="fp-feature-card"><span className="fp-card-badge">Suporte</span><p>Contato contextual por pedido, com histórico de aprovações e ajustes.</p></article></div><section className="fp-panel"><div className="fp-panel-header"><h3>Pedidos recentes</h3><span>Histórico, revisões e reabertura de detalhes</span></div><div className="fp-cart-list">{['FPM-2048', 'FPM-2039', 'FPM-2022'].map((order) => <article key={order} className="fp-cart-item"><div className="fp-cart-thumb small" /><div className="fp-cart-copy"><h4>{order}</h4><p>Prévia aprovada e detalhes reabertos disponíveis</p></div><button type="button" className="fp-btn fp-btn-secondary">Ver detalhes</button></article>)}</div></section></div></div>;
}

function ScreenContent({ activeScreen }: { activeScreen: ScreenId }) {
  if (activeScreen === 'home') return <HomeScreen />;
  if (activeScreen === 'catalogo') return <CatalogScreen />;
  if (activeScreen === 'produto') return <ProductScreen />;
  if (activeScreen === 'editar') return <EditScreen />;
  if (activeScreen === 'criar') return <CreateScreen />;
  if (activeScreen === 'carrinho') return <CartScreen />;
  if (activeScreen === 'checkout') return <CheckoutScreen />;
  if (activeScreen === 'aprovacao3d') return <Approval3DScreen />;
  if (activeScreen === 'pedido') return <OrderScreen />;
  return <DashboardScreen />;
}

export function Playground() {
  const [activeScreen, setActiveScreen] = React.useState<ScreenId>('home');
  const activeMeta = screens.find((screen) => screen.id === activeScreen)!;

  return (
    <div className="fp-app-shell">
      <header className="fp-topbar">
        <div className="fp-brand"><div className="fp-brand-mark">FP</div><div><strong>FazPraMim</strong><span>e-commerce + serviço assistido por IA</span></div></div>
        <nav className="fp-main-nav"><a href="#plano">Plano</a><a href="#prototipo">Protótipo</a><a href="#tokens">Direção visual</a></nav>
        <button type="button" className="fp-btn fp-btn-secondary">Ver como funciona</button>
      </header>
      <main className="fp-page">
        <section id="plano" className="fp-section">
          <SectionHeader title="Plano inicial dos componentes core" text="A proposta separa foundations, componentes base, patterns de e-commerce e patterns específicos do serviço para manter o design system escalável." />
          <div className="fp-grid-4">{coreGroups.map((group) => <article key={group.title} className="fp-blueprint-card"><h3>{group.title}</h3><ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul></article>)}</div>
          <div className="fp-grid-4 fp-phase-grid">{implementationPhases.map((phase) => <article key={phase.title} className="fp-phase-card"><span>{phase.title}</span><p>{phase.text}</p></article>)}</div>
        </section>
        <section id="tokens" className="fp-section">
          <SectionHeader title="Direção visual do FazPraMim" text="Visual clean com atmosfera premium acessível: base clara, contrastes quentes, áreas de preview valorizadas e texto curto para orientar cada etapa." />
          <div className="fp-token-board"><article className="fp-token-card"><span>Cor</span><p>Areia clara, petróleo, coral suave e verde névoa para equilibrar confiança e criatividade.</p></article><article className="fp-token-card"><span>Layout</span><p>Cards com borda macia, grid flexível e áreas amplas para preview, resumo e status.</p></article><article className="fp-token-card"><span>UX</span><p>Stepper, badges e timelines deixam explícito quando é compra direta, edição ou criação do zero.</p></article></div>
        </section>
        <section id="prototipo" className="fp-section">
          <SectionHeader title="Protótipo navegável" text={activeMeta.description} />
          <div className="fp-prototype-shell"><aside className="fp-prototype-sidebar"><span className="fp-eyebrow">{activeMeta.eyebrow}</span><h2>{activeMeta.title}</h2><p>{activeMeta.description}</p><div className="fp-note-box"><strong>Objetivo UX</strong><p>Deixar explícito o que acontece antes do pagamento, o que exige aprovação e como o usuário acompanha cada etapa.</p></div></aside><div className="fp-prototype-stage"><ScreenNav activeScreen={activeScreen} setActiveScreen={setActiveScreen} /><div className="fp-prototype-canvas"><ScreenContent activeScreen={activeScreen} /></div></div></div>
        </section>
      </main>
    </div>
  );
}
