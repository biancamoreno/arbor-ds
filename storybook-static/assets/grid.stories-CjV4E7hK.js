import{j as e}from"./iframe-DkxCh0KI.js";import{G as c}from"./grid-DRUjZnuw.js";import"./preload-helper-D9Z9MdNV.js";const i={title:"Core/Layout/Grid",component:c,tags:["autodocs"],parameters:{layout:"padded"}},r=({children:s,color:t="#4a90e2"})=>e.jsx("div",{style:{padding:16,background:t,color:"#fff",borderRadius:4,textAlign:"center"},children:s}),l={render:()=>e.jsxs(c,{templateColumns:"repeat(3, 1fr)",columnGap:16,rowGap:16,style:{width:"100%"},children:[e.jsx(r,{children:"1"}),e.jsx(r,{children:"2"}),e.jsx(r,{children:"3"}),e.jsx(r,{color:"#2ecc71",children:"4"}),e.jsx(r,{color:"#2ecc71",children:"5"}),e.jsx(r,{color:"#2ecc71",children:"6"})]})},o={render:()=>e.jsxs(c,{templateColumns:"1fr 2fr",columnGap:16,rowGap:16,style:{width:"100%"},children:[e.jsx(r,{children:"Sidebar"}),e.jsx(r,{color:"#e74c3c",children:"Conteúdo Principal"}),e.jsx(r,{children:"Sidebar 2"}),e.jsx(r,{color:"#e74c3c",children:"Conteúdo 2"})]})};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <Grid templateColumns="repeat(3, 1fr)" columnGap={16} rowGap={16} style={{
    width: '100%'
  }}>\r
      <Cell>1</Cell>\r
      <Cell>2</Cell>\r
      <Cell>3</Cell>\r
      <Cell color="#2ecc71">4</Cell>\r
      <Cell color="#2ecc71">5</Cell>\r
      <Cell color="#2ecc71">6</Cell>\r
    </Grid>
}`,...l.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <Grid templateColumns="1fr 2fr" columnGap={16} rowGap={16} style={{
    width: '100%'
  }}>\r
      <Cell>Sidebar</Cell>\r
      <Cell color="#e74c3c">Conteúdo Principal</Cell>\r
      <Cell>Sidebar 2</Cell>\r
      <Cell color="#e74c3c">Conteúdo 2</Cell>\r
    </Grid>
}`,...o.parameters?.docs?.source}}};const m=["ThreeColumns","TwoColumns"];export{l as ThreeColumns,o as TwoColumns,m as __namedExportsOrder,i as default};
