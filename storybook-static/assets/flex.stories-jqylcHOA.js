import{j as e}from"./iframe-DkxCh0KI.js";import{F as n}from"./flex-DtA5Ynz8.js";import"./preload-helper-D9Z9MdNV.js";const l={title:"Core/Layout/Flex",component:n,tags:["autodocs"],parameters:{layout:"centered"}},r=({children:c})=>e.jsx("div",{style:{padding:"8px 16px",background:"#4a90e2",color:"#fff",borderRadius:4},children:c}),t={render:()=>e.jsxs(n,{style:{gap:8,padding:16},children:[e.jsx(r,{children:"A"}),e.jsx(r,{children:"B"}),e.jsx(r,{children:"C"})]})},s={render:()=>e.jsxs(n,{style:{flexDirection:"column",gap:8,padding:16},children:[e.jsx(r,{children:"Topo"}),e.jsx(r,{children:"Meio"}),e.jsx(r,{children:"Base"})]})},a={render:()=>e.jsx(n,{style:{justifyContent:"center",alignItems:"center",height:120,background:"#f5f5f5",gap:8},children:e.jsx(r,{children:"Centro"})})},o={render:()=>e.jsxs(n,{style:{justifyContent:"space-between",padding:16,background:"#f5f5f5"},children:[e.jsx(r,{children:"Esquerda"}),e.jsx(r,{children:"Direita"})]})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <Flex style={{
    gap: 8,
    padding: 16
  }}>\r
      <Item>A</Item>\r
      <Item>B</Item>\r
      <Item>C</Item>\r
    </Flex>
}`,...t.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => <Flex style={{
    flexDirection: 'column',
    gap: 8,
    padding: 16
  }}>\r
      <Item>Topo</Item>\r
      <Item>Meio</Item>\r
      <Item>Base</Item>\r
    </Flex>
}`,...s.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => <Flex style={{
    justifyContent: 'center',
    alignItems: 'center',
    height: 120,
    background: '#f5f5f5',
    gap: 8
  }}>\r
      <Item>Centro</Item>\r
    </Flex>
}`,...a.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <Flex style={{
    justifyContent: 'space-between',
    padding: 16,
    background: '#f5f5f5'
  }}>\r
      <Item>Esquerda</Item>\r
      <Item>Direita</Item>\r
    </Flex>
}`,...o.parameters?.docs?.source}}};const p=["Row","Column","Centered","SpaceBetween"];export{a as Centered,s as Column,t as Row,o as SpaceBetween,p as __namedExportsOrder,l as default};
