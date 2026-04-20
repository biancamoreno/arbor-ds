import{r as c,j as e,u as S}from"./iframe-DkxCh0KI.js";import{u as k}from"./use-controllable-state-BCpRlVAk.js";import{u as I}from"./field-context-Cg-4C5YY.js";import"./preload-helper-D9Z9MdNV.js";function z(n=!1){const[l,r]=c.useState(n),o=c.useCallback(()=>r(!0),[]),a=c.useCallback(()=>r(!1),[]),i=c.useCallback(()=>r(s=>!s),[]);return{isOpen:l,open:o,close:a,toggle:i}}const y=c.createContext(null);function x(){const n=c.useContext(y);if(!n)throw new Error("useSelectContext must be used inside Select.Root");return n}const E={sm:"32px",md:"40px",lg:"48px"},q={sm:12,md:14,lg:16},P={sm:"0 12px",md:"0 16px",lg:"0 18px"};function h({value:n,defaultValue:l="",onValueChange:r,disabled:o,id:a,size:i="md",children:s}){const b=c.useId(),f=I(),j=f?.fieldId??a??b,C=o??f?.isDisabled??!1,[w,R]=k({value:n,defaultValue:l,onChange:r}),{isOpen:T,open:V,close:v}=z(!1),D=O=>{R(O),v()};return e.jsx(y.Provider,{value:{isOpen:T,selectedValue:w,isDisabled:C,inputId:j,size:i,open:V,close:v,select:D},children:e.jsx("div",{style:{position:"relative",width:"100%"},children:s})})}function $({children:n}){const l=S(),r=x(),o=I(),a=c.useRef(null),i=s=>{(s.key==="Enter"||s.key===" ")&&(s.preventDefault(),r.isOpen?r.close():r.open()),s.key==="Escape"&&r.close()};return e.jsxs("button",{ref:a,type:"button",id:r.inputId,role:"combobox","aria-expanded":r.isOpen,"aria-haspopup":"listbox","aria-describedby":o?.descriptionId,"aria-required":o?.isRequired||void 0,"aria-invalid":o?.isInvalid||void 0,"aria-errormessage":o?.isInvalid?o.errorId:void 0,disabled:r.isDisabled,onClick:()=>r.isOpen?r.close():r.open(),onKeyDown:i,style:{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",height:E[r.size],padding:P[r.size],fontSize:q[r.size],borderRadius:l.radii.nano,border:`1px solid ${o?.isInvalid?l.colors.feedback.critical.base:l.colors.border.default}`,backgroundColor:l.colors.surface.default,color:l.colors.text.primary,cursor:r.isDisabled?"not-allowed":"pointer",opacity:r.isDisabled?.6:1,outline:"none",boxSizing:"border-box"},children:[n,e.jsx("span",{"aria-hidden":"true",style:{marginLeft:8,fontSize:10},children:r.isOpen?"▲":"▼"})]})}function A({placeholder:n="Select..."}){const l=S(),r=x();return e.jsx("span",{style:{flex:1,textAlign:"left",color:r.selectedValue?l.colors.text.primary:l.colors.text.tertiary,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:r.selectedValue||n})}function L({children:n}){const l=S(),r=x(),o=c.useRef(null);return c.useEffect(()=>{if(!r.isOpen)return;const a=s=>{o.current&&!o.current.contains(s.target)&&r.close()},i=s=>{s.key==="Escape"&&r.close()};return document.addEventListener("mousedown",a),document.addEventListener("keydown",i),()=>{document.removeEventListener("mousedown",a),document.removeEventListener("keydown",i)}},[r.isOpen]),r.isOpen?e.jsx("ul",{ref:o,role:"listbox",style:{position:"absolute",top:"100%",left:0,right:0,zIndex:50,margin:"4px 0 0",padding:"4px 0",listStyle:"none",backgroundColor:l.colors.surface.default,border:`1px solid ${l.colors.border.default}`,borderRadius:l.radii.nano,boxShadow:"0 4px 12px rgba(0,0,0,0.1)",maxHeight:"200px",overflowY:"auto"},children:n}):null}function W({value:n,disabled:l=!1,children:r}){const o=S(),a=x(),i=a.selectedValue===n;return e.jsx("li",{role:"option","aria-selected":i,"aria-disabled":l||void 0,onClick:()=>!l&&a.select(n),onKeyDown:s=>{(s.key==="Enter"||s.key===" ")&&!l&&a.select(n)},tabIndex:l?-1:0,style:{display:"flex",alignItems:"center",padding:"8px 16px",fontSize:14,cursor:l?"not-allowed":"pointer",opacity:l?.5:1,backgroundColor:i?o.colors.brand.subtle:"transparent",color:o.colors.text.primary,outline:"none",userSelect:"none"},children:r})}const t=Object.assign(h,{Root:h,Trigger:$,Value:A,Content:L,Item:W});h.__docgenInfo={description:"",methods:[],displayName:"SelectRoot",props:{value:{required:!1,tsType:{name:"string"},description:""},defaultValue:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"''",computed:!1}},onValueChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(value: string) => void",signature:{arguments:[{type:{name:"string"},name:"value"}],return:{name:"void"}}},description:""},disabled:{required:!1,tsType:{name:"boolean"},description:""},id:{required:!1,tsType:{name:"string"},description:""},size:{required:!1,tsType:{name:"union",raw:"'sm' | 'md' | 'lg'",elements:[{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"}]},description:"",defaultValue:{value:"'md'",computed:!1}},placeholder:{required:!1,tsType:{name:"string"},description:""},children:{required:!0,tsType:{name:"ReactNode"},description:""}}};const H={title:"Form/Select",component:t,tags:["autodocs"],parameters:{layout:"centered"},argTypes:{size:{control:{type:"select"},options:["sm","md","lg"]},disabled:{control:"boolean"}}},d={render:()=>e.jsxs(t.Root,{placeholder:"Selecione uma opção",style:{width:280},children:[e.jsx(t.Trigger,{children:e.jsx(t.Value,{placeholder:"Selecione..."})}),e.jsxs(t.Content,{children:[e.jsx(t.Item,{value:"react",children:"React"}),e.jsx(t.Item,{value:"vue",children:"Vue"}),e.jsx(t.Item,{value:"angular",children:"Angular"}),e.jsx(t.Item,{value:"svelte",children:"Svelte"})]})]})},u={render:()=>e.jsxs(t.Root,{defaultValue:"react",style:{width:280},children:[e.jsx(t.Trigger,{children:e.jsx(t.Value,{})}),e.jsxs(t.Content,{children:[e.jsx(t.Item,{value:"react",children:"React"}),e.jsx(t.Item,{value:"vue",children:"Vue"}),e.jsx(t.Item,{value:"angular",children:"Angular"})]})]})},p={render:()=>e.jsxs(t.Root,{style:{width:280},children:[e.jsx(t.Trigger,{children:e.jsx(t.Value,{placeholder:"Plano..."})}),e.jsxs(t.Content,{children:[e.jsx(t.Item,{value:"free",children:"Gratuito"}),e.jsx(t.Item,{value:"pro",children:"Pro — R$ 49/mês"}),e.jsx(t.Item,{value:"enterprise",disabled:!0,children:"Enterprise (em breve)"})]})]})},m={render:()=>e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:12},children:["sm","md","lg"].map(n=>e.jsxs(t.Root,{size:n,style:{width:280},children:[e.jsx(t.Trigger,{children:e.jsx(t.Value,{placeholder:`Tamanho ${n}`})}),e.jsxs(t.Content,{children:[e.jsx(t.Item,{value:"opt1",children:"Opção 1"}),e.jsx(t.Item,{value:"opt2",children:"Opção 2"})]})]},n))})},g={render:()=>e.jsxs(t.Root,{disabled:!0,style:{width:280},children:[e.jsx(t.Trigger,{children:e.jsx(t.Value,{placeholder:"Desabilitado"})}),e.jsx(t.Content,{children:e.jsx(t.Item,{value:"opt1",children:"Opção 1"})})]})};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <Select.Root placeholder="Selecione uma opção" style={{
    width: 280
  }}>\r
      <Select.Trigger>\r
        <Select.Value placeholder="Selecione..." />\r
      </Select.Trigger>\r
      <Select.Content>\r
        <Select.Item value="react">React</Select.Item>\r
        <Select.Item value="vue">Vue</Select.Item>\r
        <Select.Item value="angular">Angular</Select.Item>\r
        <Select.Item value="svelte">Svelte</Select.Item>\r
      </Select.Content>\r
    </Select.Root>
}`,...d.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <Select.Root defaultValue="react" style={{
    width: 280
  }}>\r
      <Select.Trigger>\r
        <Select.Value />\r
      </Select.Trigger>\r
      <Select.Content>\r
        <Select.Item value="react">React</Select.Item>\r
        <Select.Item value="vue">Vue</Select.Item>\r
        <Select.Item value="angular">Angular</Select.Item>\r
      </Select.Content>\r
    </Select.Root>
}`,...u.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <Select.Root style={{
    width: 280
  }}>\r
      <Select.Trigger>\r
        <Select.Value placeholder="Plano..." />\r
      </Select.Trigger>\r
      <Select.Content>\r
        <Select.Item value="free">Gratuito</Select.Item>\r
        <Select.Item value="pro">Pro — R$ 49/mês</Select.Item>\r
        <Select.Item value="enterprise" disabled>Enterprise (em breve)</Select.Item>\r
      </Select.Content>\r
    </Select.Root>
}`,...p.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 12
  }}>\r
      {(['sm', 'md', 'lg'] as const).map(size => <Select.Root key={size} size={size} style={{
      width: 280
    }}>\r
          <Select.Trigger>\r
            <Select.Value placeholder={\`Tamanho \${size}\`} />\r
          </Select.Trigger>\r
          <Select.Content>\r
            <Select.Item value="opt1">Opção 1</Select.Item>\r
            <Select.Item value="opt2">Opção 2</Select.Item>\r
          </Select.Content>\r
        </Select.Root>)}\r
    </div>
}`,...m.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <Select.Root disabled style={{
    width: 280
  }}>\r
      <Select.Trigger>\r
        <Select.Value placeholder="Desabilitado" />\r
      </Select.Trigger>\r
      <Select.Content>\r
        <Select.Item value="opt1">Opção 1</Select.Item>\r
      </Select.Content>\r
    </Select.Root>
}`,...g.parameters?.docs?.source}}};const N=["Default","WithDefaultValue","WithDisabledItem","Sizes","Disabled"];export{d as Default,g as Disabled,m as Sizes,u as WithDefaultValue,p as WithDisabledItem,N as __namedExportsOrder,H as default};
