import{u as n,j as e}from"./iframe-DkxCh0KI.js";import"./preload-helper-D9Z9MdNV.js";function i({children:l,scrollable:o=!1,style:s,...r}){const c=n(),m=e.jsx("table",{...r,style:{width:"100%",borderCollapse:"collapse",fontSize:c.fontSizes.sm,color:c.colors.text.primary,...s},children:l});return o?e.jsx("div",{style:{width:"100%",overflowX:"auto"},children:m}):m}function u({children:l,style:o,...s}){const r=n();return e.jsx("thead",{...s,style:{borderBottom:`2px solid ${r.colors.border.default}`,...o},children:l})}function T({children:l,style:o,...s}){return e.jsx("tbody",{...s,style:o,children:l})}function C({children:l,style:o,...s}){const r=n();return e.jsx("tr",{...s,style:{borderBottom:`1px solid ${r.colors.border.subtle}`,...o},children:l})}function p({children:l,style:o,...s}){const r=n();return e.jsx("td",{...s,style:{padding:`${r.space.small} ${r.space.medium}`,verticalAlign:"middle",...o},children:l})}function x({children:l,style:o,...s}){const r=n();return e.jsx("th",{scope:"col",...s,style:{padding:`${r.space.small} ${r.space.medium}`,textAlign:"left",fontWeight:r.fontWeights.medium,color:r.colors.text.secondary,verticalAlign:"middle",whiteSpace:"nowrap",...o},children:l})}const a=Object.assign(i,{Root:i,Head:u,Body:T,Row:C,Cell:p,HeaderCell:x});i.__docgenInfo={description:"",methods:[],displayName:"TableRoot",props:{children:{required:!0,tsType:{name:"ReactNode"},description:""},scrollable:{required:!1,tsType:{name:"boolean"},description:"Adiciona scroll horizontal quando o conteúdo excede o container",defaultValue:{value:"false",computed:!1}}},composes:["TableHTMLAttributes"]};const y={title:"Data/Table",component:a,tags:["autodocs"],parameters:{layout:"padded"}},b=[{id:1,name:"Ana Silva",email:"ana@exemplo.com",role:"Admin",status:"Ativo"},{id:2,name:"Bruno Costa",email:"bruno@exemplo.com",role:"Editor",status:"Ativo"},{id:3,name:"Carla Dias",email:"carla@exemplo.com",role:"Viewer",status:"Inativo"},{id:4,name:"Daniel Moura",email:"daniel@exemplo.com",role:"Editor",status:"Ativo"}],t={render:()=>e.jsxs(a,{children:[e.jsx(a.Head,{children:e.jsxs(a.Row,{children:[e.jsx(a.HeaderCell,{children:"Nome"}),e.jsx(a.HeaderCell,{children:"E-mail"}),e.jsx(a.HeaderCell,{children:"Função"}),e.jsx(a.HeaderCell,{children:"Status"})]})}),e.jsx(a.Body,{children:b.map(l=>e.jsxs(a.Row,{children:[e.jsx(a.Cell,{children:l.name}),e.jsx(a.Cell,{children:l.email}),e.jsx(a.Cell,{children:l.role}),e.jsx(a.Cell,{children:l.status})]},l.id))})]})},d={render:()=>e.jsx("div",{style:{maxWidth:400},children:e.jsxs(a,{scrollable:!0,children:[e.jsx(a.Head,{children:e.jsx(a.Row,{children:["ID","Nome","E-mail","Função","Status","Criado em"].map(l=>e.jsx(a.HeaderCell,{children:l},l))})}),e.jsx(a.Body,{children:b.map(l=>e.jsxs(a.Row,{children:[e.jsx(a.Cell,{children:l.id}),e.jsx(a.Cell,{children:l.name}),e.jsx(a.Cell,{children:l.email}),e.jsx(a.Cell,{children:l.role}),e.jsx(a.Cell,{children:l.status}),e.jsx(a.Cell,{children:"2024-01-15"})]},l.id))})]})})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <Table>\r
      <Table.Head>\r
        <Table.Row>\r
          <Table.HeaderCell>Nome</Table.HeaderCell>\r
          <Table.HeaderCell>E-mail</Table.HeaderCell>\r
          <Table.HeaderCell>Função</Table.HeaderCell>\r
          <Table.HeaderCell>Status</Table.HeaderCell>\r
        </Table.Row>\r
      </Table.Head>\r
      <Table.Body>\r
        {users.map(user => <Table.Row key={user.id}>\r
            <Table.Cell>{user.name}</Table.Cell>\r
            <Table.Cell>{user.email}</Table.Cell>\r
            <Table.Cell>{user.role}</Table.Cell>\r
            <Table.Cell>{user.status}</Table.Cell>\r
          </Table.Row>)}\r
      </Table.Body>\r
    </Table>
}`,...t.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    maxWidth: 400
  }}>\r
      <Table scrollable>\r
        <Table.Head>\r
          <Table.Row>\r
            {['ID', 'Nome', 'E-mail', 'Função', 'Status', 'Criado em'].map(h => <Table.HeaderCell key={h}>{h}</Table.HeaderCell>)}\r
          </Table.Row>\r
        </Table.Head>\r
        <Table.Body>\r
          {users.map(user => <Table.Row key={user.id}>\r
              <Table.Cell>{user.id}</Table.Cell>\r
              <Table.Cell>{user.name}</Table.Cell>\r
              <Table.Cell>{user.email}</Table.Cell>\r
              <Table.Cell>{user.role}</Table.Cell>\r
              <Table.Cell>{user.status}</Table.Cell>\r
              <Table.Cell>2024-01-15</Table.Cell>\r
            </Table.Row>)}\r
        </Table.Body>\r
      </Table>\r
    </div>
}`,...d.parameters?.docs?.source}}};const H=["Default","Scrollable"];export{t as Default,d as Scrollable,H as __namedExportsOrder,y as default};
