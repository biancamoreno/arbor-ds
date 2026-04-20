import{u as f,j as e}from"./iframe-DkxCh0KI.js";import"./preload-helper-D9Z9MdNV.js";const x={sm:4,md:8,lg:12};function s({progress:a,label:c,size:d="md",tone:p="brand",style:m,...u}){const r=f(),i=Math.min(100,Math.max(0,a)),g=x[d],b={brand:r.colors.brand.base,success:r.colors.feedback.success.base,warning:r.colors.feedback.warning.base,critical:r.colors.feedback.critical.base};return e.jsx("div",{role:"progressbar","aria-valuenow":i,"aria-valuemin":0,"aria-valuemax":100,"aria-label":c,...u,style:{width:"100%",height:`${g}px`,borderRadius:r.radii.full,backgroundColor:r.colors.background.subtle,overflow:"hidden",...m},children:e.jsx("div",{style:{height:"100%",width:`${i}%`,borderRadius:r.radii.full,backgroundColor:b[p],transition:"width 0.3s ease"}})})}s.__docgenInfo={description:"",methods:[],displayName:"ProgressBar",props:{progress:{required:!0,tsType:{name:"number"},description:"Valor de 0 a 100"},label:{required:!1,tsType:{name:"string"},description:"Texto descritivo para leitores de tela"},size:{required:!1,tsType:{name:"union",raw:"'sm' | 'md' | 'lg'",elements:[{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"}]},description:"",defaultValue:{value:"'md'",computed:!1}},tone:{required:!1,tsType:{name:"union",raw:"'brand' | 'success' | 'warning' | 'critical'",elements:[{name:"literal",value:"'brand'"},{name:"literal",value:"'success'"},{name:"literal",value:"'warning'"},{name:"literal",value:"'critical'"}]},description:"",defaultValue:{value:"'brand'",computed:!1}}},composes:["HTMLAttributes"]};const y={title:"Feedback/ProgressBar",component:s,tags:["autodocs"],parameters:{layout:"padded"},argTypes:{progress:{control:{type:"range",min:0,max:100,step:1}},size:{control:{type:"select"},options:["sm","md","lg"]},tone:{control:{type:"select"},options:["brand","success","warning","critical"]},label:{control:"text"}}},o={args:{progress:60,tone:"brand",label:"Progresso"}},l={render:()=>e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:12,width:400},children:["brand","success","warning","critical"].map(a=>e.jsx(s,{progress:65,tone:a,label:`Progresso ${a}`},a))})},n={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:12,width:400},children:[e.jsx(s,{progress:50,size:"sm",label:"SM"}),e.jsx(s,{progress:50,size:"md",label:"MD"}),e.jsx(s,{progress:50,size:"lg",label:"LG"})]})},t={args:{progress:100,tone:"success",label:"Concluído"}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    progress: 60,
    tone: 'brand',
    label: 'Progresso'
  }
}`,...o.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    width: 400
  }}>\r
      {(['brand', 'success', 'warning', 'critical'] as const).map(tone => <ProgressBar key={tone} progress={65} tone={tone} label={\`Progresso \${tone}\`} />)}\r
    </div>
}`,...l.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    width: 400
  }}>\r
      <ProgressBar progress={50} size="sm" label="SM" />\r
      <ProgressBar progress={50} size="md" label="MD" />\r
      <ProgressBar progress={50} size="lg" label="LG" />\r
    </div>
}`,...n.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    progress: 100,
    tone: 'success',
    label: 'Concluído'
  }
}`,...t.parameters?.docs?.source}}};const w=["Default","AllTones","Sizes","Complete"];export{l as AllTones,t as Complete,o as Default,n as Sizes,w as __namedExportsOrder,y as default};
