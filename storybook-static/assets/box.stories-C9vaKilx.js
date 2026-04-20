import{j as a}from"./iframe-DkxCh0KI.js";import{B as n}from"./box-Dm3A0a77.js";import"./preload-helper-D9Z9MdNV.js";const c={title:"Core/Layout/Box",component:n,tags:["autodocs"],parameters:{layout:"centered"},argTypes:{as:{control:"text",description:"Elemento HTML ou componente React"}}},r={args:{children:"Box básico",style:{padding:16,background:"#f0f0f0",borderRadius:4}}},e={args:{as:"section",children:"Box renderizado como <section>",style:{padding:16,border:"2px dashed #aaa",borderRadius:4}}},o={render:()=>a.jsxs(n,{style:{padding:24,background:"#e8f4fd",borderRadius:8},children:[a.jsx(n,{style:{padding:16,background:"#ffffff",borderRadius:4,marginBottom:8},children:"Item 1"}),a.jsx(n,{style:{padding:16,background:"#ffffff",borderRadius:4},children:"Item 2"})]})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Box básico',
    style: {
      padding: 16,
      background: '#f0f0f0',
      borderRadius: 4
    }
  }
}`,...r.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    as: 'section',
    children: 'Box renderizado como <section>',
    style: {
      padding: 16,
      border: '2px dashed #aaa',
      borderRadius: 4
    }
  }
}`,...e.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <Box style={{
    padding: 24,
    background: '#e8f4fd',
    borderRadius: 8
  }}>\r
      <Box style={{
      padding: 16,
      background: '#ffffff',
      borderRadius: 4,
      marginBottom: 8
    }}>\r
        Item 1\r
      </Box>\r
      <Box style={{
      padding: 16,
      background: '#ffffff',
      borderRadius: 4
    }}>\r
        Item 2\r
      </Box>\r
    </Box>
}`,...o.parameters?.docs?.source}}};const i=["Default","AsSection","Nested"];export{e as AsSection,r as Default,o as Nested,i as __namedExportsOrder,c as default};
