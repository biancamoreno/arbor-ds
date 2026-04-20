import{r as D,u as z,j as e}from"./iframe-DkxCh0KI.js";import{u as $}from"./use-controllable-state-BCpRlVAk.js";import{u as N}from"./field-context-Cg-4C5YY.js";import"./preload-helper-D9Z9MdNV.js";const E={sm:{width:36,height:20,padding:2},md:{width:44,height:24,padding:2},lg:{width:52,height:28,padding:2}},F={sm:16,md:20,lg:24};function m({checked:i,defaultChecked:g=!1,onChange:x,disabled:y,id:S,name:w,value:T,size:b="md",children:k,"aria-label":j,"aria-labelledby":v}){const R=D.useId(),r=N(),C=r?.fieldId??S??R,o=y??r?.isDisabled??!1,l=z(),[t,f]=$({value:i,defaultValue:g,onChange:x}),s=E[b],u=F[b],I=t?s.width-u-s.padding*2:0;return e.jsxs("span",{style:{display:"inline-flex",alignItems:"center",gap:l.space.tiny,cursor:o?"not-allowed":"pointer",opacity:o?.6:1,userSelect:"none"},children:[e.jsx("input",{id:C,type:"checkbox",role:"switch",name:w,value:T,checked:t,disabled:o,"aria-checked":t,"aria-label":j,"aria-labelledby":v,"aria-describedby":r?.descriptionId,"aria-required":r?.isRequired||void 0,"aria-invalid":r?.isInvalid||void 0,"aria-errormessage":r?.isInvalid?r.errorId:void 0,onChange:q=>f(q.target.checked),style:{position:"absolute",opacity:0,width:0,height:0,pointerEvents:"none"}}),e.jsx("span",{onClick:()=>!o&&f(!t),style:{display:"inline-flex",alignItems:"center",width:`${s.width}px`,height:`${s.height}px`,padding:`${s.padding}px`,borderRadius:"9999px",backgroundColor:t?l.colors.interactive.default:l.colors.border.strong,transition:"background-color 0.2s ease",boxSizing:"border-box"},"aria-hidden":"true",children:e.jsx("span",{style:{display:"block",width:`${u}px`,height:`${u}px`,borderRadius:"9999px",backgroundColor:l.colors.surface.default,transform:`translateX(${I}px)`,transition:"transform 0.2s ease",flexShrink:0}})}),k]})}m.displayName="Switch.Root";const a=Object.assign(m,{Root:m});m.__docgenInfo={description:"",methods:[],displayName:"Switch.Root",props:{checked:{required:!1,tsType:{name:"boolean"},description:""},defaultChecked:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},onChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(checked: boolean) => void",signature:{arguments:[{type:{name:"boolean"},name:"checked"}],return:{name:"void"}}},description:""},disabled:{required:!1,tsType:{name:"boolean"},description:""},id:{required:!1,tsType:{name:"string"},description:""},name:{required:!1,tsType:{name:"string"},description:""},value:{required:!1,tsType:{name:"string"},description:""},size:{required:!1,tsType:{name:"union",raw:"'sm' | 'md' | 'lg'",elements:[{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"}]},description:"",defaultValue:{value:"'md'",computed:!1}},children:{required:!1,tsType:{name:"ReactNode"},description:""},"aria-label":{required:!1,tsType:{name:"string"},description:""},"aria-labelledby":{required:!1,tsType:{name:"string"},description:""}}};const O={title:"Form/Switch",component:a,tags:["autodocs"],parameters:{layout:"centered"},argTypes:{size:{control:{type:"select"},options:["sm","md","lg"]},disabled:{control:"boolean"}}},d={render:()=>e.jsx(a.Root,{"aria-label":"Notificações",children:e.jsx(a.Track,{children:e.jsx(a.Thumb,{})})})},n={render:()=>e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8},children:[e.jsx(a.Root,{id:"notif","aria-labelledby":"notif-label",children:e.jsx(a.Track,{children:e.jsx(a.Thumb,{})})}),e.jsx("label",{id:"notif-label",htmlFor:"notif",children:"Receber notificações"})]})},c={render:()=>e.jsx(a.Root,{defaultChecked:!0,"aria-label":"Ativo por padrão",children:e.jsx(a.Track,{children:e.jsx(a.Thumb,{})})})},h={render:()=>e.jsxs("div",{style:{display:"flex",gap:16},children:[e.jsx(a.Root,{disabled:!0,"aria-label":"Desabilitado desligado",children:e.jsx(a.Track,{children:e.jsx(a.Thumb,{})})}),e.jsx(a.Root,{disabled:!0,defaultChecked:!0,"aria-label":"Desabilitado ligado",children:e.jsx(a.Track,{children:e.jsx(a.Thumb,{})})})]})},p={render:()=>e.jsx("div",{style:{display:"flex",gap:16,alignItems:"center"},children:["sm","md","lg"].map(i=>e.jsx(a.Root,{size:i,"aria-label":`Tamanho ${i}`,children:e.jsx(a.Track,{children:e.jsx(a.Thumb,{})})},i))})};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <Switch.Root aria-label="Notificações">\r
      <Switch.Track>\r
        <Switch.Thumb />\r
      </Switch.Track>\r
    </Switch.Root>
}`,...d.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: 8
  }}>\r
      <Switch.Root id="notif" aria-labelledby="notif-label">\r
        <Switch.Track>\r
          <Switch.Thumb />\r
        </Switch.Track>\r
      </Switch.Root>\r
      <label id="notif-label" htmlFor="notif">Receber notificações</label>\r
    </div>
}`,...n.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <Switch.Root defaultChecked aria-label="Ativo por padrão">\r
      <Switch.Track>\r
        <Switch.Thumb />\r
      </Switch.Track>\r
    </Switch.Root>
}`,...c.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: 16
  }}>\r
      <Switch.Root disabled aria-label="Desabilitado desligado">\r
        <Switch.Track><Switch.Thumb /></Switch.Track>\r
      </Switch.Root>\r
      <Switch.Root disabled defaultChecked aria-label="Desabilitado ligado">\r
        <Switch.Track><Switch.Thumb /></Switch.Track>\r
      </Switch.Root>\r
    </div>
}`,...h.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: 16,
    alignItems: 'center'
  }}>\r
      {(['sm', 'md', 'lg'] as const).map(size => <Switch.Root key={size} size={size} aria-label={\`Tamanho \${size}\`}>\r
          <Switch.Track><Switch.Thumb /></Switch.Track>\r
        </Switch.Root>)}\r
    </div>
}`,...p.parameters?.docs?.source}}};const W=["Default","WithLabel","Checked","Disabled","Sizes"];export{c as Checked,d as Default,h as Disabled,p as Sizes,n as WithLabel,W as __namedExportsOrder,O as default};
