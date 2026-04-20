import{u as x,j as r}from"./iframe-DkxCh0KI.js";import"./preload-helper-D9Z9MdNV.js";const g="arbor-skeleton-keyframes";function f(){if(typeof document>"u"||document.getElementById(g))return;const e=document.createElement("style");e.id=g,e.textContent=`
    @keyframes arbor-shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
  `,document.head.appendChild(e)}function b({width:e,height:t,borderRadius:n,style:a,...o}){const i=x();f();const d=i.colors.background.subtle,p=i.colors.background.interactive;return r.jsx("span",{...o,style:{display:"block",width:typeof e=="number"?`${e}px`:e??"100%",height:typeof t=="number"?`${t}px`:t??"16px",borderRadius:typeof n=="number"?`${n}px`:n??i.radii.nano,backgroundImage:`linear-gradient(90deg, ${d} 25%, ${p} 50%, ${d} 75%)`,backgroundSize:"200% 100%",animation:"arbor-shimmer 1.4s ease-in-out infinite",...a}})}function s({lines:e,width:t,height:n,borderRadius:a,style:o,...i}){if(e&&e>1){const d=x();return r.jsx("span",{role:"status","aria-label":"Carregando",style:{display:"flex",flexDirection:"column",gap:d.space.tiny,...o},...i,children:Array.from({length:e},(p,h)=>r.jsx(b,{"aria-hidden":"true",width:h===e-1?"60%":t,height:n,borderRadius:a},h))})}return r.jsx(b,{role:"status","aria-label":"Carregando",width:t,height:n,borderRadius:a,style:o,...i})}s.__docgenInfo={description:"",methods:[],displayName:"Skeleton",props:{width:{required:!1,tsType:{name:"union",raw:"number | string",elements:[{name:"number"},{name:"string"}]},description:"Largura em px ou string CSS"},height:{required:!1,tsType:{name:"union",raw:"number | string",elements:[{name:"number"},{name:"string"}]},description:"Altura em px ou string CSS"},borderRadius:{required:!1,tsType:{name:"union",raw:"number | string",elements:[{name:"number"},{name:"string"}]},description:""},lines:{required:!1,tsType:{name:"number"},description:"Renderiza múltiplas linhas empilhadas"}},composes:["HTMLAttributes"]};const w={title:"Feedback/Skeleton",component:s,tags:["autodocs"],parameters:{layout:"centered"},argTypes:{width:{control:"text"},height:{control:"text"},borderRadius:{control:"text"},lines:{control:{type:"number",min:1,max:10}}}},c={args:{width:200,height:16}},m={args:{width:48,height:48,borderRadius:"50%"}},l={args:{width:300,height:14,lines:4}},u={render:()=>r.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:12,width:320,padding:16,border:"1px solid #eee",borderRadius:8},children:[r.jsx(s,{width:60,height:60,borderRadius:"50%"}),r.jsx(s,{width:"100%",height:16}),r.jsx(s,{width:"80%",height:14}),r.jsx(s,{width:"60%",height:14})]})};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    width: 200,
    height: 16
  }
}`,...c.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    width: 48,
    height: 48,
    borderRadius: '50%'
  }
}`,...m.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    width: 300,
    height: 14,
    lines: 4
  }
}`,...l.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    width: 320,
    padding: 16,
    border: '1px solid #eee',
    borderRadius: 8
  }}>\r
      <Skeleton width={60} height={60} borderRadius="50%" />\r
      <Skeleton width="100%" height={16} />\r
      <Skeleton width="80%" height={14} />\r
      <Skeleton width="60%" height={14} />\r
    </div>
}`,...u.parameters?.docs?.source}}};const S=["Line","Circle","MultiLine","CardSkeleton"];export{u as CardSkeleton,m as Circle,c as Line,l as MultiLine,S as __namedExportsOrder,w as default};
