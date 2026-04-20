import{r as m,R,j as e,u as C}from"./iframe-DkxCh0KI.js";import{u as v}from"./use-controllable-state-BCpRlVAk.js";import{u as j}from"./use-id-FMeoxewZ.js";import"./preload-helper-D9Z9MdNV.js";const x=m.createContext(null);function g(){const t=m.useContext(x);if(!t)throw new Error("Tooltip compound components must be used within Tooltip.Root");return t}function T({children:t,asChild:p=!0}){const{open:i,close:l,tooltipId:a}=g(),o=t,s={"aria-describedby":a,onMouseEnter:r=>{o.props.onMouseEnter?.(r),i()},onMouseLeave:r=>{o.props.onMouseLeave?.(r),l()},onFocus:r=>{o.props.onFocus?.(r),i()},onBlur:r=>{o.props.onBlur?.(r),l()}};return p?R.cloneElement(o,s):e.jsx("span",{style:{display:"inline-flex"},...s,children:t})}T.__docgenInfo={description:"",methods:[],displayName:"TooltipTrigger",props:{children:{required:!0,tsType:{name:"ReactReactElement",raw:"React.ReactElement"},description:""},asChild:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"true",computed:!1}}}};function w(t){switch(t){case"right":return{top:"50%",left:"calc(100% + 8px)",transform:"translateY(-50%)"};case"bottom":return{top:"calc(100% + 8px)",left:"50%",transform:"translateX(-50%)"};case"left":return{top:"50%",right:"calc(100% + 8px)",transform:"translateY(-50%)"};case"top":default:return{bottom:"calc(100% + 8px)",left:"50%",transform:"translateX(-50%)"}}}function h({children:t,placement:p="top",maxWidth:i=240}){const{isOpen:l,tooltipId:a}=g(),o=C();return l?e.jsx("span",{id:a,role:"tooltip",style:{position:"absolute",zIndex:o.zIndices.tooltip,maxWidth:i,padding:"8px 12px",borderRadius:o.radii.small,backgroundColor:o.colors.text.primary,color:o.colors.text.inverse,fontSize:o.fontSizes.xsmall,lineHeight:1.4,boxShadow:"0 12px 32px rgba(0, 0, 0, 0.14)",whiteSpace:"nowrap",pointerEvents:"none",...w(p)},children:t}):null}h.__docgenInfo={description:"",methods:[],displayName:"TooltipContent",props:{children:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},placement:{required:!1,tsType:{name:"union",raw:"'top' | 'right' | 'bottom' | 'left'",elements:[{name:"literal",value:"'top'"},{name:"literal",value:"'right'"},{name:"literal",value:"'bottom'"},{name:"literal",value:"'left'"}]},description:"",defaultValue:{value:"'top'",computed:!1}},maxWidth:{required:!1,tsType:{name:"union",raw:"string | number",elements:[{name:"string"},{name:"number"}]},description:"",defaultValue:{value:"240",computed:!1}}}};function f({isOpen:t,defaultOpen:p=!1,onOpenChange:i,children:l,disabled:a=!1}){const[o,s]=v({value:t,defaultValue:p,onChange:i}),r=j("tooltip"),b=m.useCallback(()=>{a||s(!0)},[a,s]),y=m.useCallback(()=>s(!1),[s]);return e.jsx(x.Provider,{value:{isOpen:!a&&o,open:b,close:y,tooltipId:r},children:e.jsx("span",{style:{position:"relative",display:"inline-flex"},children:l})})}const n=Object.assign(f,{Root:f,Trigger:T,Content:h});f.__docgenInfo={description:"",methods:[],displayName:"TooltipRoot",props:{isOpen:{required:!1,tsType:{name:"boolean"},description:""},defaultOpen:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},onOpenChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(open: boolean) => void",signature:{arguments:[{type:{name:"boolean"},name:"open"}],return:{name:"void"}}},description:""},children:{required:!0,tsType:{name:"ReactNode"},description:""},delay:{required:!1,tsType:{name:"number"},description:""},disabled:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}}}};const S={title:"Overlay/Tooltip",component:n,tags:["autodocs"],parameters:{layout:"centered"}},d={render:()=>e.jsxs(n.Root,{children:[e.jsx(n.Trigger,{children:e.jsx("button",{style:{padding:"8px 16px",borderRadius:4,cursor:"pointer"},children:"Passe o mouse"})}),e.jsx(n.Content,{children:"Dica útil para o usuário"})]})},c={render:()=>e.jsx("div",{style:{display:"flex",gap:32,padding:64,flexWrap:"wrap",justifyContent:"center"},children:["top","bottom","left","right"].map(t=>e.jsxs(n.Root,{children:[e.jsx(n.Trigger,{children:e.jsx("button",{style:{padding:"8px 12px",borderRadius:4,cursor:"pointer",minWidth:80},children:t})}),e.jsxs(n.Content,{placement:t,children:["Tooltip ",t]})]},t))})},u={render:()=>e.jsxs(n.Root,{children:[e.jsx(n.Trigger,{children:e.jsx("button",{style:{padding:"8px 16px",borderRadius:4,cursor:"pointer"},children:"Texto longo"})}),e.jsx(n.Content,{maxWidth:240,children:"Esta é uma dica mais detalhada que pode conter múltiplas linhas de texto para explicar melhor a funcionalidade."})]})};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <Tooltip.Root>\r
      <Tooltip.Trigger>\r
        <button style={{
        padding: '8px 16px',
        borderRadius: 4,
        cursor: 'pointer'
      }}>\r
          Passe o mouse\r
        </button>\r
      </Tooltip.Trigger>\r
      <Tooltip.Content>Dica útil para o usuário</Tooltip.Content>\r
    </Tooltip.Root>
}`,...d.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: 32,
    padding: 64,
    flexWrap: 'wrap',
    justifyContent: 'center'
  }}>\r
      {(['top', 'bottom', 'left', 'right'] as const).map(placement => <Tooltip.Root key={placement}>\r
          <Tooltip.Trigger>\r
            <button style={{
          padding: '8px 12px',
          borderRadius: 4,
          cursor: 'pointer',
          minWidth: 80
        }}>\r
              {placement}\r
            </button>\r
          </Tooltip.Trigger>\r
          <Tooltip.Content placement={placement}>\r
            Tooltip {placement}\r
          </Tooltip.Content>\r
        </Tooltip.Root>)}\r
    </div>
}`,...c.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <Tooltip.Root>\r
      <Tooltip.Trigger>\r
        <button style={{
        padding: '8px 16px',
        borderRadius: 4,
        cursor: 'pointer'
      }}>\r
          Texto longo\r
        </button>\r
      </Tooltip.Trigger>\r
      <Tooltip.Content maxWidth={240}>\r
        Esta é uma dica mais detalhada que pode conter múltiplas linhas de texto para explicar melhor a funcionalidade.\r
      </Tooltip.Content>\r
    </Tooltip.Root>
}`,...u.parameters?.docs?.source}}};const W=["Default","Placements","WithLongContent"];export{d as Default,c as Placements,u as WithLongContent,W as __namedExportsOrder,S as default};
