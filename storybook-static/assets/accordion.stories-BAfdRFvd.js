import{r as c,u as j,j as e,R as E}from"./iframe-DkxCh0KI.js";import{u as $}from"./use-controllable-state-BCpRlVAk.js";import{u as R}from"./use-id-FMeoxewZ.js";import"./preload-helper-D9Z9MdNV.js";const k=c.createContext({openValues:[],toggle:()=>{},type:"single",registerTrigger:()=>{},unregisterTrigger:()=>{},focusNext:()=>{},focusPrev:()=>{}}),O=c.createContext({value:"",isOpen:!1,disabled:!1,contentId:"",triggerId:""}),D=()=>c.useContext(k),N=()=>c.useContext(O);function S({children:g,type:i="single",value:d,defaultValue:o,onValueChange:l,style:u,...m}){const p=j(),f=n=>n===void 0?[]:Array.isArray(n)?n:[n],[t,A]=$({value:d!==void 0?f(d):void 0,defaultValue:f(o),onChange:n=>{l&&l(i==="single"?n[0]??"":n)}}),a=c.useRef(new Map),T=c.useCallback(n=>{const s=t.includes(n);A(i==="single"?s?[]:[n]:s?t.filter(y=>y!==n):[...t,n])},[i,A,t]),I=c.useCallback((n,s)=>{a.current.set(n,s)},[]),h=c.useCallback(n=>{a.current.delete(n)},[]),C=()=>Array.from(a.current.keys()),x=c.useCallback(n=>{const s=C(),y=s.indexOf(n),w=s[(y+1)%s.length];a.current.get(w)?.current?.focus()},[]),V=c.useCallback(n=>{const s=C(),y=s.indexOf(n),w=s[(y-1+s.length)%s.length];a.current.get(w)?.current?.focus()},[]);return e.jsx(k.Provider,{value:{openValues:t,toggle:T,type:i,registerTrigger:I,unregisterTrigger:h,focusNext:x,focusPrev:V},children:e.jsx("div",{...m,style:{display:"flex",flexDirection:"column",borderRadius:p.radii.small,border:`1px solid ${p.colors.border.subtle}`,overflow:"hidden",...u},children:g})})}function q({children:g,value:i,disabled:d=!1,style:o,...l}){const{openValues:u}=D(),m=j(),p=R(`accordion-content-${i}`),f=R(`accordion-trigger-${i}`),t=u.includes(i);return e.jsx(O.Provider,{value:{value:i,isOpen:t,disabled:d,contentId:p,triggerId:f},children:e.jsx("div",{...l,style:{borderBottom:`1px solid ${m.colors.border.subtle}`,...o},children:g})})}function z({children:g,style:i,...d}){const o=j(),{toggle:l,registerTrigger:u,unregisterTrigger:m,focusNext:p,focusPrev:f}=D(),{value:t,isOpen:A,disabled:a,contentId:T,triggerId:I}=N(),h=c.useRef(null);E.useEffect(()=>(u(t,h),()=>m(t)),[t,u,m]);const C=x=>{x.key==="ArrowDown"&&(x.preventDefault(),p(t)),x.key==="ArrowUp"&&(x.preventDefault(),f(t))};return e.jsxs("button",{ref:h,id:I,type:"button","aria-expanded":A,"aria-controls":T,disabled:a,onClick:()=>l(t),onKeyDown:C,...d,style:{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",padding:`${o.space.small} ${o.space.medium}`,background:"none",border:"none",cursor:a?"not-allowed":"pointer",textAlign:"left",fontWeight:o.fontWeights.medium,fontSize:o.fontSizes.small,color:a?o.colors.text.disabled:o.colors.text.primary,...i},children:[e.jsx("span",{children:g}),e.jsx("span",{"aria-hidden":"true",style:{transition:"transform 0.2s ease",transform:A?"rotate(180deg)":"rotate(0deg)",display:"inline-flex"},children:"▾"})]})}function M({children:g,style:i,...d}){const o=j(),{isOpen:l,contentId:u,triggerId:m}=N();return l?e.jsx("div",{id:u,role:"region","aria-labelledby":m,...d,style:{padding:`0 ${o.space.medium} ${o.space.medium}`,fontSize:o.fontSizes.small,color:o.colors.text.secondary,...i},children:g}):null}const r=Object.assign(S,{Root:S,Item:q,Trigger:z,Content:M});S.__docgenInfo={description:"",methods:[],displayName:"AccordionRoot",props:{children:{required:!0,tsType:{name:"ReactNode"},description:""},type:{required:!1,tsType:{name:"union",raw:"'single' | 'multiple'",elements:[{name:"literal",value:"'single'"},{name:"literal",value:"'multiple'"}]},description:"Modo single: apenas um item aberto por vez",defaultValue:{value:"'single'",computed:!1}},value:{required:!1,tsType:{name:"union",raw:"string | string[]",elements:[{name:"string"},{name:"Array",elements:[{name:"string"}],raw:"string[]"}]},description:"Valor(es) controlado(s)"},defaultValue:{required:!1,tsType:{name:"union",raw:"string | string[]",elements:[{name:"string"},{name:"Array",elements:[{name:"string"}],raw:"string[]"}]},description:""},onValueChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(value: string | string[]) => void",signature:{arguments:[{type:{name:"union",raw:"string | string[]",elements:[{name:"string"},{name:"Array",elements:[{name:"string"}],raw:"string[]"}]},name:"value"}],return:{name:"void"}}},description:""}},composes:["HTMLAttributes"]};const W={title:"Navigation/Accordion",component:r,tags:["autodocs"],parameters:{layout:"padded"},argTypes:{type:{control:{type:"select"},options:["single","multiple"]}}},b={render:()=>e.jsxs(r,{type:"single",style:{width:400},children:[e.jsxs(r.Item,{value:"item-1",children:[e.jsx(r.Trigger,{children:"O que é o Arbor DS?"}),e.jsx(r.Content,{children:"Arbor DS é um design system cross-platform para React e React Native."})]}),e.jsxs(r.Item,{value:"item-2",children:[e.jsx(r.Trigger,{children:"Como instalar?"}),e.jsxs(r.Content,{children:["Execute ",e.jsx("code",{children:"pnpm add arbor-ds"})," no seu projeto."]})]}),e.jsxs(r.Item,{value:"item-3",children:[e.jsx(r.Trigger,{children:"Suporta React Native?"}),e.jsx(r.Content,{children:"Sim! Componentes marcados como cross-platform funcionam em web e mobile."})]})]})},v={render:()=>e.jsxs(r,{type:"multiple",defaultValue:["item-1"],style:{width:400},children:[e.jsxs(r.Item,{value:"item-1",children:[e.jsx(r.Trigger,{children:"Seção 1 (aberta por padrão)"}),e.jsx(r.Content,{children:"Conteúdo da primeira seção expandida por padrão."})]}),e.jsxs(r.Item,{value:"item-2",children:[e.jsx(r.Trigger,{children:"Seção 2"}),e.jsx(r.Content,{children:"Conteúdo da segunda seção."})]}),e.jsxs(r.Item,{value:"item-3",disabled:!0,children:[e.jsx(r.Trigger,{children:"Seção 3 (desabilitada)"}),e.jsx(r.Content,{children:"Este conteúdo não é acessível."})]})]})};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => <Accordion type="single" style={{
    width: 400
  }}>\r
      <Accordion.Item value="item-1">\r
        <Accordion.Trigger>O que é o Arbor DS?</Accordion.Trigger>\r
        <Accordion.Content>\r
          Arbor DS é um design system cross-platform para React e React Native.\r
        </Accordion.Content>\r
      </Accordion.Item>\r
      <Accordion.Item value="item-2">\r
        <Accordion.Trigger>Como instalar?</Accordion.Trigger>\r
        <Accordion.Content>\r
          Execute <code>pnpm add arbor-ds</code> no seu projeto.\r
        </Accordion.Content>\r
      </Accordion.Item>\r
      <Accordion.Item value="item-3">\r
        <Accordion.Trigger>Suporta React Native?</Accordion.Trigger>\r
        <Accordion.Content>\r
          Sim! Componentes marcados como cross-platform funcionam em web e mobile.\r
        </Accordion.Content>\r
      </Accordion.Item>\r
    </Accordion>
}`,...b.parameters?.docs?.source}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => <Accordion type="multiple" defaultValue={['item-1']} style={{
    width: 400
  }}>\r
      <Accordion.Item value="item-1">\r
        <Accordion.Trigger>Seção 1 (aberta por padrão)</Accordion.Trigger>\r
        <Accordion.Content>Conteúdo da primeira seção expandida por padrão.</Accordion.Content>\r
      </Accordion.Item>\r
      <Accordion.Item value="item-2">\r
        <Accordion.Trigger>Seção 2</Accordion.Trigger>\r
        <Accordion.Content>Conteúdo da segunda seção.</Accordion.Content>\r
      </Accordion.Item>\r
      <Accordion.Item value="item-3" disabled>\r
        <Accordion.Trigger>Seção 3 (desabilitada)</Accordion.Trigger>\r
        <Accordion.Content>Este conteúdo não é acessível.</Accordion.Content>\r
      </Accordion.Item>\r
    </Accordion>
}`,...v.parameters?.docs?.source}}};const B=["Single","Multiple"];export{v as Multiple,b as Single,B as __namedExportsOrder,W as default};
