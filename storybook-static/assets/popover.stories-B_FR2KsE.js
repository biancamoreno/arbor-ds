import{r as c,R as x,j as e,u as h,D as j}from"./iframe-DkxCh0KI.js";import{u as R}from"./use-controllable-state-BCpRlVAk.js";import{u as I}from"./use-id-FMeoxewZ.js";import{P as T}from"./portal-mDamsA4s.js";import"./preload-helper-D9Z9MdNV.js";const b=c.createContext(null);function f(){const o=c.useContext(b);if(!o)throw new Error("Popover compound components must be used within Popover.Root");return o}function y({children:o,asChild:s=!1}){const{open:t,isOpen:n,titleId:r}=f(),a=o,u=a.props.onClick,l={"aria-haspopup":"dialog","aria-expanded":n,"aria-controls":r,onClick:m=>{u?.(m),t()}};return s?x.cloneElement(a,l):e.jsx("button",{type:"button",...l,children:o})}y.__docgenInfo={description:"",methods:[],displayName:"PopoverTrigger",props:{children:{required:!0,tsType:{name:"ReactElement"},description:""},asChild:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}}}};function v({children:o}){const{isOpen:s,close:t,titleId:n}=f(),r=h();return s?e.jsx(T,{children:e.jsx(j,{onDismiss:t,children:e.jsx("div",{role:"dialog","aria-labelledby":n,style:{position:"fixed",top:"50%",left:"50%",transform:"translate(-50%, -50%)",zIndex:r.zIndices.popover,minWidth:"200px",maxWidth:"360px",display:"flex",flexDirection:"column",gap:r.space.small,padding:r.space.medium,borderRadius:r.radii.medium,backgroundColor:r.colors.surface.raised,boxShadow:"0 8px 32px rgba(0, 0, 0, 0.12)",outline:"none"},children:o})})}):null}v.__docgenInfo={description:"",methods:[],displayName:"PopoverContent",props:{children:{required:!0,tsType:{name:"ReactNode"},description:""}}};function P({children:o,label:s="Fechar"}){const{close:t}=f(),n=h();return o?x.cloneElement(o,{onClick:t}):e.jsx("button",{type:"button","aria-label":s,onClick:t,style:{border:"none",background:"transparent",color:n.colors.text.secondary,cursor:"pointer",fontSize:n.fontSizes.medium,lineHeight:1,padding:0},children:"✕"})}P.__docgenInfo={description:"",methods:[],displayName:"PopoverClose",props:{children:{required:!1,tsType:{name:"ReactNode"},description:""},label:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'Fechar'",computed:!1}}}};function g({isOpen:o,defaultOpen:s=!1,onClose:t,children:n}){const[r,a]=R({value:o,defaultValue:s,onChange:C=>{C||t?.()}}),u=I("popover"),l=c.useCallback(()=>a(!0),[a]),m=c.useCallback(()=>a(!1),[a]);return e.jsx(b.Provider,{value:{isOpen:r,open:l,close:m,titleId:u},children:n})}const i=Object.assign(g,{Root:g,Trigger:y,Content:v,Close:P});g.__docgenInfo={description:"",methods:[],displayName:"PopoverRoot",props:{isOpen:{required:!1,tsType:{name:"boolean"},description:""},defaultOpen:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},onClose:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},children:{required:!0,tsType:{name:"ReactNode"},description:""}}};const _={title:"Overlay/Popover",component:i,tags:["autodocs"],parameters:{layout:"centered"}},p={render:()=>e.jsxs(i.Root,{children:[e.jsx(i.Trigger,{children:e.jsx("button",{style:{padding:"8px 16px",borderRadius:4,cursor:"pointer"},children:"Abrir Popover"})}),e.jsx(i.Content,{children:e.jsxs("div",{style:{padding:16,maxWidth:240},children:[e.jsx("p",{style:{margin:0,marginBottom:8,fontWeight:600},children:"Informações adicionais"}),e.jsx("p",{style:{margin:0,fontSize:14},children:"Conteúdo rico dentro do popover. Pode incluir formulários, listas ou qualquer elemento."}),e.jsx(i.Close,{label:"Fechar"})]})})]})},d={render:()=>e.jsxs(i.Root,{children:[e.jsx(i.Trigger,{children:e.jsx("button",{style:{padding:"8px 16px",borderRadius:4,cursor:"pointer"},children:"Filtros"})}),e.jsx(i.Content,{children:e.jsxs("div",{style:{padding:16,display:"flex",flexDirection:"column",gap:12,minWidth:200},children:[e.jsx("p",{style:{margin:0,fontWeight:600},children:"Filtrar por:"}),e.jsxs("label",{style:{display:"flex",gap:8,alignItems:"center"},children:[e.jsx("input",{type:"checkbox"})," Ativo"]}),e.jsxs("label",{style:{display:"flex",gap:8,alignItems:"center"},children:[e.jsx("input",{type:"checkbox"})," Inativo"]}),e.jsx("button",{style:{padding:"6px 12px",borderRadius:4,background:"#4a90e2",color:"#fff",border:"none",cursor:"pointer"},children:"Aplicar"})]})})]})};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <Popover.Root>\r
      <Popover.Trigger>\r
        <button style={{
        padding: '8px 16px',
        borderRadius: 4,
        cursor: 'pointer'
      }}>\r
          Abrir Popover\r
        </button>\r
      </Popover.Trigger>\r
      <Popover.Content>\r
        <div style={{
        padding: 16,
        maxWidth: 240
      }}>\r
          <p style={{
          margin: 0,
          marginBottom: 8,
          fontWeight: 600
        }}>Informações adicionais</p>\r
          <p style={{
          margin: 0,
          fontSize: 14
        }}>Conteúdo rico dentro do popover. Pode incluir formulários, listas ou qualquer elemento.</p>\r
          <Popover.Close label="Fechar" />\r
        </div>\r
      </Popover.Content>\r
    </Popover.Root>
}`,...p.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <Popover.Root>\r
      <Popover.Trigger>\r
        <button style={{
        padding: '8px 16px',
        borderRadius: 4,
        cursor: 'pointer'
      }}>\r
          Filtros\r
        </button>\r
      </Popover.Trigger>\r
      <Popover.Content>\r
        <div style={{
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        minWidth: 200
      }}>\r
          <p style={{
          margin: 0,
          fontWeight: 600
        }}>Filtrar por:</p>\r
          <label style={{
          display: 'flex',
          gap: 8,
          alignItems: 'center'
        }}>\r
            <input type="checkbox" /> Ativo\r
          </label>\r
          <label style={{
          display: 'flex',
          gap: 8,
          alignItems: 'center'
        }}>\r
            <input type="checkbox" /> Inativo\r
          </label>\r
          <button style={{
          padding: '6px 12px',
          borderRadius: 4,
          background: '#4a90e2',
          color: '#fff',
          border: 'none',
          cursor: 'pointer'
        }}>\r
            Aplicar\r
          </button>\r
        </div>\r
      </Popover.Content>\r
    </Popover.Root>
}`,...d.parameters?.docs?.source}}};const D=["Default","WithForm"];export{p as Default,d as WithForm,D as __namedExportsOrder,_ as default};
