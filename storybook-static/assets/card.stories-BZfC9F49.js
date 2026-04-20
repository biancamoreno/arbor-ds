import{u,j as e}from"./iframe-DkxCh0KI.js";import"./preload-helper-D9Z9MdNV.js";const y={none:"0",sm:"12px",md:"16px",lg:"24px"};function m({children:a,variant:d="outlined",padding:o="md",style:n,...x}){const p=u(),C={outlined:{border:`1px solid ${p.colors.border.subtle}`,boxShadow:"none"},elevated:{border:"none",boxShadow:"0 2px 8px rgba(0,0,0,0.10)"},flat:{border:"none",boxShadow:"none"}};return e.jsx("div",{...x,style:{display:"flex",flexDirection:"column",borderRadius:p.radii.medium,backgroundColor:p.colors.surface.default,overflow:"hidden",...C[d],...n},children:e.jsx("div",{style:{padding:y[o],display:"flex",flexDirection:"column",flex:1},children:a})})}function g({children:a,style:d,...o}){const n=u();return e.jsx("div",{...o,style:{paddingBottom:n.space.small,borderBottom:`1px solid ${n.colors.border.subtle}`,marginBottom:n.space.small,...d},children:a})}function h({children:a,style:d,...o}){return e.jsx("div",{...o,style:{flex:1,...d},children:a})}function v({children:a,style:d,...o}){const n=u();return e.jsx("div",{...o,style:{paddingTop:n.space.small,borderTop:`1px solid ${n.colors.border.subtle}`,marginTop:n.space.small,...d},children:a})}function f({children:a,style:d,...o}){return e.jsx("div",{...o,style:{margin:"-16px -16px 16px -16px",overflow:"hidden",...d},children:a})}const r=Object.assign(m,{Root:m,Header:g,Body:h,Footer:v,Media:f});m.__docgenInfo={description:"",methods:[],displayName:"CardRoot",props:{children:{required:!0,tsType:{name:"ReactNode"},description:""},variant:{required:!1,tsType:{name:"union",raw:"'outlined' | 'elevated' | 'flat'",elements:[{name:"literal",value:"'outlined'"},{name:"literal",value:"'elevated'"},{name:"literal",value:"'flat'"}]},description:"",defaultValue:{value:"'outlined'",computed:!1}},padding:{required:!1,tsType:{name:"union",raw:"'none' | 'sm' | 'md' | 'lg'",elements:[{name:"literal",value:"'none'"},{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"}]},description:"Padding interno padrão",defaultValue:{value:"'md'",computed:!1}}},composes:["HTMLAttributes"]};const w={title:"Components/Card",component:r,tags:["autodocs"],parameters:{layout:"centered"},argTypes:{variant:{control:{type:"select"},options:["outlined","elevated","flat"]},padding:{control:{type:"select"},options:["none","sm","md","lg"]}}},t={render:()=>e.jsxs(r,{variant:"outlined",padding:"md",style:{width:320},children:[e.jsx(r.Header,{children:e.jsx("strong",{children:"Título do card"})}),e.jsx(r.Body,{children:"Conteúdo principal do card com informações relevantes para o usuário."}),e.jsx(r.Footer,{children:e.jsx("small",{children:"Rodapé do card"})})]})},s={render:()=>e.jsxs(r,{variant:"elevated",padding:"md",style:{width:320},children:[e.jsx(r.Header,{children:e.jsx("strong",{children:"Card elevado"})}),e.jsx(r.Body,{children:"Card com sombra de elevação para destacar conteúdo."})]})},l={render:()=>e.jsxs(r,{variant:"flat",padding:"md",style:{width:320},children:[e.jsx(r.Header,{children:e.jsx("strong",{children:"Card plano"})}),e.jsx(r.Body,{children:"Card sem borda ou sombra, útil como container simples."})]})},i={render:()=>e.jsx("div",{style:{display:"flex",gap:16},children:["outlined","elevated","flat"].map(a=>e.jsxs(r,{variant:a,padding:"md",style:{width:200},children:[e.jsx(r.Header,{children:e.jsx("strong",{children:a})}),e.jsx(r.Body,{children:"Conteúdo do card"})]},a))})},c={render:()=>e.jsxs(r,{variant:"outlined",padding:"none",style:{width:320,overflow:"hidden"},children:[e.jsx(r.Media,{children:e.jsx("img",{src:"https://placehold.co/320x160/4a90e2/ffffff?text=Media",alt:"Media",style:{width:"100%",display:"block"}})}),e.jsx(r.Body,{style:{padding:16},children:"Card com imagem de capa e conteúdo abaixo."})]})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <Card variant="outlined" padding="md" style={{
    width: 320
  }}>\r
      <Card.Header>\r
        <strong>Título do card</strong>\r
      </Card.Header>\r
      <Card.Body>\r
        Conteúdo principal do card com informações relevantes para o usuário.\r
      </Card.Body>\r
      <Card.Footer>\r
        <small>Rodapé do card</small>\r
      </Card.Footer>\r
    </Card>
}`,...t.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => <Card variant="elevated" padding="md" style={{
    width: 320
  }}>\r
      <Card.Header>\r
        <strong>Card elevado</strong>\r
      </Card.Header>\r
      <Card.Body>\r
        Card com sombra de elevação para destacar conteúdo.\r
      </Card.Body>\r
    </Card>
}`,...s.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <Card variant="flat" padding="md" style={{
    width: 320
  }}>\r
      <Card.Header>\r
        <strong>Card plano</strong>\r
      </Card.Header>\r
      <Card.Body>\r
        Card sem borda ou sombra, útil como container simples.\r
      </Card.Body>\r
    </Card>
}`,...l.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: 16
  }}>\r
      {(['outlined', 'elevated', 'flat'] as const).map(variant => <Card key={variant} variant={variant} padding="md" style={{
      width: 200
    }}>\r
          <Card.Header><strong>{variant}</strong></Card.Header>\r
          <Card.Body>Conteúdo do card</Card.Body>\r
        </Card>)}\r
    </div>
}`,...i.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <Card variant="outlined" padding="none" style={{
    width: 320,
    overflow: 'hidden'
  }}>\r
      <Card.Media>\r
        <img src="https://placehold.co/320x160/4a90e2/ffffff?text=Media" alt="Media" style={{
        width: '100%',
        display: 'block'
      }} />\r
      </Card.Media>\r
      <Card.Body style={{
      padding: 16
    }}>\r
        Card com imagem de capa e conteúdo abaixo.\r
      </Card.Body>\r
    </Card>
}`,...c.parameters?.docs?.source}}};const B=["Outlined","Elevated","Flat","AllVariants","WithMedia"];export{i as AllVariants,s as Elevated,l as Flat,t as Outlined,c as WithMedia,B as __namedExportsOrder,w as default};
