import{R as b,u as k,j as a}from"./iframe-DkxCh0KI.js";import"./preload-helper-D9Z9MdNV.js";const w={sm:{padding:"12px",titleSize:"16px",descriptionSize:"10px"},md:{padding:"16px",titleSize:"16px",descriptionSize:"10px"},lg:{padding:"20px",titleSize:"20px",descriptionSize:"16px"}},s=b.forwardRef(({label:r,description:c,value:u,checked:m,defaultChecked:x=!1,disabled:i=!1,size:g="md",onCheckedChange:y,children:f,name:h,id:v,style:z,...j},S)=>{const e=k(),[C,R]=b.useState(x),o=m??C,p=w[g];return a.jsxs("label",{style:{display:"flex",width:"100%",cursor:i?"not-allowed":"pointer",opacity:i?.6:1},children:[a.jsx("input",{...j,ref:S,id:v,type:"radio",name:h,value:u,checked:o,disabled:i,onChange:()=>{i||(m===void 0&&R(!0),y?.(!0,u))},style:{position:"absolute",opacity:0,pointerEvents:"none"}}),a.jsxs("div",{"aria-checked":o,role:"radio",style:{width:"100%",display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:e.space.small,padding:p.padding,borderRadius:e.radii.medium,border:`1px solid ${o?e.colors.brand.base:e.colors.border.default}`,backgroundColor:o?e.colors.brand.subtle:e.colors.surface.default,boxShadow:o?`0 0 0 2px ${e.colors.brand.subtle}`:"none",transition:"border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease",...z},children:[a.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"6px",minWidth:0},children:[a.jsx("span",{style:{color:e.colors.text.primary,fontSize:p.titleSize,fontWeight:e.fontWeights.medium},children:r}),c&&a.jsx("span",{style:{color:e.colors.text.secondary,fontSize:p.descriptionSize},children:c}),f&&a.jsx("div",{children:f})]}),a.jsx("span",{"aria-hidden":"true",style:{display:"inline-flex",alignItems:"center",justifyContent:"center",width:"20px",height:"20px",borderRadius:e.radii.full,border:`1px solid ${o?e.colors.brand.base:e.colors.border.strong}`,backgroundColor:e.colors.surface.default,flexShrink:0},children:a.jsx("span",{style:{width:"10px",height:"10px",borderRadius:e.radii.full,backgroundColor:o?e.colors.brand.base:"transparent"}})})]})]})});s.displayName="RadioCard";s.__docgenInfo={description:"",methods:[],displayName:"RadioCard",props:{label:{required:!0,tsType:{name:"ReactNode"},description:""},description:{required:!1,tsType:{name:"ReactNode"},description:""},value:{required:!0,tsType:{name:"string"},description:""},checked:{required:!1,tsType:{name:"boolean"},description:""},defaultChecked:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},disabled:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},size:{required:!1,tsType:{name:"union",raw:"'sm' | 'md' | 'lg'",elements:[{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"}]},description:"",defaultValue:{value:"'md'",computed:!1}},onCheckedChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(checked: boolean, value: string) => void",signature:{arguments:[{type:{name:"boolean"},name:"checked"},{type:{name:"string"},name:"value"}],return:{name:"void"}}},description:""},children:{required:!1,tsType:{name:"ReactNode"},description:""}},composes:["Omit"]};const q={title:"Form/RadioCard",component:s,tags:["autodocs"],parameters:{layout:"centered"},argTypes:{size:{control:{type:"select"},options:["sm","md","lg"]},disabled:{control:"boolean"}}},t={args:{value:"opt1",label:"Opção A",description:"Descrição da opção A"}},l={render:()=>a.jsx("div",{style:{display:"flex",flexDirection:"column",gap:12,width:320},role:"radiogroup","aria-label":"Planos",children:[{value:"free",label:"Gratuito",description:"Ideal para começar, até 3 projetos."},{value:"pro",label:"Pro — R$ 49/mês",description:"Projetos ilimitados e suporte prioritário."},{value:"enterprise",label:"Enterprise",description:"Solução customizada para grandes times."}].map(r=>a.jsx(s,{value:r.value,label:r.label,description:r.description,name:"plan"},r.value))})},n={args:{value:"disabled",label:"Opção indisponível",description:"Esta opção não está disponível no momento.",disabled:!0}},d={render:()=>a.jsx("div",{style:{display:"flex",flexDirection:"column",gap:12,width:320},children:["sm","md","lg"].map(r=>a.jsx(s,{value:r,label:`Tamanho ${r}`,size:r,name:"size"},r))})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    value: 'opt1',
    label: 'Opção A',
    description: 'Descrição da opção A'
  }
}`,...t.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    width: 320
  }} role="radiogroup" aria-label="Planos">\r
      {[{
      value: 'free',
      label: 'Gratuito',
      description: 'Ideal para começar, até 3 projetos.'
    }, {
      value: 'pro',
      label: 'Pro — R$ 49/mês',
      description: 'Projetos ilimitados e suporte prioritário.'
    }, {
      value: 'enterprise',
      label: 'Enterprise',
      description: 'Solução customizada para grandes times.'
    }].map(plan => <RadioCard key={plan.value} value={plan.value} label={plan.label} description={plan.description} name="plan" />)}\r
    </div>
}`,...l.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    value: 'disabled',
    label: 'Opção indisponível',
    description: 'Esta opção não está disponível no momento.',
    disabled: true
  }
}`,...n.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    width: 320
  }}>\r
      {(['sm', 'md', 'lg'] as const).map(size => <RadioCard key={size} value={size} label={\`Tamanho \${size}\`} size={size} name="size" />)}\r
    </div>
}`,...d.parameters?.docs?.source}}};const E=["Default","Group","Disabled","Sizes"];export{t as Default,n as Disabled,l as Group,d as Sizes,E as __namedExportsOrder,q as default};
