import{u as x,j as r}from"./iframe-DkxCh0KI.js";import"./preload-helper-D9Z9MdNV.js";const b={sm:16,md:24,lg:40},m="arbor-spinner-keyframes";function S(){if(typeof document>"u"||document.getElementById(m))return;const s=document.createElement("style");s.id=m,s.textContent="@keyframes arbor-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }",document.head.appendChild(s)}function t({size:s="md",color:p,label:u="Carregando",style:f,...g}){const y=x(),e=b[s],c=p??y.colors.brand.base,i=s==="sm"?2:3,l=(e-i*2)/2,d=2*Math.PI*l;return S(),r.jsxs("svg",{role:"status","aria-label":u,width:e,height:e,viewBox:`0 0 ${e} ${e}`,fill:"none",style:{animation:"arbor-spin 0.8s linear infinite",...f},...g,children:[r.jsx("circle",{cx:e/2,cy:e/2,r:l,stroke:c,strokeWidth:i,opacity:.2}),r.jsx("circle",{cx:e/2,cy:e/2,r:l,stroke:c,strokeWidth:i,strokeLinecap:"round",strokeDasharray:d,strokeDashoffset:d*.75})]})}t.__docgenInfo={description:"",methods:[],displayName:"Spinner",props:{size:{required:!1,tsType:{name:"union",raw:"'sm' | 'md' | 'lg'",elements:[{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"}]},description:"",defaultValue:{value:"'md'",computed:!1}},color:{required:!1,tsType:{name:"string"},description:"Substitui a cor padrão do stroke"},label:{required:!1,tsType:{name:"string"},description:'@default "Carregando"',defaultValue:{value:"'Carregando'",computed:!1}}},composes:["SVGAttributes"]};const C={title:"Feedback/Spinner",component:t,tags:["autodocs"],parameters:{layout:"centered"},argTypes:{size:{control:{type:"select"},options:["sm","md","lg"]},color:{control:"color"},label:{control:"text"}}},o={args:{size:"md",label:"Carregando"}},a={render:()=>r.jsxs("div",{style:{display:"flex",gap:24,alignItems:"center"},children:[r.jsx(t,{size:"sm"}),r.jsx(t,{size:"md"}),r.jsx(t,{size:"lg"})]})},n={args:{size:"md",color:"#10b981",label:"Processando"}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    size: 'md',
    label: 'Carregando'
  }
}`,...o.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: 24,
    alignItems: 'center'
  }}>\r
      <Spinner size="sm" />\r
      <Spinner size="md" />\r
      <Spinner size="lg" />\r
    </div>
}`,...a.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    size: 'md',
    color: '#10b981',
    label: 'Processando'
  }
}`,...n.parameters?.docs?.source}}};const k=["Default","Sizes","CustomColor"];export{n as CustomColor,o as Default,a as Sizes,k as __namedExportsOrder,C as default};
