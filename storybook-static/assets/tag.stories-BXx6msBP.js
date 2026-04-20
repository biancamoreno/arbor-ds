import{u as p,j as r}from"./iframe-DkxCh0KI.js";import"./preload-helper-D9Z9MdNV.js";function g(o,c,e){return c==="brand"?o?{backgroundColor:e.colors.brand.base,borderColor:e.colors.brand.base,color:e.colors.text.inverse}:{backgroundColor:e.colors.brand.subtle,borderColor:e.colors.brand.soft,color:e.colors.brand.strong}:o?{backgroundColor:e.colors.text.primary,borderColor:e.colors.text.primary,color:e.colors.text.inverse}:{backgroundColor:e.colors.surface.default,borderColor:e.colors.border.default,color:e.colors.text.primary}}function a({children:o,tone:c="neutral",selected:e=!1,style:u,...i}){const n=p();return r.jsx("button",{type:"button",...i,style:{display:"inline-flex",alignItems:"center",justifyContent:"center",gap:"6px",borderRadius:n.radii.full,borderStyle:"solid",borderWidth:"1px",padding:"6px 12px",fontSize:n.fontSizes.xsmall,fontWeight:n.fontWeights.medium,cursor:i.disabled?"not-allowed":"pointer",...g(e,c,n),...u},children:o})}a.__docgenInfo={description:"",methods:[],displayName:"Tag",props:{children:{required:!0,tsType:{name:"ReactNode"},description:""},tone:{required:!1,tsType:{name:"union",raw:"'neutral' | 'brand'",elements:[{name:"literal",value:"'neutral'"},{name:"literal",value:"'brand'"}]},description:"",defaultValue:{value:"'neutral'",computed:!1}},selected:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}}},composes:["Omit"]};const{fn:b}=__STORYBOOK_MODULE_TEST__,T={title:"Components/Tag",component:a,tags:["autodocs"],parameters:{layout:"centered"},argTypes:{tone:{control:{type:"select"},options:["neutral","brand"]},selected:{control:"boolean"},disabled:{control:"boolean"}},args:{onClick:b()}},t={args:{children:"Tag padrão",tone:"neutral"}},s={args:{children:"Tag brand",tone:"brand"}},l={args:{children:"Selecionada",selected:!0}},d={render:()=>r.jsxs("div",{style:{display:"flex",gap:8},children:[r.jsx(a,{tone:"neutral",children:"Neutral"}),r.jsx(a,{tone:"brand",children:"Brand"}),r.jsx(a,{tone:"neutral",selected:!0,children:"Selecionada"}),r.jsx(a,{disabled:!0,children:"Desabilitada"})]})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Tag padrão',
    tone: 'neutral'
  }
}`,...t.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Tag brand',
    tone: 'brand'
  }
}`,...s.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Selecionada',
    selected: true
  }
}`,...l.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: 8
  }}>\r
      <Tag tone="neutral">Neutral</Tag>\r
      <Tag tone="brand">Brand</Tag>\r
      <Tag tone="neutral" selected>Selecionada</Tag>\r
      <Tag disabled>Desabilitada</Tag>\r
    </div>
}`,...d.parameters?.docs?.source}}};const x=["Default","Brand","Selected","AllTones"];export{d as AllTones,s as Brand,t as Default,l as Selected,x as __namedExportsOrder,T as default};
