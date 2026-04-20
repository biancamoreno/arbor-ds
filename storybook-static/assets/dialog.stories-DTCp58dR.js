import{r as c,R as y,j as e,u as p,D as k,F as _}from"./iframe-DkxCh0KI.js";import{u as q}from"./use-controllable-state-BCpRlVAk.js";import{u as x}from"./use-id-FMeoxewZ.js";import{P as D}from"./portal-mDamsA4s.js";import"./preload-helper-D9Z9MdNV.js";const h=c.createContext(null);function l(){const o=c.useContext(h);if(!o)throw new Error("Dialog compound components must be used within Dialog.Root");return o}function b({children:o,asChild:i=!1}){const{open:t}=l();if(i){const s=o,d=s.props.onClick;return y.cloneElement(s,{onClick:a=>{d?.(a),t()}})}return e.jsx("button",{type:"button",onClick:t,children:o})}b.__docgenInfo={description:"",methods:[],displayName:"DialogTrigger",props:{children:{required:!0,tsType:{name:"ReactElement"},description:""},asChild:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}}}};function C({style:o}){const{isOpen:i,close:t}=l(),s=p();return i?e.jsx(D,{children:e.jsx("div",{"aria-hidden":"true",onClick:t,style:{position:"fixed",inset:0,zIndex:s.zIndices.overlay,backgroundColor:s.colors.background.overlay,...o}})}):null}C.__docgenInfo={description:"",methods:[],displayName:"DialogOverlay",props:{style:{required:!1,tsType:{name:"ReactCSSProperties",raw:"React.CSSProperties"},description:""}}};const N={sm:"420px",md:"560px",lg:"720px"};function j({children:o,size:i="md"}){const{isOpen:t,close:s,titleId:d,descriptionId:a}=l(),n=p();return t?e.jsx(D,{children:e.jsx(k,{onDismiss:s,disableOutsideClick:!0,children:e.jsx(_,{trapped:!0,autoFocus:!0,restoreFocus:!0,children:e.jsx("div",{role:"dialog","aria-modal":"true","aria-labelledby":d,"aria-describedby":a,style:{position:"fixed",top:"50%",left:"50%",transform:"translate(-50%, -50%)",zIndex:n.zIndices.modal,width:"90%",maxWidth:N[i],display:"flex",flexDirection:"column",gap:n.space.small,padding:n.space.large,borderRadius:n.radii.large,backgroundColor:n.colors.surface.raised,boxShadow:"0 20px 48px rgba(0, 0, 0, 0.16)",outline:"none"},children:o})})})}):null}j.__docgenInfo={description:"",methods:[],displayName:"DialogContent",props:{children:{required:!0,tsType:{name:"ReactNode"},description:""},size:{required:!1,tsType:{name:"union",raw:"'sm' | 'md' | 'lg'",elements:[{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"}]},description:"",defaultValue:{value:"'md'",computed:!1}}}};function T({children:o}){const{titleId:i}=l(),t=p();return e.jsx("h2",{id:i,style:{margin:0,color:t.colors.text.primary,fontSize:t.fontSizes.medium,fontWeight:t.fontWeights.medium},children:o})}T.__docgenInfo={description:"",methods:[],displayName:"DialogTitle",props:{children:{required:!0,tsType:{name:"ReactNode"},description:""}}};function v({children:o}){const{descriptionId:i}=l(),t=p();return e.jsx("p",{id:i,style:{margin:0,color:t.colors.text.secondary,fontSize:t.fontSizes.small},children:o})}v.__docgenInfo={description:"",methods:[],displayName:"DialogDescription",props:{children:{required:!0,tsType:{name:"ReactNode"},description:""}}};function R({children:o,label:i="Fechar"}){const{close:t}=l(),s=p();return o?y.cloneElement(o,{onClick:t}):e.jsx("button",{type:"button","aria-label":i,onClick:t,style:{border:"none",background:"transparent",color:s.colors.text.secondary,cursor:"pointer",fontSize:s.fontSizes.medium,lineHeight:1,padding:0},children:"✕"})}R.__docgenInfo={description:"",methods:[],displayName:"DialogClose",props:{children:{required:!1,tsType:{name:"ReactNode"},description:""},label:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'Fechar'",computed:!1}}}};function f({isOpen:o,defaultOpen:i=!1,onClose:t,children:s}){const[d,a]=q({value:o,defaultValue:i,onChange:S=>{S||t?.()}}),n=x("dialog-title"),O=x("dialog-desc"),z=c.useCallback(()=>a(!0),[a]),I=c.useCallback(()=>a(!1),[a]);return e.jsx(h.Provider,{value:{isOpen:d,open:z,close:I,titleId:n,descriptionId:O},children:s})}const r=Object.assign(f,{Root:f,Trigger:b,Overlay:C,Content:j,Title:T,Description:v,Close:R});f.__docgenInfo={description:"",methods:[],displayName:"DialogRoot",props:{isOpen:{required:!1,tsType:{name:"boolean"},description:""},defaultOpen:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},onClose:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},children:{required:!0,tsType:{name:"ReactNode"},description:""}}};const W={title:"Overlay/Dialog",component:r,tags:["autodocs"],parameters:{layout:"centered"}},u={render:()=>e.jsxs(r.Root,{defaultOpen:!1,children:[e.jsx(r.Trigger,{children:e.jsx("button",{style:{padding:"8px 16px",borderRadius:4,cursor:"pointer"},children:"Abrir Dialog"})}),e.jsx(r.Overlay,{}),e.jsxs(r.Content,{size:"md",children:[e.jsx(r.Title,{children:"Confirmar ação"}),e.jsx(r.Description,{children:"Tem certeza que deseja continuar? Esta ação não pode ser desfeita."}),e.jsxs("div",{style:{display:"flex",gap:8,justifyContent:"flex-end",marginTop:16},children:[e.jsx(r.Close,{label:"Cancelar"}),e.jsx("button",{style:{padding:"8px 16px",background:"#4a90e2",color:"#fff",border:"none",borderRadius:4,cursor:"pointer"},children:"Confirmar"})]})]})]})};function F(){const[o,i]=c.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx("button",{onClick:()=>i(!0),style:{padding:"8px 16px",borderRadius:4,cursor:"pointer"},children:"Abrir controlado"}),e.jsxs(r.Root,{isOpen:o,onClose:()=>i(!1),children:[e.jsx(r.Overlay,{}),e.jsxs(r.Content,{children:[e.jsx(r.Title,{children:"Dialog controlado"}),e.jsx(r.Description,{children:"Controlado via estado externo."}),e.jsx(r.Close,{label:"Fechar"})]})]})]})}const g={render:()=>e.jsx(F,{})},m={render:()=>e.jsx("div",{style:{display:"flex",gap:8},children:["sm","md","lg"].map(o=>e.jsxs(r.Root,{defaultOpen:!1,children:[e.jsx(r.Trigger,{children:e.jsx("button",{style:{padding:"8px 12px",borderRadius:4,cursor:"pointer"},children:o.toUpperCase()})}),e.jsx(r.Overlay,{}),e.jsxs(r.Content,{size:o,children:[e.jsxs(r.Title,{children:["Dialog ",o]}),e.jsxs(r.Description,{children:["Tamanho ",o," do dialog."]}),e.jsx(r.Close,{label:"Fechar"})]})]},o))})};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <Dialog.Root defaultOpen={false}>\r
      <Dialog.Trigger>\r
        <button style={{
        padding: '8px 16px',
        borderRadius: 4,
        cursor: 'pointer'
      }}>\r
          Abrir Dialog\r
        </button>\r
      </Dialog.Trigger>\r
      <Dialog.Overlay />\r
      <Dialog.Content size="md">\r
        <Dialog.Title>Confirmar ação</Dialog.Title>\r
        <Dialog.Description>\r
          Tem certeza que deseja continuar? Esta ação não pode ser desfeita.\r
        </Dialog.Description>\r
        <div style={{
        display: 'flex',
        gap: 8,
        justifyContent: 'flex-end',
        marginTop: 16
      }}>\r
          <Dialog.Close label="Cancelar" />\r
          <button style={{
          padding: '8px 16px',
          background: '#4a90e2',
          color: '#fff',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer'
        }}>\r
            Confirmar\r
          </button>\r
        </div>\r
      </Dialog.Content>\r
    </Dialog.Root>
}`,...u.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <ControlledDialog />
}`,...g.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: 8
  }}>\r
      {(['sm', 'md', 'lg'] as const).map(size => <Dialog.Root key={size} defaultOpen={false}>\r
          <Dialog.Trigger>\r
            <button style={{
          padding: '8px 12px',
          borderRadius: 4,
          cursor: 'pointer'
        }}>\r
              {size.toUpperCase()}\r
            </button>\r
          </Dialog.Trigger>\r
          <Dialog.Overlay />\r
          <Dialog.Content size={size}>\r
            <Dialog.Title>Dialog {size}</Dialog.Title>\r
            <Dialog.Description>Tamanho {size} do dialog.</Dialog.Description>\r
            <Dialog.Close label="Fechar" />\r
          </Dialog.Content>\r
        </Dialog.Root>)}\r
    </div>
}`,...m.parameters?.docs?.source}}};const L=["Default","Controlled","Sizes"];export{g as Controlled,u as Default,m as Sizes,L as __namedExportsOrder,W as default};
