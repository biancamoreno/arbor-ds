import{R as w,u as N,j as e}from"./iframe-DkxCh0KI.js";import{g as P,a as V,F as _,T as l}from"./textinput-BjoN5v6o.js";import"./preload-helper-D9Z9MdNV.js";import"./field-context-Cg-4C5YY.js";const x=w.forwardRef(({label:g,error:r,size:y="md",variant:o="default",helperText:s,disabled:t,value:b,onChange:q,onValueChange:j,rows:z=4,maxLength:n,showCharCount:C,style:D,...I},F)=>{const a=N(),E=P(a,{error:r,variant:o,disabled:t}),M=V(a,{size:y,variant:o,error:r,disabled:t}),T=b?.length||0;return e.jsxs(_,{theme:a,label:g,helperText:s,error:r,children:[e.jsx("textarea",{ref:F,rows:z,value:b,onChange:S=>{q?.(S),j?.(S.target.value)},disabled:t,maxLength:n,style:{...M,fontFamily:"inherit",color:E.textColor,cursor:t?"not-allowed":"auto",outline:"none",resize:"vertical",...D},...I}),C&&n&&e.jsx("div",{style:{display:"flex",justifyContent:"flex-end"},children:e.jsxs("span",{style:{fontSize:a.fontSizes.xsmall,color:T>n*.9?a.colors.feedback.critical.base:a.colors.text.secondary},children:[T," / ",n]})})]})});x.displayName="TextArea";x.__docgenInfo={description:"",methods:[],displayName:"TextArea",props:{label:{required:!1,tsType:{name:"string"},description:""},error:{required:!1,tsType:{name:"string"},description:""},size:{required:!1,tsType:{name:"union",raw:"'sm' | 'md' | 'lg'",elements:[{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"}]},description:"",defaultValue:{value:"'md'",computed:!1}},variant:{required:!1,tsType:{name:"union",raw:"'default' | 'filled'",elements:[{name:"literal",value:"'default'"},{name:"literal",value:"'filled'"}]},description:"",defaultValue:{value:"'default'",computed:!1}},helperText:{required:!1,tsType:{name:"string"},description:""},disabled:{required:!1,tsType:{name:"boolean"},description:""},showCharCount:{required:!1,tsType:{name:"boolean"},description:""},onValueChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(value: string) => void",signature:{arguments:[{type:{name:"string"},name:"value"}],return:{name:"void"}}},description:""},rows:{defaultValue:{value:"4",computed:!1},required:!1}},composes:["Omit"]};const v=w.forwardRef(({onSearch:g,onKeyDown:r,...y},o)=>e.jsx(l,{ref:o,type:"search",leftIcon:e.jsx("span",{"aria-hidden":"true",children:"Q"}),onKeyDown:s=>{r?.(s),s.key==="Enter"&&g?.(s.currentTarget.value)},...y}));v.displayName="SearchInput";v.__docgenInfo={description:"",methods:[],displayName:"SearchInput",props:{onSearch:{required:!1,tsType:{name:"signature",type:"function",raw:"(value: string) => void",signature:{arguments:[{type:{name:"string"},name:"value"}],return:{name:"void"}}},description:""}},composes:["Omit"]};const O={title:"Form/Input",component:l,tags:["autodocs"],parameters:{layout:"centered"},argTypes:{size:{control:{type:"select"},options:["sm","md","lg"]},variant:{control:{type:"select"},options:["default","filled"]},disabled:{control:"boolean"}}},i={args:{placeholder:"Digite algo...",label:"Campo de texto",size:"md"}},d={args:{label:"Senha",placeholder:"Mínimo 8 caracteres",helperText:"Use letras, números e símbolos.",type:"password"}},c={args:{label:"E-mail",value:"invalido",error:"Formato de e-mail inválido."}},p={args:{label:"Variante filled",placeholder:"Campo preenchido",variant:"filled"}},m={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:12,width:320},children:[e.jsx(l,{size:"sm",placeholder:"Pequeno (sm)",label:"Pequeno"}),e.jsx(l,{size:"md",placeholder:"Médio (md)",label:"Médio"}),e.jsx(l,{size:"lg",placeholder:"Grande (lg)",label:"Grande"})]})},u={args:{label:"Campo desabilitado",value:"Não editável",disabled:!0}},h={render:()=>e.jsx(v,{placeholder:"Pesquisar...",label:"Busca",style:{width:320}})},f={render:()=>e.jsx(x,{label:"Descrição",placeholder:"Descreva com detalhes...",style:{width:320}})};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    placeholder: 'Digite algo...',
    label: 'Campo de texto',
    size: 'md'
  }
}`,...i.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Senha',
    placeholder: 'Mínimo 8 caracteres',
    helperText: 'Use letras, números e símbolos.',
    type: 'password'
  }
}`,...d.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'E-mail',
    value: 'invalido',
    error: 'Formato de e-mail inválido.'
  }
}`,...c.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Variante filled',
    placeholder: 'Campo preenchido',
    variant: 'filled'
  }
}`,...p.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    width: 320
  }}>\r
      <TextInput size="sm" placeholder="Pequeno (sm)" label="Pequeno" />\r
      <TextInput size="md" placeholder="Médio (md)" label="Médio" />\r
      <TextInput size="lg" placeholder="Grande (lg)" label="Grande" />\r
    </div>
}`,...m.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Campo desabilitado',
    value: 'Não editável',
    disabled: true
  }
}`,...u.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <SearchInput placeholder="Pesquisar..." label="Busca" style={{
    width: 320
  }} />
}`,...h.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <TextArea label="Descrição" placeholder="Descreva com detalhes..." style={{
    width: 320
  }} />
}`,...f.parameters?.docs?.source}}};const k=["Default","WithHelperText","WithError","Filled","Sizes","Disabled","Search","Textarea"];export{i as Default,u as Disabled,p as Filled,h as Search,m as Sizes,f as Textarea,c as WithError,d as WithHelperText,k as __namedExportsOrder,O as default};
