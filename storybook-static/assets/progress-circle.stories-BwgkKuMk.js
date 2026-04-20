import{u as f,j as e}from"./iframe-DkxCh0KI.js";import"./preload-helper-D9Z9MdNV.js";function s({progress:a,size:r=48,strokeWidth:c=4,tone:m="brand",label:u,...g}){const o=f(),p=Math.min(100,Math.max(0,a)),i=(r-c*2)/2,d=2*Math.PI*i,b=d*(1-p/100),x={brand:o.colors.brand.base,success:o.colors.feedback.success.base,warning:o.colors.feedback.warning.base,critical:o.colors.feedback.critical.base};return e.jsxs("svg",{role:"progressbar","aria-valuenow":p,"aria-valuemin":0,"aria-valuemax":100,"aria-label":u,width:r,height:r,viewBox:`0 0 ${r} ${r}`,fill:"none",style:{transform:"rotate(-90deg)"},...g,children:[e.jsx("circle",{cx:r/2,cy:r/2,r:i,stroke:o.colors.background.subtle,strokeWidth:c}),e.jsx("circle",{cx:r/2,cy:r/2,r:i,stroke:x[m],strokeWidth:c,strokeLinecap:"round",strokeDasharray:d,strokeDashoffset:b,style:{transition:"stroke-dashoffset 0.3s ease"}})]})}s.__docgenInfo={description:"",methods:[],displayName:"ProgressCircle",props:{progress:{required:!0,tsType:{name:"number"},description:"Valor de 0 a 100"},size:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"48",computed:!1}},strokeWidth:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"4",computed:!1}},tone:{required:!1,tsType:{name:"union",raw:"'brand' | 'success' | 'warning' | 'critical'",elements:[{name:"literal",value:"'brand'"},{name:"literal",value:"'success'"},{name:"literal",value:"'warning'"},{name:"literal",value:"'critical'"}]},description:"",defaultValue:{value:"'brand'",computed:!1}},label:{required:!1,tsType:{name:"string"},description:"Texto descritivo para leitores de tela"}},composes:["SVGAttributes"]};const h={title:"Feedback/ProgressCircle",component:s,tags:["autodocs"],parameters:{layout:"centered"},argTypes:{progress:{control:{type:"range",min:0,max:100,step:1}},size:{control:{type:"number",min:24,max:200}},strokeWidth:{control:{type:"number",min:2,max:20}},tone:{control:{type:"select"},options:["brand","success","warning","critical"]},label:{control:"text"}}},t={args:{progress:65,tone:"brand",label:"Progresso"}},l={render:()=>e.jsx("div",{style:{display:"flex",gap:24,alignItems:"center"},children:["brand","success","warning","critical"].map(a=>e.jsx(s,{progress:75,tone:a,label:a},a))})},n={render:()=>e.jsxs("div",{style:{display:"flex",gap:16,alignItems:"center"},children:[e.jsx(s,{progress:50,size:32,label:"32px"}),e.jsx(s,{progress:50,size:56,label:"56px"}),e.jsx(s,{progress:50,size:80,label:"80px"}),e.jsx(s,{progress:50,size:120,label:"120px"})]})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    progress: 65,
    tone: 'brand',
    label: 'Progresso'
  }
}`,...t.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: 24,
    alignItems: 'center'
  }}>\r
      {(['brand', 'success', 'warning', 'critical'] as const).map(tone => <ProgressCircle key={tone} progress={75} tone={tone} label={tone} />)}\r
    </div>
}`,...l.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: 16,
    alignItems: 'center'
  }}>\r
      <ProgressCircle progress={50} size={32} label="32px" />\r
      <ProgressCircle progress={50} size={56} label="56px" />\r
      <ProgressCircle progress={50} size={80} label="80px" />\r
      <ProgressCircle progress={50} size={120} label="120px" />\r
    </div>
}`,...n.parameters?.docs?.source}}};const j=["Default","AllTones","Sizes"];export{l as AllTones,t as Default,n as Sizes,j as __namedExportsOrder,h as default};
