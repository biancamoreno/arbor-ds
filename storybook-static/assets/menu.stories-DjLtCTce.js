import{r as l,R as k,j as e,u as M,D as E}from"./iframe-DkxCh0KI.js";import{u as O}from"./use-controllable-state-BCpRlVAk.js";import{P as q}from"./portal-mDamsA4s.js";import"./preload-helper-D9Z9MdNV.js";const C=l.createContext(null);function S(){const t=l.useContext(C);if(!t)throw new Error("Menu compound components must be used within Menu.Root");return t}function j({children:t,asChild:o=!1}){const{open:s,isOpen:d}=S(),p=t,a=p.props.onClick,i={"aria-haspopup":"menu","aria-expanded":d,onClick:r=>{a?.(r),s()}};return o?k.cloneElement(p,i):e.jsx("button",{type:"button",...i,children:t})}j.__docgenInfo={description:"",methods:[],displayName:"MenuTrigger",props:{children:{required:!0,tsType:{name:"ReactElement"},description:""},asChild:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}}}};function R({children:t,label:o}){const{isOpen:s,close:d,setActiveIndex:p,activeIndex:a,itemCount:i}=S(),r=M(),c=u=>{u.key==="ArrowDown"?(u.preventDefault(),p((a+1)%i)):u.key==="ArrowUp"?(u.preventDefault(),p((a-1+i)%i)):u.key==="Tab"&&d()};return s?e.jsx(q,{children:e.jsx(E,{onDismiss:d,children:e.jsx("ul",{role:"menu","aria-label":o,onKeyDown:c,style:{position:"fixed",top:"50%",left:"50%",transform:"translate(-50%, -50%)",zIndex:r.zIndices.popover,minWidth:"180px",margin:0,padding:`${r.space.tiny} 0`,listStyle:"none",borderRadius:r.radii.medium,backgroundColor:r.colors.surface.raised,boxShadow:"0 8px 32px rgba(0, 0, 0, 0.12)",outline:"none"},children:t})})}):null}R.__docgenInfo={description:"",methods:[],displayName:"MenuContent",props:{children:{required:!0,tsType:{name:"ReactNode"},description:""},label:{required:!1,tsType:{name:"string"},description:""}}};function T({children:t,onSelect:o,disabled:s=!1}){const{close:d,activeIndex:p,setActiveIndex:a,registerItem:i}=S(),r=M(),c=l.useRef(-1),u=l.useRef(null);l.useEffect(()=>{c.current=i()},[i]);const f=p===c.current;l.useEffect(()=>{f&&u.current&&u.current.focus()},[f]);const y=()=>{s||(o?.(),d())},x=b=>{(b.key==="Enter"||b.key===" ")&&!s&&(b.preventDefault(),o?.(),d())},D=()=>{c.current!==-1&&a(c.current)};return e.jsx("li",{ref:u,role:"menuitem","aria-disabled":s||void 0,tabIndex:f?0:-1,onClick:y,onKeyDown:x,onFocus:D,style:{display:"flex",alignItems:"center",padding:`${r.space.tiny} ${r.space.small}`,fontSize:r.fontSizes.small,color:s?r.colors.text.disabled:r.colors.text.primary,cursor:s?"not-allowed":"pointer",outline:"none"},children:t})}T.__docgenInfo={description:"",methods:[],displayName:"MenuItem",props:{children:{required:!0,tsType:{name:"ReactNode"},description:""},onSelect:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},disabled:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}}}};function v(){const t=M();return e.jsx("li",{role:"separator",style:{height:"1px",margin:`${t.space.tiny} 0`,backgroundColor:t.colors.border.default}})}v.__docgenInfo={description:"",methods:[],displayName:"MenuSeparator"};function _({children:t}){const o=M();return e.jsx("li",{role:"presentation",style:{padding:`${o.space.tiny} ${o.space.small}`,fontSize:o.fontSizes.xsmall,fontWeight:o.fontWeights.medium,color:o.colors.text.secondary,textTransform:"uppercase",letterSpacing:"0.05em"},children:t})}_.__docgenInfo={description:"",methods:[],displayName:"MenuLabel",props:{children:{required:!0,tsType:{name:"ReactNode"},description:""}}};function I({isOpen:t,defaultOpen:o=!1,onClose:s,children:d}){const[p,a]=O({value:t,defaultValue:o,onChange:x=>{x||s?.()}}),[i,r]=l.useState(-1),c=l.useRef(0),u=l.useCallback(()=>{a(!0),r(0)},[a]),f=l.useCallback(()=>{a(!1),r(-1)},[a]),y=l.useCallback(()=>{const x=c.current;return c.current+=1,x},[]);return e.jsx(C.Provider,{value:{isOpen:p,open:u,close:f,activeIndex:i,setActiveIndex:r,itemCount:c.current,registerItem:y},children:d})}const n=Object.assign(I,{Root:I,Trigger:j,Content:R,Item:T,Separator:v,Label:_});I.__docgenInfo={description:"",methods:[],displayName:"MenuRoot",props:{isOpen:{required:!1,tsType:{name:"boolean"},description:""},defaultOpen:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},onClose:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},children:{required:!0,tsType:{name:"ReactNode"},description:""}}};const{fn:m}=__STORYBOOK_MODULE_TEST__,z={title:"Overlay/Menu",component:n,tags:["autodocs"],parameters:{layout:"centered"}},g={render:()=>e.jsxs(n.Root,{children:[e.jsx(n.Trigger,{children:e.jsx("button",{style:{padding:"8px 16px",borderRadius:4,cursor:"pointer"},children:"Ações ▾"})}),e.jsxs(n.Content,{label:"Menu de ações",children:[e.jsx(n.Item,{onSelect:m(),children:"Editar"}),e.jsx(n.Item,{onSelect:m(),children:"Duplicar"}),e.jsx(n.Separator,{}),e.jsx(n.Item,{onSelect:m(),children:"Arquivar"}),e.jsx(n.Item,{onSelect:m(),disabled:!0,children:"Excluir (sem permissão)"})]})]})},h={render:()=>e.jsxs(n.Root,{children:[e.jsx(n.Trigger,{children:e.jsx("button",{style:{padding:"8px 16px",borderRadius:4,cursor:"pointer"},children:"Conta ▾"})}),e.jsxs(n.Content,{children:[e.jsx(n.Label,{children:"Configurações"}),e.jsx(n.Item,{onSelect:m(),children:"Perfil"}),e.jsx(n.Item,{onSelect:m(),children:"Segurança"}),e.jsx(n.Separator,{}),e.jsx(n.Label,{children:"Sessão"}),e.jsx(n.Item,{onSelect:m(),children:"Sair"})]})]})};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <Menu.Root>\r
      <Menu.Trigger>\r
        <button style={{
        padding: '8px 16px',
        borderRadius: 4,
        cursor: 'pointer'
      }}>\r
          Ações ▾\r
        </button>\r
      </Menu.Trigger>\r
      <Menu.Content label="Menu de ações">\r
        <Menu.Item onSelect={fn()}>Editar</Menu.Item>\r
        <Menu.Item onSelect={fn()}>Duplicar</Menu.Item>\r
        <Menu.Separator />\r
        <Menu.Item onSelect={fn()}>Arquivar</Menu.Item>\r
        <Menu.Item onSelect={fn()} disabled>Excluir (sem permissão)</Menu.Item>\r
      </Menu.Content>\r
    </Menu.Root>
}`,...g.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <Menu.Root>\r
      <Menu.Trigger>\r
        <button style={{
        padding: '8px 16px',
        borderRadius: 4,
        cursor: 'pointer'
      }}>\r
          Conta ▾\r
        </button>\r
      </Menu.Trigger>\r
      <Menu.Content>\r
        <Menu.Label>Configurações</Menu.Label>\r
        <Menu.Item onSelect={fn()}>Perfil</Menu.Item>\r
        <Menu.Item onSelect={fn()}>Segurança</Menu.Item>\r
        <Menu.Separator />\r
        <Menu.Label>Sessão</Menu.Label>\r
        <Menu.Item onSelect={fn()}>Sair</Menu.Item>\r
      </Menu.Content>\r
    </Menu.Root>
}`,...h.parameters?.docs?.source}}};const P=["Default","WithLabels"];export{g as Default,h as WithLabels,P as __namedExportsOrder,z as default};
