import{r as m,R as b,j as e,u as x,D as q,F as k}from"./iframe-DkxCh0KI.js";import{u as _}from"./use-controllable-state-BCpRlVAk.js";import{u as N}from"./use-id-FMeoxewZ.js";import{P as y}from"./portal-mDamsA4s.js";import"./preload-helper-D9Z9MdNV.js";const w=m.createContext(null);function d(){const r=m.useContext(w);if(!r)throw new Error("Drawer compound components must be used within Drawer.Root");return r}function D({children:r,asChild:a=!1}){const{open:t}=d();if(a){const n=r,s=n.props.onClick;return b.cloneElement(n,{onClick:l=>{s?.(l),t()}})}return e.jsx("button",{type:"button",onClick:t,children:r})}D.__docgenInfo={description:"",methods:[],displayName:"DrawerTrigger",props:{children:{required:!0,tsType:{name:"ReactElement"},description:""},asChild:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}}}};function j({style:r}){const{isOpen:a,close:t}=d(),n=x();return a?e.jsx(y,{children:e.jsx("div",{"aria-hidden":"true",onClick:t,style:{position:"fixed",inset:0,zIndex:n.zIndices.overlay,backgroundColor:n.colors.background.overlay,...r}})}):null}j.__docgenInfo={description:"",methods:[],displayName:"DrawerOverlay",props:{style:{required:!1,tsType:{name:"ReactCSSProperties",raw:"React.CSSProperties"},description:""}}};const h={sm:"320px",md:"420px",lg:"560px"},g={sm:"240px",md:"320px",lg:"420px"};function E(r,a){const t={position:"fixed",display:"flex",flexDirection:"column",outline:"none"};return r==="bottom"?{...t,bottom:0,left:0,right:0,width:"100%",height:g[a],borderRadius:"24px 24px 0 0"}:r==="top"?{...t,top:0,left:0,right:0,width:"100%",height:g[a],borderRadius:"0 0 24px 24px"}:r==="left"?{...t,left:0,top:0,bottom:0,width:h[a],height:"100%",borderRadius:"0 24px 24px 0"}:{...t,right:0,top:0,bottom:0,width:h[a],height:"100%",borderRadius:"24px 0 0 24px"}}function T({children:r,size:a="md"}){const{isOpen:t,close:n,placement:s,titleId:l}=d(),i=x();return t?e.jsx(y,{children:e.jsx(q,{onDismiss:n,disableOutsideClick:!0,children:e.jsx(k,{trapped:!0,autoFocus:!0,restoreFocus:!0,children:e.jsx("aside",{role:"dialog","aria-modal":"true","aria-labelledby":l,style:{...E(s,a),zIndex:i.zIndices.modal,gap:i.space.small,padding:i.space.large,backgroundColor:i.colors.surface.raised,boxShadow:"0 20px 48px rgba(0, 0, 0, 0.16)"},children:r})})})}):null}T.__docgenInfo={description:"",methods:[],displayName:"DrawerContent",props:{children:{required:!0,tsType:{name:"ReactNode"},description:""},size:{required:!1,tsType:{name:"union",raw:"'sm' | 'md' | 'lg'",elements:[{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"}]},description:"",defaultValue:{value:"'md'",computed:!1}}}};function C({children:r}){const{titleId:a}=d(),t=x();return e.jsx("h2",{id:a,style:{margin:0,color:t.colors.text.primary,fontSize:t.fontSizes.medium,fontWeight:t.fontWeights.medium},children:r})}C.__docgenInfo={description:"",methods:[],displayName:"DrawerTitle",props:{children:{required:!0,tsType:{name:"ReactNode"},description:""}}};function v({children:r,label:a="Fechar"}){const{close:t}=d(),n=x();return r?b.cloneElement(r,{onClick:t}):e.jsx("button",{type:"button","aria-label":a,onClick:t,style:{border:"none",background:"transparent",color:n.colors.text.secondary,cursor:"pointer",fontSize:n.fontSizes.medium,lineHeight:1,padding:0},children:"✕"})}v.__docgenInfo={description:"",methods:[],displayName:"DrawerClose",props:{children:{required:!1,tsType:{name:"ReactNode"},description:""},label:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'Fechar'",computed:!1}}}};function f({isOpen:r,defaultOpen:a=!1,onClose:t,placement:n="right",children:s}){const[l,i]=_({value:r,defaultValue:a,onChange:I=>{I||t?.()}}),R=N("drawer-title"),O=m.useCallback(()=>i(!0),[i]),S=m.useCallback(()=>i(!1),[i]);return e.jsx(w.Provider,{value:{isOpen:l,open:O,close:S,placement:n,titleId:R},children:s})}const o=Object.assign(f,{Root:f,Trigger:D,Overlay:j,Content:T,Title:C,Close:v});f.__docgenInfo={description:"",methods:[],displayName:"DrawerRoot",props:{isOpen:{required:!1,tsType:{name:"boolean"},description:""},defaultOpen:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},onClose:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},placement:{required:!1,tsType:{name:"union",raw:"'left' | 'right' | 'bottom' | 'top'",elements:[{name:"literal",value:"'left'"},{name:"literal",value:"'right'"},{name:"literal",value:"'bottom'"},{name:"literal",value:"'top'"}]},description:"",defaultValue:{value:"'right'",computed:!1}},children:{required:!0,tsType:{name:"ReactNode"},description:""}}};const V={title:"Overlay/Drawer",component:o,tags:["autodocs"],parameters:{layout:"centered"}},p={render:()=>e.jsxs(o.Root,{defaultOpen:!1,children:[e.jsx(o.Trigger,{children:e.jsx("button",{style:{padding:"8px 16px",borderRadius:4,cursor:"pointer"},children:"Abrir Drawer (direita)"})}),e.jsx(o.Overlay,{}),e.jsxs(o.Content,{size:"md",children:[e.jsx(o.Title,{children:"Painel Lateral"}),e.jsxs("div",{style:{marginTop:16},children:[e.jsx("p",{children:"Conteúdo do drawer lateral."}),e.jsx("p",{children:"Navegue usando Tab para acessar todos os elementos."})]}),e.jsx(o.Close,{label:"Fechar"})]})]})},c={render:()=>e.jsxs(o.Root,{defaultOpen:!1,placement:"left",children:[e.jsx(o.Trigger,{children:e.jsx("button",{style:{padding:"8px 16px",borderRadius:4,cursor:"pointer"},children:"Abrir Drawer (esquerda)"})}),e.jsx(o.Overlay,{}),e.jsxs(o.Content,{children:[e.jsx(o.Title,{children:"Menu lateral"}),e.jsx("nav",{style:{marginTop:16},children:e.jsxs("ul",{style:{listStyle:"none",padding:0,display:"flex",flexDirection:"column",gap:8},children:[e.jsx("li",{children:e.jsx("a",{href:"#",children:"Início"})}),e.jsx("li",{children:e.jsx("a",{href:"#",children:"Produtos"})}),e.jsx("li",{children:e.jsx("a",{href:"#",children:"Sobre"})}),e.jsx("li",{children:e.jsx("a",{href:"#",children:"Contato"})})]})})]})]})},u={render:()=>e.jsxs(o.Root,{defaultOpen:!1,placement:"bottom",children:[e.jsx(o.Trigger,{children:e.jsx("button",{style:{padding:"8px 16px",borderRadius:4,cursor:"pointer"},children:"Abrir Drawer (bottom)"})}),e.jsx(o.Overlay,{}),e.jsxs(o.Content,{children:[e.jsx(o.Title,{children:"Ações"}),e.jsxs("div",{style:{marginTop:16,display:"flex",flexDirection:"column",gap:8},children:[e.jsx("button",{style:{padding:"12px",borderRadius:4,border:"1px solid #eee",cursor:"pointer"},children:"Compartilhar"}),e.jsx("button",{style:{padding:"12px",borderRadius:4,border:"1px solid #eee",cursor:"pointer"},children:"Editar"}),e.jsx("button",{style:{padding:"12px",borderRadius:4,border:"1px solid #f00",color:"#f00",cursor:"pointer"},children:"Excluir"})]})]})]})};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <Drawer.Root defaultOpen={false}>\r
      <Drawer.Trigger>\r
        <button style={{
        padding: '8px 16px',
        borderRadius: 4,
        cursor: 'pointer'
      }}>\r
          Abrir Drawer (direita)\r
        </button>\r
      </Drawer.Trigger>\r
      <Drawer.Overlay />\r
      <Drawer.Content size="md">\r
        <Drawer.Title>Painel Lateral</Drawer.Title>\r
        <div style={{
        marginTop: 16
      }}>\r
          <p>Conteúdo do drawer lateral.</p>\r
          <p>Navegue usando Tab para acessar todos os elementos.</p>\r
        </div>\r
        <Drawer.Close label="Fechar" />\r
      </Drawer.Content>\r
    </Drawer.Root>
}`,...p.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <Drawer.Root defaultOpen={false} placement="left">\r
      <Drawer.Trigger>\r
        <button style={{
        padding: '8px 16px',
        borderRadius: 4,
        cursor: 'pointer'
      }}>\r
          Abrir Drawer (esquerda)\r
        </button>\r
      </Drawer.Trigger>\r
      <Drawer.Overlay />\r
      <Drawer.Content>\r
        <Drawer.Title>Menu lateral</Drawer.Title>\r
        <nav style={{
        marginTop: 16
      }}>\r
          <ul style={{
          listStyle: 'none',
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 8
        }}>\r
            <li><a href="#">Início</a></li>\r
            <li><a href="#">Produtos</a></li>\r
            <li><a href="#">Sobre</a></li>\r
            <li><a href="#">Contato</a></li>\r
          </ul>\r
        </nav>\r
      </Drawer.Content>\r
    </Drawer.Root>
}`,...c.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <Drawer.Root defaultOpen={false} placement="bottom">\r
      <Drawer.Trigger>\r
        <button style={{
        padding: '8px 16px',
        borderRadius: 4,
        cursor: 'pointer'
      }}>\r
          Abrir Drawer (bottom)\r
        </button>\r
      </Drawer.Trigger>\r
      <Drawer.Overlay />\r
      <Drawer.Content>\r
        <Drawer.Title>Ações</Drawer.Title>\r
        <div style={{
        marginTop: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }}>\r
          <button style={{
          padding: '12px',
          borderRadius: 4,
          border: '1px solid #eee',
          cursor: 'pointer'
        }}>Compartilhar</button>\r
          <button style={{
          padding: '12px',
          borderRadius: 4,
          border: '1px solid #eee',
          cursor: 'pointer'
        }}>Editar</button>\r
          <button style={{
          padding: '12px',
          borderRadius: 4,
          border: '1px solid #f00',
          color: '#f00',
          cursor: 'pointer'
        }}>Excluir</button>\r
        </div>\r
      </Drawer.Content>\r
    </Drawer.Root>
}`,...u.parameters?.docs?.source}}};const M=["Right","Left","Bottom"];export{u as Bottom,c as Left,p as Right,M as __namedExportsOrder,V as default};
