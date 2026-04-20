import{r as p,j as e,u as A,R as C}from"./iframe-DkxCh0KI.js";import{u as z}from"./use-controllable-state-BCpRlVAk.js";import"./preload-helper-D9Z9MdNV.js";const L=p.createContext({activeValue:"",setActive:()=>{},registerTrigger:()=>{},unregisterTrigger:()=>{},focusNext:()=>{},focusPrev:()=>{},orientation:"horizontal"}),D=()=>p.useContext(L);function V({children:l,value:r,defaultValue:d="",onValueChange:n,orientation:o="horizontal",style:c,...a}){const[u,j]=z({value:r,defaultValue:d,onChange:n}),b=p.useRef(new Map),v=p.useCallback((i,s)=>{b.current.set(i,s)},[]),w=p.useCallback(i=>{b.current.delete(i)},[]),x=()=>Array.from(b.current.keys()),h=p.useCallback(i=>{const s=x(),g=s.indexOf(i);b.current.get(s[(g+1)%s.length])?.current?.focus()},[]),T=p.useCallback(i=>{const s=x(),g=s.indexOf(i);b.current.get(s[(g-1+s.length)%s.length])?.current?.focus()},[]);return e.jsx(L.Provider,{value:{activeValue:u,setActive:j,registerTrigger:v,unregisterTrigger:w,focusNext:h,focusPrev:T,orientation:o},children:e.jsx("div",{...a,style:{display:"flex",flexDirection:o==="vertical"?"row":"column",...c},children:l})})}function I({children:l,variant:r="underline",fullWidth:d=!1,style:n,...o}){const c=A(),{orientation:a}=D();return e.jsx("div",{role:"tablist","aria-orientation":a,...o,style:{display:"flex",flexDirection:a==="vertical"?"column":"row",gap:"2px",borderBottom:r==="underline"&&a==="horizontal"?`1px solid ${c.colors.border.subtle}`:"none",borderRight:r==="underline"&&a==="vertical"?`1px solid ${c.colors.border.subtle}`:"none",flexWrap:a==="horizontal"?"wrap":void 0,flexShrink:0,...n},children:d?C.Children.map(l,u=>C.isValidElement(u)?C.cloneElement(u,{style:{flex:1,...u.props.style}}):u):l})}function S({children:l,value:r,size:d="md",disabled:n,style:o,...c}){const a=A(),{activeValue:u,setActive:j,registerTrigger:b,unregisterTrigger:v,focusNext:w,focusPrev:x,orientation:h}=D(),T=u===r,i=p.useRef(null);C.useEffect(()=>(b(r,i),()=>v(r)),[r,b,v]);const s=g=>{const R=h==="vertical"?"ArrowDown":"ArrowRight",k=h==="vertical"?"ArrowUp":"ArrowLeft";g.key===R&&(g.preventDefault(),w(r)),g.key===k&&(g.preventDefault(),x(r))};return e.jsx("button",{ref:i,type:"button",role:"tab",id:`tab-trigger-${r}`,"aria-selected":T,"aria-controls":`tab-panel-${r}`,tabIndex:T?0:-1,disabled:n,onClick:()=>{n||j(r)},onKeyDown:s,...c,style:{display:"inline-flex",alignItems:"center",justifyContent:"center",gap:"6px",padding:d==="sm"?"8px 12px":"10px 16px",border:"none",borderBottom:`2px solid ${T?a.colors.brand.base:"transparent"}`,borderRadius:0,backgroundColor:"transparent",color:T?a.colors.text.primary:a.colors.text.secondary,fontSize:d==="sm"?a.fontSizes.xsmall:a.fontSizes.small,fontWeight:T?a.fontWeights.medium:a.fontWeights.regular,cursor:n?"not-allowed":"pointer",opacity:n?.5:1,whiteSpace:"nowrap",...o},children:l})}function W({children:l,value:r,style:d,...n}){const o=A(),{activeValue:c}=D();return c!==r?null:e.jsx("div",{role:"tabpanel",id:`tab-panel-${r}`,"aria-labelledby":`tab-trigger-${r}`,tabIndex:0,...n,style:{color:o.colors.text.primary,padding:`${o.space.medium} 0`,outline:"none",...d},children:l})}const t=Object.assign(V,{Root:V,List:I,Trigger:S,Content:W});V.__docgenInfo={description:"",methods:[],displayName:"TabsRoot",props:{children:{required:!0,tsType:{name:"ReactNode"},description:""},value:{required:!1,tsType:{name:"string"},description:""},defaultValue:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"''",computed:!1}},onValueChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(value: string) => void",signature:{arguments:[{type:{name:"string"},name:"value"}],return:{name:"void"}}},description:""},orientation:{required:!1,tsType:{name:"union",raw:"'horizontal' | 'vertical'",elements:[{name:"literal",value:"'horizontal'"},{name:"literal",value:"'vertical'"}]},description:"",defaultValue:{value:"'horizontal'",computed:!1}}},composes:["HTMLAttributes"]};const P={title:"Navigation/Tabs",component:t,tags:["autodocs"],parameters:{layout:"padded"},argTypes:{orientation:{control:{type:"select"},options:["horizontal","vertical"]}}},f={render:()=>e.jsxs(t,{defaultValue:"tab1",style:{width:480},children:[e.jsxs(t.List,{children:[e.jsx(t.Trigger,{value:"tab1",children:"Visão Geral"}),e.jsx(t.Trigger,{value:"tab2",children:"Detalhes"}),e.jsx(t.Trigger,{value:"tab3",children:"Configurações"})]}),e.jsx(t.Content,{value:"tab1",children:e.jsx("div",{style:{padding:"16px 0"},children:"Conteúdo da aba Visão Geral."})}),e.jsx(t.Content,{value:"tab2",children:e.jsx("div",{style:{padding:"16px 0"},children:"Conteúdo da aba Detalhes."})}),e.jsx(t.Content,{value:"tab3",children:e.jsx("div",{style:{padding:"16px 0"},children:"Conteúdo da aba Configurações."})})]})},m={render:()=>e.jsxs(t,{defaultValue:"tab1",style:{width:480},children:[e.jsxs(t.List,{variant:"pill",children:[e.jsx(t.Trigger,{value:"tab1",children:"Todos"}),e.jsx(t.Trigger,{value:"tab2",children:"Ativos"}),e.jsx(t.Trigger,{value:"tab3",children:"Inativos"})]}),e.jsx(t.Content,{value:"tab1",children:e.jsx("div",{style:{padding:"16px 0"},children:"Todos os itens."})}),e.jsx(t.Content,{value:"tab2",children:e.jsx("div",{style:{padding:"16px 0"},children:"Itens ativos."})}),e.jsx(t.Content,{value:"tab3",children:e.jsx("div",{style:{padding:"16px 0"},children:"Itens inativos."})})]})},y={render:()=>e.jsxs(t,{defaultValue:"tab1",style:{width:480},children:[e.jsxs(t.List,{fullWidth:!0,children:[e.jsx(t.Trigger,{value:"tab1",children:"Tab 1"}),e.jsx(t.Trigger,{value:"tab2",children:"Tab 2"}),e.jsx(t.Trigger,{value:"tab3",children:"Tab 3"})]}),e.jsx(t.Content,{value:"tab1",children:e.jsx("div",{style:{padding:"16px 0"},children:"Conteúdo 1"})}),e.jsx(t.Content,{value:"tab2",children:e.jsx("div",{style:{padding:"16px 0"},children:"Conteúdo 2"})}),e.jsx(t.Content,{value:"tab3",children:e.jsx("div",{style:{padding:"16px 0"},children:"Conteúdo 3"})})]})};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <Tabs defaultValue="tab1" style={{
    width: 480
  }}>\r
      <Tabs.List>\r
        <Tabs.Trigger value="tab1">Visão Geral</Tabs.Trigger>\r
        <Tabs.Trigger value="tab2">Detalhes</Tabs.Trigger>\r
        <Tabs.Trigger value="tab3">Configurações</Tabs.Trigger>\r
      </Tabs.List>\r
      <Tabs.Content value="tab1">\r
        <div style={{
        padding: '16px 0'
      }}>Conteúdo da aba Visão Geral.</div>\r
      </Tabs.Content>\r
      <Tabs.Content value="tab2">\r
        <div style={{
        padding: '16px 0'
      }}>Conteúdo da aba Detalhes.</div>\r
      </Tabs.Content>\r
      <Tabs.Content value="tab3">\r
        <div style={{
        padding: '16px 0'
      }}>Conteúdo da aba Configurações.</div>\r
      </Tabs.Content>\r
    </Tabs>
}`,...f.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <Tabs defaultValue="tab1" style={{
    width: 480
  }}>\r
      <Tabs.List variant="pill">\r
        <Tabs.Trigger value="tab1">Todos</Tabs.Trigger>\r
        <Tabs.Trigger value="tab2">Ativos</Tabs.Trigger>\r
        <Tabs.Trigger value="tab3">Inativos</Tabs.Trigger>\r
      </Tabs.List>\r
      <Tabs.Content value="tab1">\r
        <div style={{
        padding: '16px 0'
      }}>Todos os itens.</div>\r
      </Tabs.Content>\r
      <Tabs.Content value="tab2">\r
        <div style={{
        padding: '16px 0'
      }}>Itens ativos.</div>\r
      </Tabs.Content>\r
      <Tabs.Content value="tab3">\r
        <div style={{
        padding: '16px 0'
      }}>Itens inativos.</div>\r
      </Tabs.Content>\r
    </Tabs>
}`,...m.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => <Tabs defaultValue="tab1" style={{
    width: 480
  }}>\r
      <Tabs.List fullWidth>\r
        <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>\r
        <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>\r
        <Tabs.Trigger value="tab3">Tab 3</Tabs.Trigger>\r
      </Tabs.List>\r
      <Tabs.Content value="tab1"><div style={{
        padding: '16px 0'
      }}>Conteúdo 1</div></Tabs.Content>\r
      <Tabs.Content value="tab2"><div style={{
        padding: '16px 0'
      }}>Conteúdo 2</div></Tabs.Content>\r
      <Tabs.Content value="tab3"><div style={{
        padding: '16px 0'
      }}>Conteúdo 3</div></Tabs.Content>\r
    </Tabs>
}`,...y.parameters?.docs?.source}}};const q=["Default","PillVariant","FullWidth"];export{f as Default,y as FullWidth,m as PillVariant,q as __namedExportsOrder,P as default};
