import{r as x,u as b,j as e}from"./iframe-DkxCh0KI.js";import{u as T}from"./use-controllable-state-BCpRlVAk.js";import{u as w}from"./field-context-Cg-4C5YY.js";import"./preload-helper-D9Z9MdNV.js";const v=x.createContext(null);function g(){const o=x.useContext(v);if(!o)throw new Error("useRadioContext must be used inside Radio.Root");return o}const q={sm:{padding:"12px",titleSize:"14px",descriptionSize:"10px"},md:{padding:"16px",titleSize:"16px",descriptionSize:"12px"},lg:{padding:"20px",titleSize:"20px",descriptionSize:"14px"}};function y({value:o,checked:r,defaultChecked:n=!1,onCheckedChange:j,disabled:I=!1,id:C,name:R,size:S="md",children:z}){const D=x.useId(),i=w(),f=i?.fieldId??C??D,t=I||(i?.isDisabled??!1),s=b(),k=q[S],[d,h]=T({value:r,defaultValue:n,onChange:L=>j?.(L,o)});return e.jsx(v.Provider,{value:{isChecked:d,isDisabled:t,inputId:f,value:o,name:R,onChange:()=>!t&&h(!0)},children:e.jsxs("label",{style:{display:"flex",width:"100%",cursor:t?"not-allowed":"pointer",opacity:t?.6:1},children:[e.jsx("input",{id:f,type:"radio",name:R,value:o,checked:d,disabled:t,"aria-describedby":i?.descriptionId,"aria-required":i?.isRequired||void 0,"aria-invalid":i?.isInvalid||void 0,"aria-errormessage":i?.isInvalid?i.errorId:void 0,onChange:()=>!t&&h(!0),style:{position:"absolute",opacity:0,pointerEvents:"none"}}),e.jsx("div",{"aria-hidden":"true",style:{width:"100%",display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:s.space.small,padding:k.padding,borderRadius:s.radii.medium,border:`1px solid ${d?s.colors.brand.base:s.colors.border.default}`,backgroundColor:d?s.colors.brand.subtle:s.colors.surface.default,boxShadow:d?`0 0 0 2px ${s.colors.brand.subtle}`:"none",transition:"border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease"},children:z})]})})}function $({style:o}){const r=b(),n=g();return e.jsx("span",{"aria-hidden":"true",style:{display:"inline-flex",alignItems:"center",justifyContent:"center",width:"20px",height:"20px",borderRadius:r.radii.full,border:`1px solid ${n.isChecked?r.colors.brand.base:r.colors.border.strong}`,backgroundColor:r.colors.surface.default,flexShrink:0,...o},children:e.jsx("span",{style:{width:"10px",height:"10px",borderRadius:r.radii.full,backgroundColor:n.isChecked?r.colors.brand.base:"transparent",transition:"background-color 0.15s ease"}})})}function P({children:o}){const r=b();return g(),e.jsx("span",{style:{color:r.colors.text.primary,fontSize:r.fontSizes.small,fontWeight:r.fontWeights.medium,flex:1,minWidth:0},children:o})}function E({children:o}){const r=b();return e.jsx("span",{style:{color:r.colors.text.secondary,fontSize:r.fontSizes.xsmall},children:o})}const a=Object.assign(y,{Indicator:$,Label:P,Description:E});y.__docgenInfo={description:"",methods:[],displayName:"RadioRoot",props:{value:{required:!0,tsType:{name:"string"},description:""},checked:{required:!1,tsType:{name:"boolean"},description:""},defaultChecked:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},onCheckedChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(checked: boolean, value: string) => void",signature:{arguments:[{type:{name:"boolean"},name:"checked"},{type:{name:"string"},name:"value"}],return:{name:"void"}}},description:""},disabled:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},id:{required:!1,tsType:{name:"string"},description:""},name:{required:!1,tsType:{name:"string"},description:""},size:{required:!1,tsType:{name:"union",raw:"'sm' | 'md' | 'lg'",elements:[{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"}]},description:"",defaultValue:{value:"'md'",computed:!1}},children:{required:!0,tsType:{name:"ReactNode"},description:""}}};const _={title:"Form/Radio",component:a,tags:["autodocs"],parameters:{layout:"centered"},argTypes:{size:{control:{type:"select"},options:["sm","md","lg"]},disabled:{control:"boolean"}}},l={render:()=>e.jsxs(a.Root,{value:"opt1",id:"r1",children:[e.jsx(a.Indicator,{}),e.jsx(a.Label,{children:"Opção 1"})]})},c={render:()=>e.jsxs(a.Root,{value:"plan-pro",id:"r-pro",children:[e.jsx(a.Indicator,{}),e.jsxs("div",{children:[e.jsx(a.Label,{children:"Plano Pro"}),e.jsx(a.Description,{children:"R$ 49/mês — Recursos ilimitados"})]})]})},p={render:()=>e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:8},role:"radiogroup","aria-label":"Planos",children:[{value:"free",label:"Gratuito",description:"Até 3 projetos"},{value:"pro",label:"Pro",description:"R$ 49/mês"},{value:"enterprise",label:"Enterprise",description:"Sob consulta"}].map(o=>e.jsxs(a.Root,{value:o.value,id:`plan-${o.value}`,children:[e.jsx(a.Indicator,{}),e.jsxs("div",{children:[e.jsx(a.Label,{children:o.label}),e.jsx(a.Description,{children:o.description})]})]},o.value))})},u={render:()=>e.jsxs(a.Root,{value:"disabled",id:"r-disabled",disabled:!0,children:[e.jsx(a.Indicator,{}),e.jsx(a.Label,{children:"Opção desabilitada"})]})},m={render:()=>e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:8},children:["sm","md","lg"].map(o=>e.jsxs(a.Root,{value:o,id:`size-${o}`,size:o,children:[e.jsx(a.Indicator,{}),e.jsxs(a.Label,{children:["Tamanho ",o]})]},o))})};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <Radio.Root value="opt1" id="r1">\r
      <Radio.Indicator />\r
      <Radio.Label>Opção 1</Radio.Label>\r
    </Radio.Root>
}`,...l.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <Radio.Root value="plan-pro" id="r-pro">\r
      <Radio.Indicator />\r
      <div>\r
        <Radio.Label>Plano Pro</Radio.Label>\r
        <Radio.Description>R$ 49/mês — Recursos ilimitados</Radio.Description>\r
      </div>\r
    </Radio.Root>
}`,...c.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 8
  }} role="radiogroup" aria-label="Planos">\r
      {[{
      value: 'free',
      label: 'Gratuito',
      description: 'Até 3 projetos'
    }, {
      value: 'pro',
      label: 'Pro',
      description: 'R$ 49/mês'
    }, {
      value: 'enterprise',
      label: 'Enterprise',
      description: 'Sob consulta'
    }].map(plan => <Radio.Root key={plan.value} value={plan.value} id={\`plan-\${plan.value}\`}>\r
          <Radio.Indicator />\r
          <div>\r
            <Radio.Label>{plan.label}</Radio.Label>\r
            <Radio.Description>{plan.description}</Radio.Description>\r
          </div>\r
        </Radio.Root>)}\r
    </div>
}`,...p.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <Radio.Root value="disabled" id="r-disabled" disabled>\r
      <Radio.Indicator />\r
      <Radio.Label>Opção desabilitada</Radio.Label>\r
    </Radio.Root>
}`,...u.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 8
  }}>\r
      {(['sm', 'md', 'lg'] as const).map(size => <Radio.Root key={size} value={size} id={\`size-\${size}\`} size={size}>\r
          <Radio.Indicator />\r
          <Radio.Label>Tamanho {size}</Radio.Label>\r
        </Radio.Root>)}\r
    </div>
}`,...m.parameters?.docs?.source}}};const A=["Default","WithDescription","Group","Disabled","Sizes"];export{l as Default,u as Disabled,p as Group,m as Sizes,c as WithDescription,A as __namedExportsOrder,_ as default};
