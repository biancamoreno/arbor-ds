import{j as r,u as o}from"./iframe-DkxCh0KI.js";import"./preload-helper-D9Z9MdNV.js";function i({children:a,label:n="Navegação estrutural",style:t,...s}){return r.jsx("nav",{"aria-label":n,...s,style:{display:"inline-flex",...t},children:a})}function u({children:a,style:n,...t}){return r.jsx("ol",{...t,style:{display:"flex",alignItems:"center",flexWrap:"wrap",gap:"4px",listStyle:"none",margin:0,padding:0,...n},children:a})}function l({children:a,style:n,...t}){return r.jsx("li",{...t,style:{display:"inline-flex",alignItems:"center",gap:"4px",...n},children:a})}function b({children:a,style:n,...t}){const s=o();return r.jsx("a",{...t,style:{color:s.colors.interactive.default,textDecoration:"none",fontSize:s.fontSizes.sm,...n},children:a})}function B({children:a,style:n,...t}){const s=o();return r.jsx("span",{"aria-current":"page",...t,style:{color:s.colors.text.primary,fontSize:s.fontSizes.sm,fontWeight:s.fontWeights.medium,...n},children:a})}function p({children:a="/",style:n,...t}){const s=o();return r.jsx("span",{"aria-hidden":"true",role:"presentation",...t,style:{color:s.colors.text.tertiary,fontSize:s.fontSizes.sm,userSelect:"none",...n},children:a})}const e=Object.assign(i,{Root:i,List:u,Item:l,Link:b,Current:B,Separator:p});i.__docgenInfo={description:"",methods:[],displayName:"BreadcrumbRoot",props:{children:{required:!0,tsType:{name:"ReactNode"},description:""},label:{required:!1,tsType:{name:"string"},description:'@default "Navegação estrutural"',defaultValue:{value:"'Navegação estrutural'",computed:!1}}},composes:["HTMLAttributes"]};const f={title:"Navigation/Breadcrumb",component:e,tags:["autodocs"],parameters:{layout:"padded"}},c={render:()=>r.jsx(e,{children:r.jsxs(e.List,{children:[r.jsxs(e.Item,{children:[r.jsx(e.Link,{href:"#",children:"Início"}),r.jsx(e.Separator,{})]}),r.jsxs(e.Item,{children:[r.jsx(e.Link,{href:"#",children:"Produtos"}),r.jsx(e.Separator,{})]}),r.jsx(e.Item,{children:r.jsx(e.Current,{children:"Camiseta Azul"})})]})})},d={render:()=>r.jsx(e,{children:r.jsxs(e.List,{children:[r.jsxs(e.Item,{children:[r.jsx(e.Link,{href:"#",children:"Home"}),r.jsx(e.Separator,{children:"›"})]}),r.jsxs(e.Item,{children:[r.jsx(e.Link,{href:"#",children:"Categorias"}),r.jsx(e.Separator,{children:"›"})]}),r.jsx(e.Item,{children:r.jsx(e.Current,{children:"Design Systems"})})]})})},m={render:()=>r.jsx(e,{children:r.jsxs(e.List,{children:[r.jsxs(e.Item,{children:[r.jsx(e.Link,{href:"#",children:"Início"}),r.jsx(e.Separator,{})]}),r.jsxs(e.Item,{children:[r.jsx(e.Link,{href:"#",children:"Minha Conta"}),r.jsx(e.Separator,{})]}),r.jsxs(e.Item,{children:[r.jsx(e.Link,{href:"#",children:"Pedidos"}),r.jsx(e.Separator,{})]}),r.jsx(e.Item,{children:r.jsx(e.Current,{children:"Pedido #12345"})})]})})};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <Breadcrumb>\r
      <Breadcrumb.List>\r
        <Breadcrumb.Item>\r
          <Breadcrumb.Link href="#">Início</Breadcrumb.Link>\r
          <Breadcrumb.Separator />\r
        </Breadcrumb.Item>\r
        <Breadcrumb.Item>\r
          <Breadcrumb.Link href="#">Produtos</Breadcrumb.Link>\r
          <Breadcrumb.Separator />\r
        </Breadcrumb.Item>\r
        <Breadcrumb.Item>\r
          <Breadcrumb.Current>Camiseta Azul</Breadcrumb.Current>\r
        </Breadcrumb.Item>\r
      </Breadcrumb.List>\r
    </Breadcrumb>
}`,...c.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <Breadcrumb>\r
      <Breadcrumb.List>\r
        <Breadcrumb.Item>\r
          <Breadcrumb.Link href="#">Home</Breadcrumb.Link>\r
          <Breadcrumb.Separator>›</Breadcrumb.Separator>\r
        </Breadcrumb.Item>\r
        <Breadcrumb.Item>\r
          <Breadcrumb.Link href="#">Categorias</Breadcrumb.Link>\r
          <Breadcrumb.Separator>›</Breadcrumb.Separator>\r
        </Breadcrumb.Item>\r
        <Breadcrumb.Item>\r
          <Breadcrumb.Current>Design Systems</Breadcrumb.Current>\r
        </Breadcrumb.Item>\r
      </Breadcrumb.List>\r
    </Breadcrumb>
}`,...d.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <Breadcrumb>\r
      <Breadcrumb.List>\r
        <Breadcrumb.Item>\r
          <Breadcrumb.Link href="#">Início</Breadcrumb.Link>\r
          <Breadcrumb.Separator />\r
        </Breadcrumb.Item>\r
        <Breadcrumb.Item>\r
          <Breadcrumb.Link href="#">Minha Conta</Breadcrumb.Link>\r
          <Breadcrumb.Separator />\r
        </Breadcrumb.Item>\r
        <Breadcrumb.Item>\r
          <Breadcrumb.Link href="#">Pedidos</Breadcrumb.Link>\r
          <Breadcrumb.Separator />\r
        </Breadcrumb.Item>\r
        <Breadcrumb.Item>\r
          <Breadcrumb.Current>Pedido #12345</Breadcrumb.Current>\r
        </Breadcrumb.Item>\r
      </Breadcrumb.List>\r
    </Breadcrumb>
}`,...m.parameters?.docs?.source}}};const j=["Default","WithCustomSeparator","Long"];export{c as Default,m as Long,d as WithCustomSeparator,j as __namedExportsOrder,f as default};
