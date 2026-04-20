import{u as h,j as t}from"./iframe-DkxCh0KI.js";import"./preload-helper-D9Z9MdNV.js";function y(r,s,n){const e=n.colors;return{neutral:{bg:s==="solid"?e.text.primary:e.background.subtle,text:s==="solid"?e.text.inverse:e.text.primary,border:s==="solid"?e.text.primary:e.border.subtle},brand:{bg:s==="solid"?e.brand.base:e.brand.subtle,text:s==="solid"?e.text.inverse:e.brand.strong,border:s==="solid"?e.brand.base:e.brand.soft},success:{bg:s==="solid"?e.feedback.success.base:e.feedback.success.subtle,text:s==="solid"?e.text.inverse:e.feedback.success.strong,border:s==="solid"?e.feedback.success.base:e.feedback.success.subtle},warning:{bg:s==="solid"?e.feedback.warning.base:e.feedback.warning.subtle,text:s==="solid"?e.text.inverse:e.feedback.warning.strong,border:s==="solid"?e.feedback.warning.base:e.feedback.warning.subtle},critical:{bg:s==="solid"?e.feedback.critical.base:e.feedback.critical.subtle,text:s==="solid"?e.text.inverse:e.feedback.critical.strong,border:s==="solid"?e.feedback.critical.base:e.feedback.critical.subtle},info:{bg:s==="solid"?e.status.info:"transparent",text:s==="solid"?e.text.inverse:e.status.info,border:e.status.info}}[r]}function g({children:r,tone:s="neutral",variant:n="subtle",size:e="md",style:l,...m}){const o=h(),b=y(s,n,o),f=e==="sm"?"2px 6px":"3px 8px",x=o.fontSizes.xsmall;return t.jsx("span",{...m,style:{display:"inline-flex",alignItems:"center",justifyContent:"center",gap:"4px",borderRadius:o.radii.full,borderWidth:"1px",borderStyle:"solid",padding:f,fontSize:x,fontWeight:o.fontWeights.medium,lineHeight:1.4,whiteSpace:"nowrap",backgroundColor:b.bg,color:b.text,borderColor:b.border,...l},children:r})}function v({children:r,badge:s,placement:n="top-right",style:e,...l}){const m={"top-right":{top:0,right:0,transform:"translate(50%, -50%)"},"top-left":{top:0,left:0,transform:"translate(-50%, -50%)"},"bottom-right":{bottom:0,right:0,transform:"translate(50%, 50%)"},"bottom-left":{bottom:0,left:0,transform:"translate(-50%, 50%)"}};return t.jsxs("span",{...l,style:{position:"relative",display:"inline-flex",...e},children:[r,t.jsx("span",{style:{position:"absolute",...m[n]},children:s})]})}const a=Object.assign(g,{Root:g,Anchor:v});g.__docgenInfo={description:"",methods:[],displayName:"BadgeRoot",props:{children:{required:!1,tsType:{name:"ReactNode"},description:""},tone:{required:!1,tsType:{name:"union",raw:"'neutral' | 'brand' | 'success' | 'warning' | 'critical' | 'info'",elements:[{name:"literal",value:"'neutral'"},{name:"literal",value:"'brand'"},{name:"literal",value:"'success'"},{name:"literal",value:"'warning'"},{name:"literal",value:"'critical'"},{name:"literal",value:"'info'"}]},description:"Semântica de cor",defaultValue:{value:"'neutral'",computed:!1}},variant:{required:!1,tsType:{name:"union",raw:"'solid' | 'subtle'",elements:[{name:"literal",value:"'solid'"},{name:"literal",value:"'subtle'"}]},description:"Preenchimento sólido vs. suave",defaultValue:{value:"'subtle'",computed:!1}},size:{required:!1,tsType:{name:"union",raw:"'sm' | 'md'",elements:[{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"}]},description:"",defaultValue:{value:"'md'",computed:!1}}},composes:["HTMLAttributes"]};const j={title:"Components/Badge",component:a,tags:["autodocs"],parameters:{layout:"centered"},argTypes:{tone:{control:{type:"select"},options:["neutral","brand","success","warning","critical","info"]},variant:{control:{type:"select"},options:["solid","subtle"]},size:{control:{type:"select"},options:["sm","md"]}}},i={args:{children:"Novo",tone:"brand",variant:"solid"}},d={render:()=>t.jsx("div",{style:{display:"flex",gap:8,flexWrap:"wrap"},children:["neutral","brand","success","warning","critical","info"].map(r=>t.jsx(a,{tone:r,children:r},r))})},c={render:()=>t.jsx("div",{style:{display:"flex",gap:8,flexWrap:"wrap"},children:["neutral","brand","success","warning","critical","info"].map(r=>t.jsx(a,{tone:r,variant:"subtle",children:r},r))})},u={render:()=>t.jsxs("div",{style:{display:"flex",gap:8,alignItems:"center"},children:[t.jsx(a,{size:"sm",tone:"brand",children:"SM"}),t.jsx(a,{size:"md",tone:"brand",children:"MD"})]})},p={render:()=>t.jsx(a.Anchor,{badge:t.jsx(a,{tone:"critical",size:"sm",children:"3"}),children:t.jsx("div",{style:{width:40,height:40,background:"#eee",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center"},children:"🔔"})})};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Novo',
    tone: 'brand',
    variant: 'solid'
  }
}`,...i.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap'
  }}>\r
      {(['neutral', 'brand', 'success', 'warning', 'critical', 'info'] as const).map(tone => <Badge key={tone} tone={tone}>{tone}</Badge>)}\r
    </div>
}`,...d.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap'
  }}>\r
      {(['neutral', 'brand', 'success', 'warning', 'critical', 'info'] as const).map(tone => <Badge key={tone} tone={tone} variant="subtle">{tone}</Badge>)}\r
    </div>
}`,...c.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: 8,
    alignItems: 'center'
  }}>\r
      <Badge size="sm" tone="brand">SM</Badge>\r
      <Badge size="md" tone="brand">MD</Badge>\r
    </div>
}`,...u.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <Badge.Anchor badge={<Badge tone="critical" size="sm">3</Badge>}>\r
      <div style={{
      width: 40,
      height: 40,
      background: '#eee',
      borderRadius: 8,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>\r
        🔔\r
      </div>\r
    </Badge.Anchor>
}`,...p.parameters?.docs?.source}}};const B=["Default","AllTones","Subtle","Sizes","WithAnchor"];export{d as AllTones,i as Default,u as Sizes,c as Subtle,p as WithAnchor,B as __namedExportsOrder,j as default};
