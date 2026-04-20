import{r as A,u as a,j as e}from"./iframe-DkxCh0KI.js";import"./preload-helper-D9Z9MdNV.js";const x=A.createContext({tone:"info"}),b=()=>A.useContext(x);function g(n,s){const r=s.colors;return{info:{bg:"transparent",border:r.status.info,text:r.text.primary,icon:r.status.info},success:{bg:r.feedback.success.subtle,border:r.feedback.success.base,text:r.feedback.success.strong,icon:r.feedback.success.base},warning:{bg:r.feedback.warning.subtle,border:r.feedback.warning.base,text:r.feedback.warning.strong,icon:r.feedback.warning.base},critical:{bg:r.feedback.critical.subtle,border:r.feedback.critical.base,text:r.feedback.critical.strong,icon:r.feedback.critical.base}}[n]}function f({children:n,tone:s="info",style:r,...o}){const i=a(),c=g(s,i),h=s==="critical"?"alert":"status";return e.jsx(x.Provider,{value:{tone:s},children:e.jsx("div",{role:h,...o,style:{display:"flex",alignItems:"flex-start",gap:i.space.small,padding:`${i.space.small} ${i.space.medium}`,borderRadius:i.radii.small,borderLeftWidth:"4px",borderLeftStyle:"solid",borderLeftColor:c.border,backgroundColor:c.bg,color:c.text,...r},children:n})})}function j({children:n,style:s,...r}){const o=a(),{tone:i}=b(),c=g(i,o);return e.jsx("span",{"aria-hidden":"true",...r,style:{display:"inline-flex",alignItems:"center",flexShrink:0,color:c.icon,...s},children:n})}function T({children:n,style:s,...r}){const o=a();return e.jsx("p",{...r,style:{margin:0,fontWeight:o.fontWeights.medium,fontSize:o.fontSizes.small,lineHeight:"20px",...s},children:n})}function y({children:n,style:s,...r}){const o=a();return e.jsx("p",{...r,style:{margin:0,fontSize:o.fontSizes.sm,color:"inherit",lineHeight:"20px",...s},children:n})}function I({label:n="Fechar",style:s,...r}){const o=a();return e.jsx("button",{type:"button","aria-label":n,...r,style:{marginLeft:"auto",flexShrink:0,display:"inline-flex",alignItems:"center",justifyContent:"center",width:"20px",height:"20px",padding:0,border:"none",background:"none",cursor:"pointer",color:"inherit",borderRadius:o.radii.nano,...s},children:"×"})}const t=Object.assign(f,{Root:f,Icon:j,Title:T,Description:y,Close:I});f.__docgenInfo={description:"",methods:[],displayName:"AlertRoot",props:{children:{required:!0,tsType:{name:"ReactNode"},description:""},tone:{required:!1,tsType:{name:"union",raw:"'info' | 'success' | 'warning' | 'critical'",elements:[{name:"literal",value:"'info'"},{name:"literal",value:"'success'"},{name:"literal",value:"'warning'"},{name:"literal",value:"'critical'"}]},description:"",defaultValue:{value:"'info'",computed:!1}}},composes:["HTMLAttributes"]};const v={title:"Feedback/Alert",component:t,tags:["autodocs"],parameters:{layout:"padded"},argTypes:{tone:{control:{type:"select"},options:["info","success","warning","critical"]}}},l={render:()=>e.jsxs(t,{tone:"info",children:[e.jsx(t.Icon,{children:"ℹ️"}),e.jsx(t.Title,{children:"Informação"}),e.jsx(t.Description,{children:"Esta é uma mensagem informativa para o usuário."})]})},d={render:()=>e.jsxs(t,{tone:"success",children:[e.jsx(t.Icon,{children:"✅"}),e.jsx(t.Title,{children:"Sucesso!"}),e.jsx(t.Description,{children:"A operação foi concluída com sucesso."})]})},u={render:()=>e.jsxs(t,{tone:"warning",children:[e.jsx(t.Icon,{children:"⚠️"}),e.jsx(t.Title,{children:"Atenção"}),e.jsx(t.Description,{children:"Verifique as informações antes de continuar."})]})},p={render:()=>e.jsxs(t,{tone:"critical",children:[e.jsx(t.Icon,{children:"🚨"}),e.jsx(t.Title,{children:"Erro crítico"}),e.jsx(t.Description,{children:"Ocorreu um erro. Por favor, tente novamente."}),e.jsx(t.Close,{})]})},m={render:()=>e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:12,width:400},children:["info","success","warning","critical"].map(n=>e.jsxs(t,{tone:n,children:[e.jsx(t.Title,{children:n.charAt(0).toUpperCase()+n.slice(1)}),e.jsxs(t.Description,{children:["Mensagem de alerta do tipo ",n,"."]})]},n))})};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <Alert tone="info">\r
      <Alert.Icon>ℹ️</Alert.Icon>\r
      <Alert.Title>Informação</Alert.Title>\r
      <Alert.Description>Esta é uma mensagem informativa para o usuário.</Alert.Description>\r
    </Alert>
}`,...l.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <Alert tone="success">\r
      <Alert.Icon>✅</Alert.Icon>\r
      <Alert.Title>Sucesso!</Alert.Title>\r
      <Alert.Description>A operação foi concluída com sucesso.</Alert.Description>\r
    </Alert>
}`,...d.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <Alert tone="warning">\r
      <Alert.Icon>⚠️</Alert.Icon>\r
      <Alert.Title>Atenção</Alert.Title>\r
      <Alert.Description>Verifique as informações antes de continuar.</Alert.Description>\r
    </Alert>
}`,...u.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <Alert tone="critical">\r
      <Alert.Icon>🚨</Alert.Icon>\r
      <Alert.Title>Erro crítico</Alert.Title>\r
      <Alert.Description>Ocorreu um erro. Por favor, tente novamente.</Alert.Description>\r
      <Alert.Close />\r
    </Alert>
}`,...p.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    width: 400
  }}>\r
      {(['info', 'success', 'warning', 'critical'] as const).map(tone => <Alert key={tone} tone={tone}>\r
          <Alert.Title>{tone.charAt(0).toUpperCase() + tone.slice(1)}</Alert.Title>\r
          <Alert.Description>Mensagem de alerta do tipo {tone}.</Alert.Description>\r
        </Alert>)}\r
    </div>
}`,...m.parameters?.docs?.source}}};const w=["Info","Success","Warning","Critical","AllTones"];export{m as AllTones,p as Critical,l as Info,d as Success,u as Warning,w as __namedExportsOrder,v as default};
