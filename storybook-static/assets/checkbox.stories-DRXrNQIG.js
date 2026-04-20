import{r as h,R as g,j as e,u as k}from"./iframe-DkxCh0KI.js";import{u as N}from"./use-controllable-state-BCpRlVAk.js";import{u as v}from"./field-context-Cg-4C5YY.js";import"./preload-helper-D9Z9MdNV.js";const D=h.createContext(null);function T(){const r=h.useContext(D);if(!r)throw new Error("useCheckboxContext must be used inside Checkbox.Root");return r}function L({checked:r,defaultChecked:s=!1,onChange:n,disabled:l,indeterminate:t=!1,id:i,name:c,value:a,children:f}){const x=h.useId(),d=v(),j=d?.fieldId??i??x,R=l??d?.isDisabled??!1,[O,E]=N({value:r,defaultValue:s,onChange:n}),q=k();return e.jsx(D.Provider,{value:{isChecked:O,isIndeterminate:t,isDisabled:R,inputId:j,onChange:E},children:e.jsx("label",{style:{display:"inline-flex",alignItems:"flex-start",gap:"10px",cursor:R?"not-allowed":"pointer",opacity:R?.6:1,color:q.colors.text.primary},htmlFor:j,children:f})})}const I=g.forwardRef(({style:r,...s},n)=>{const l=k(),t=T(),i=v(),c=h.useRef(null);return h.useEffect(()=>{c.current&&(c.current.indeterminate=t.isIndeterminate&&!t.isChecked)},[t.isChecked,t.isIndeterminate]),e.jsx("input",{...s,ref:a=>{c.current=a,typeof n=="function"?n(a):n&&(n.current=a)},id:t.inputId,type:"checkbox",checked:t.isChecked,disabled:t.isDisabled,"aria-describedby":i?.descriptionId,"aria-required":i?.isRequired||void 0,"aria-invalid":i?.isInvalid||void 0,"aria-errormessage":i?.isInvalid?i.errorId:void 0,onChange:a=>{t.isDisabled||t.onChange(a.target.checked)},style:{width:"18px",height:"18px",marginTop:"2px",accentColor:l.colors.interactive.default,cursor:t.isDisabled?"not-allowed":"pointer",flexShrink:0,...r}})});I.displayName="Checkbox.Indicator";function S({children:r}){const s=k();return e.jsx("span",{style:{fontSize:s.fontSizes.small,color:s.colors.text.primary},children:r})}function w({children:r}){const s=k();return e.jsx("span",{style:{fontSize:s.fontSizes.xsmall,color:s.colors.text.secondary},children:r})}const y=g.forwardRef(({label:r,description:s,indeterminate:n,checked:l,disabled:t,style:i,onChange:c,...a},f)=>{const x=c?d=>c(d):void 0;return e.jsxs(L,{checked:l,defaultChecked:a.defaultChecked,onChange:x?d=>{x&&x({target:{checked:d}})}:void 0,disabled:t,indeterminate:n,id:a.id,name:a.name,value:a.value,children:[e.jsx(I,{ref:f,style:i}),(r||s)&&e.jsxs("span",{style:{display:"flex",flexDirection:"column",gap:"2px"},children:[r&&e.jsx(S,{children:r}),s&&e.jsx(w,{children:s})]})]})});y.displayName="Checkbox";const o=Object.assign(y,{Root:L,Indicator:I,Label:S,Description:w});y.__docgenInfo={description:"@deprecated Use the compound Checkbox.Root / Checkbox.Indicator / Checkbox.Label pattern.",methods:[],displayName:"Checkbox",props:{label:{required:!1,tsType:{name:"ReactNode"},description:""},description:{required:!1,tsType:{name:"ReactNode"},description:""},indeterminate:{required:!1,tsType:{name:"boolean"},description:""}},composes:["Omit"]};const B={title:"Form/Checkbox",component:o,tags:["autodocs"],parameters:{layout:"centered"}},b={render:()=>e.jsxs(o.Root,{id:"accept",children:[e.jsx(o.Indicator,{}),e.jsx(o.Label,{children:"Aceitar os termos e condições"})]})},p={render:()=>e.jsxs(o.Root,{id:"newsletter",children:[e.jsx(o.Indicator,{}),e.jsxs("div",{children:[e.jsx(o.Label,{children:"Receber novidades"}),e.jsx(o.Description,{children:"Enviaremos no máximo 1 e-mail por semana."})]})]})},m={render:()=>e.jsxs(o.Root,{id:"indeterminate",indeterminate:!0,children:[e.jsx(o.Indicator,{}),e.jsx(o.Label,{children:"Selecionar alguns itens"})]})},u={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:8},children:[e.jsxs(o.Root,{id:"disabled-unchecked",disabled:!0,children:[e.jsx(o.Indicator,{}),e.jsx(o.Label,{children:"Desabilitado (desmarcado)"})]}),e.jsxs(o.Root,{id:"disabled-checked",disabled:!0,defaultChecked:!0,children:[e.jsx(o.Indicator,{}),e.jsx(o.Label,{children:"Desabilitado (marcado)"})]})]})},C={render:()=>e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:8},children:["Opção A","Opção B","Opção C"].map(r=>e.jsxs(o.Root,{id:`group-${r}`,children:[e.jsx(o.Indicator,{}),e.jsx(o.Label,{children:r})]},r))})};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => <Checkbox.Root id="accept">\r
      <Checkbox.Indicator />\r
      <Checkbox.Label>Aceitar os termos e condições</Checkbox.Label>\r
    </Checkbox.Root>
}`,...b.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <Checkbox.Root id="newsletter">\r
      <Checkbox.Indicator />\r
      <div>\r
        <Checkbox.Label>Receber novidades</Checkbox.Label>\r
        <Checkbox.Description>Enviaremos no máximo 1 e-mail por semana.</Checkbox.Description>\r
      </div>\r
    </Checkbox.Root>
}`,...p.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <Checkbox.Root id="indeterminate" indeterminate>\r
      <Checkbox.Indicator />\r
      <Checkbox.Label>Selecionar alguns itens</Checkbox.Label>\r
    </Checkbox.Root>
}`,...m.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 8
  }}>\r
      <Checkbox.Root id="disabled-unchecked" disabled>\r
        <Checkbox.Indicator />\r
        <Checkbox.Label>Desabilitado (desmarcado)</Checkbox.Label>\r
      </Checkbox.Root>\r
      <Checkbox.Root id="disabled-checked" disabled defaultChecked>\r
        <Checkbox.Indicator />\r
        <Checkbox.Label>Desabilitado (marcado)</Checkbox.Label>\r
      </Checkbox.Root>\r
    </div>
}`,...u.parameters?.docs?.source}}};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 8
  }}>\r
      {['Opção A', 'Opção B', 'Opção C'].map(opt => <Checkbox.Root key={opt} id={\`group-\${opt}\`}>\r
          <Checkbox.Indicator />\r
          <Checkbox.Label>{opt}</Checkbox.Label>\r
        </Checkbox.Root>)}\r
    </div>
}`,...C.parameters?.docs?.source}}};const G=["Default","WithDescription","Indeterminate","Disabled","Group"];export{b as Default,u as Disabled,C as Group,m as Indeterminate,p as WithDescription,G as __namedExportsOrder,B as default};
