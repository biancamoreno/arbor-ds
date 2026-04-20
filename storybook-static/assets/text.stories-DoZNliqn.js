import{j as t}from"./iframe-DkxCh0KI.js";import{T as n}from"./text-DTf_oZGa.js";import"./preload-helper-D9Z9MdNV.js";const d={title:"Core/Layout/Text",component:n,tags:["autodocs"],parameters:{layout:"centered"}},e={args:{children:"Texto padrão do Arbor DS"}},r={args:{as:"h1",children:"Título H1",style:{fontSize:32,fontWeight:700}}},a={args:{as:"label",children:"Rótulo de formulário",style:{fontSize:14,fontWeight:500}}},o={render:()=>t.jsx("div",{style:{display:"flex",flexDirection:"column",gap:8},children:["h1","h2","h3","h4","h5","h6","p","span"].map(s=>t.jsxs(n,{as:s,children:[s," — Arbor DS Typography"]},s))})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Texto padrão do Arbor DS'
  }
}`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    as: 'h1',
    children: 'Título H1',
    style: {
      fontSize: 32,
      fontWeight: 700
    }
  }
}`,...r.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    as: 'label',
    children: 'Rótulo de formulário',
    style: {
      fontSize: 14,
      fontWeight: 500
    }
  }
}`,...a.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 8
  }}>\r
      {(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span'] as const).map(tag => <Text key={tag} as={tag}>\r
          {tag} — Arbor DS Typography\r
        </Text>)}\r
    </div>
}`,...o.parameters?.docs?.source}}};const p=["Default","AsHeading","AsLabel","Scale"];export{r as AsHeading,a as AsLabel,e as Default,o as Scale,p as __namedExportsOrder,d as default};
