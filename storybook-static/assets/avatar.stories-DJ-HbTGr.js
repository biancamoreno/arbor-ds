import{r as x,u as y,j as e,R as m}from"./iframe-DkxCh0KI.js";import"./preload-helper-D9Z9MdNV.js";const j=x.createContext({imageStatus:"idle",setImageStatus:()=>{}}),k={xs:24,sm:32,md:40,lg:48,xl:64};function b({size:s="md",shape:a="circle",children:l,style:n,...i}){const t=y(),[o,d]=x.useState("idle"),c=k[s];return e.jsx(j.Provider,{value:{imageStatus:o,setImageStatus:d},children:e.jsx("span",{...i,style:{display:"inline-flex",alignItems:"center",justifyContent:"center",width:`${c}px`,height:`${c}px`,borderRadius:a==="circle"?t.radii.full:t.radii.small,backgroundColor:t.colors.background.subtle,overflow:"hidden",flexShrink:0,userSelect:"none",...n},children:l})})}function F({src:s,alt:a,style:l,...n}){const{setImageStatus:i}=m.useContext(j);return e.jsx("img",{src:s,alt:a,onLoad:()=>i("loaded"),onError:()=>i("error"),...n,style:{width:"100%",height:"100%",objectFit:"cover",...l}})}function C({children:s,delayMs:a=0,style:l,...n}){const{imageStatus:i}=m.useContext(j),t=y(),[o,d]=m.useState(a===0);return m.useEffect(()=>{if(a===0)return;const c=setTimeout(()=>d(!0),a);return()=>clearTimeout(c)},[a]),!o||i==="loaded"?null:e.jsx("span",{"aria-hidden":"true",...n,style:{display:"flex",alignItems:"center",justifyContent:"center",width:"100%",height:"100%",fontSize:t.fontSizes.sm,fontWeight:t.fontWeights.medium,color:t.colors.text.secondary,...l},children:s})}function I({children:s,max:a,size:l="md",style:n,...i}){const t=y(),o=x.Children.toArray(s).filter(x.isValidElement),d=a!==void 0?o.slice(0,a):o,c=a!==void 0?o.length-a:0,f=k[l],S=Math.floor(f*.3);return e.jsxs("span",{...i,style:{display:"inline-flex",alignItems:"center",...n},children:[d.map((z,A)=>e.jsx("span",{style:{marginLeft:A===0?0:`-${S}px`,zIndex:d.length-A,position:"relative",borderRadius:t.radii.full,boxShadow:`0 0 0 2px ${t.colors.surface.default}`},children:m.cloneElement(z,{size:l})},A)),c>0&&e.jsxs("span",{style:{marginLeft:`-${S}px`,zIndex:0,position:"relative",display:"inline-flex",alignItems:"center",justifyContent:"center",width:`${f}px`,height:`${f}px`,borderRadius:t.radii.full,backgroundColor:t.colors.background.interactive,boxShadow:`0 0 0 2px ${t.colors.surface.default}`,fontSize:t.fontSizes.xsmall,fontWeight:t.fontWeights.medium,color:t.colors.text.secondary},children:["+",c]})]})}const r=Object.assign(b,{Root:b,Image:F,Fallback:C});b.__docgenInfo={description:"",methods:[],displayName:"AvatarRoot",props:{size:{required:!1,tsType:{name:"union",raw:"'xs' | 'sm' | 'md' | 'lg' | 'xl'",elements:[{name:"literal",value:"'xs'"},{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"},{name:"literal",value:"'xl'"}]},description:"",defaultValue:{value:"'md'",computed:!1}},shape:{required:!1,tsType:{name:"union",raw:"'circle' | 'square'",elements:[{name:"literal",value:"'circle'"},{name:"literal",value:"'square'"}]},description:"Forma do avatar",defaultValue:{value:"'circle'",computed:!1}},children:{required:!0,tsType:{name:"ReactNode"},description:""}},composes:["HTMLAttributes"]};I.__docgenInfo={description:"",methods:[],displayName:"AvatarGroup",props:{children:{required:!0,tsType:{name:"ReactNode"},description:""},max:{required:!1,tsType:{name:"number"},description:"Limite de avatares visíveis antes do contador"},size:{required:!1,tsType:{name:"AvatarRootProps['size']",raw:"AvatarRootProps['size']"},description:"Mesmo tamanho aplicado a todos os avatares filhos",defaultValue:{value:"'md'",computed:!1}}},composes:["HTMLAttributes"]};const R={title:"Components/Avatar",component:r,tags:["autodocs"],parameters:{layout:"centered"},argTypes:{size:{control:{type:"select"},options:["xs","sm","md","lg","xl"]},shape:{control:{type:"select"},options:["circle","square"]}}},p={render:()=>e.jsxs(r,{size:"md",children:[e.jsx(r.Image,{src:"https://i.pravatar.cc/80?img=1",alt:"Ana Silva"}),e.jsx(r.Fallback,{children:"AS"})]})},u={render:()=>e.jsxs(r,{size:"md",children:[e.jsx(r.Image,{src:"invalid-url",alt:"Usuário"}),e.jsx(r.Fallback,{children:"JD"})]})},v={render:()=>e.jsx("div",{style:{display:"flex",gap:12,alignItems:"center"},children:["xs","sm","md","lg","xl"].map(s=>e.jsxs(r,{size:s,children:[e.jsx(r.Image,{src:`https://i.pravatar.cc/80?img=${s.length}`,alt:"Usuário"}),e.jsx(r.Fallback,{children:s.toUpperCase()})]},s))})},h={render:()=>e.jsxs("div",{style:{display:"flex",gap:16},children:[e.jsx(r,{size:"lg",shape:"circle",children:e.jsx(r.Fallback,{children:"CI"})}),e.jsx(r,{size:"lg",shape:"square",children:e.jsx(r.Fallback,{children:"SQ"})})]})},g={render:()=>e.jsx(I,{max:4,children:Array.from({length:6},(s,a)=>e.jsxs(r,{size:"md",children:[e.jsx(r.Image,{src:`https://i.pravatar.cc/80?img=${a+1}`,alt:`Usuário ${a+1}`}),e.jsxs(r.Fallback,{children:["U",a+1]})]},a))})};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <Avatar size="md">\r
      <Avatar.Image src="https://i.pravatar.cc/80?img=1" alt="Ana Silva" />\r
      <Avatar.Fallback>AS</Avatar.Fallback>\r
    </Avatar>
}`,...p.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <Avatar size="md">\r
      <Avatar.Image src="invalid-url" alt="Usuário" />\r
      <Avatar.Fallback>JD</Avatar.Fallback>\r
    </Avatar>
}`,...u.parameters?.docs?.source}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: 12,
    alignItems: 'center'
  }}>\r
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map(size => <Avatar key={size} size={size}>\r
          <Avatar.Image src={\`https://i.pravatar.cc/80?img=\${size.length}\`} alt="Usuário" />\r
          <Avatar.Fallback>{size.toUpperCase()}</Avatar.Fallback>\r
        </Avatar>)}\r
    </div>
}`,...v.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: 16
  }}>\r
      <Avatar size="lg" shape="circle">\r
        <Avatar.Fallback>CI</Avatar.Fallback>\r
      </Avatar>\r
      <Avatar size="lg" shape="square">\r
        <Avatar.Fallback>SQ</Avatar.Fallback>\r
      </Avatar>\r
    </div>
}`,...h.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <AvatarGroup max={4}>\r
      {Array.from({
      length: 6
    }, (_, i) => <Avatar key={i} size="md">\r
          <Avatar.Image src={\`https://i.pravatar.cc/80?img=\${i + 1}\`} alt={\`Usuário \${i + 1}\`} />\r
          <Avatar.Fallback>U{i + 1}</Avatar.Fallback>\r
        </Avatar>)}\r
    </AvatarGroup>
}`,...g.parameters?.docs?.source}}};const T=["WithImage","WithFallback","Sizes","Shapes","Group"];export{g as Group,h as Shapes,v as Sizes,u as WithFallback,p as WithImage,T as __namedExportsOrder,R as default};
