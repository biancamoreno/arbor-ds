import{r as f,u as x,j as r}from"./iframe-DkxCh0KI.js";import"./preload-helper-D9Z9MdNV.js";const C=f.createContext({variant:"subtle",tone:"neutral",selected:!1,disabled:!1}),L=()=>f.useContext(C);function T(t,o,n,s){const e=s.colors,l=o==="brand";return t==="filled"?n?{backgroundColor:l?e.brand.base:e.text.primary,color:e.text.inverse,borderColor:"transparent"}:{backgroundColor:l?e.brand.subtle:e.background.subtle,color:l?e.brand.strong:e.text.primary,borderColor:"transparent"}:t==="outlined"?{backgroundColor:"transparent",color:n?l?e.brand.base:e.text.primary:e.text.secondary,borderColor:n?l?e.brand.base:e.text.primary:e.border.default}:{backgroundColor:n?l?e.brand.subtle:e.background.interactive:"transparent",color:n?l?e.brand.strong:e.text.primary:e.text.secondary,borderColor:e.border.subtle}}function h({children:t,variant:o="subtle",size:n="md",selected:s=!1,disabled:e=!1,tone:l="neutral",style:v,...g}){const i=x(),S=T(o,l,s,i),j=n==="sm"?"3px 8px":"5px 12px",R=n==="sm"?i.fontSizes.xsmall:i.fontSizes.sm;return r.jsx(C.Provider,{value:{variant:o,tone:l,selected:s,disabled:e},children:r.jsx("span",{...g,style:{display:"inline-flex",alignItems:"center",gap:"4px",borderRadius:i.radii.full,borderWidth:"1px",borderStyle:"solid",padding:j,fontSize:R,fontWeight:i.fontWeights.medium,lineHeight:1.4,whiteSpace:"nowrap",cursor:e?"not-allowed":"default",opacity:e?Number(i.opacity.medium):1,...S,...v},children:t})})}function k({children:t,style:o,...n}){return r.jsx("span",{...n,style:{lineHeight:"inherit",...o},children:t})}function I({children:t,style:o,...n}){return r.jsx("span",{"aria-hidden":"true",...n,style:{display:"inline-flex",alignItems:"center",flexShrink:0,...o},children:t})}function V({label:t="Remover",style:o,...n}){const s=x(),{disabled:e}=L();return r.jsx("button",{type:"button","aria-label":t,disabled:e,...n,style:{display:"inline-flex",alignItems:"center",justifyContent:"center",width:"14px",height:"14px",padding:0,border:"none",background:"none",cursor:e?"not-allowed":"pointer",color:"inherit",borderRadius:s.radii.full,flexShrink:0,...o},children:"×"})}const a=Object.assign(h,{Root:h,Label:k,Icon:I,Remove:V});h.__docgenInfo={description:"",methods:[],displayName:"ChipRoot",props:{children:{required:!0,tsType:{name:"ReactNode"},description:""},variant:{required:!1,tsType:{name:"union",raw:"'filled' | 'outlined' | 'subtle'",elements:[{name:"literal",value:"'filled'"},{name:"literal",value:"'outlined'"},{name:"literal",value:"'subtle'"}]},description:"",defaultValue:{value:"'subtle'",computed:!1}},size:{required:!1,tsType:{name:"union",raw:"'sm' | 'md'",elements:[{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"}]},description:"",defaultValue:{value:"'md'",computed:!1}},selected:{required:!1,tsType:{name:"boolean"},description:"Chip está selecionado/ativo",defaultValue:{value:"false",computed:!1}},disabled:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},tone:{required:!1,tsType:{name:"union",raw:"'neutral' | 'brand'",elements:[{name:"literal",value:"'neutral'"},{name:"literal",value:"'brand'"}]},description:"Tone semântico da cor",defaultValue:{value:"'neutral'",computed:!1}}},composes:["HTMLAttributes"]};const{fn:y}=__STORYBOOK_MODULE_TEST__,W={title:"Components/Chip",component:a,tags:["autodocs"],parameters:{layout:"centered"},argTypes:{variant:{control:{type:"select"},options:["filled","outlined","subtle"]},size:{control:{type:"select"},options:["sm","md"]},tone:{control:{type:"select"},options:["neutral","brand"]},selected:{control:"boolean"},disabled:{control:"boolean"}}},d={render:()=>r.jsx(a,{children:r.jsx(a.Label,{children:"React"})})},c={render:()=>r.jsxs(a,{children:[r.jsx(a.Label,{children:"TypeScript"}),r.jsx(a.Remove,{onClick:y(),label:"Remover TypeScript"})]})},p={render:()=>r.jsxs(a,{children:[r.jsx(a.Icon,{children:"⚡"}),r.jsx(a.Label,{children:"Vite"})]})},u={render:()=>r.jsx(a,{selected:!0,children:r.jsx(a.Label,{children:"Selecionado"})})},m={render:()=>r.jsx("div",{style:{display:"flex",gap:8},children:["filled","outlined","subtle"].map(t=>r.jsx(a,{variant:t,children:r.jsx(a.Label,{children:t})},t))})},b={render:()=>r.jsx("div",{style:{display:"flex",gap:8,flexWrap:"wrap"},children:["React","TypeScript","Vite","Storybook","Arbor DS"].map(t=>r.jsxs(a,{variant:"outlined",children:[r.jsx(a.Label,{children:t}),r.jsx(a.Remove,{onClick:y(),label:`Remover ${t}`})]},t))})};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <Chip>\r
      <Chip.Label>React</Chip.Label>\r
    </Chip>
}`,...d.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <Chip>\r
      <Chip.Label>TypeScript</Chip.Label>\r
      <Chip.Remove onClick={fn()} label="Remover TypeScript" />\r
    </Chip>
}`,...c.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <Chip>\r
      <Chip.Icon>⚡</Chip.Icon>\r
      <Chip.Label>Vite</Chip.Label>\r
    </Chip>
}`,...p.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <Chip selected>\r
      <Chip.Label>Selecionado</Chip.Label>\r
    </Chip>
}`,...u.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: 8
  }}>\r
      {(['filled', 'outlined', 'subtle'] as const).map(variant => <Chip key={variant} variant={variant}>\r
          <Chip.Label>{variant}</Chip.Label>\r
        </Chip>)}\r
    </div>
}`,...m.parameters?.docs?.source}}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap'
  }}>\r
      {['React', 'TypeScript', 'Vite', 'Storybook', 'Arbor DS'].map(tag => <Chip key={tag} variant="outlined">\r
          <Chip.Label>{tag}</Chip.Label>\r
          <Chip.Remove onClick={fn()} label={\`Remover \${tag}\`} />\r
        </Chip>)}\r
    </div>
}`,...b.parameters?.docs?.source}}};const q=["Default","WithRemove","WithIcon","Selected","AllVariants","Tags"];export{m as AllVariants,d as Default,u as Selected,b as Tags,p as WithIcon,c as WithRemove,q as __namedExportsOrder,W as default};
