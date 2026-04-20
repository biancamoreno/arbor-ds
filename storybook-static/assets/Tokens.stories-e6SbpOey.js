import{j as e,c as y,t as x,s as h,f,d as u}from"./iframe-DkxCh0KI.js";import"./preload-helper-D9Z9MdNV.js";const b={title:"Foundations/Tokens",tags:["autodocs"],parameters:{layout:"padded"}};function a({title:r,children:t}){return e.jsxs("div",{style:{marginBottom:40},children:[e.jsx("h2",{style:{fontSize:20,fontWeight:700,marginBottom:16,borderBottom:"1px solid #eee",paddingBottom:8},children:r}),t]})}function p({name:r,value:t}){return e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:4},children:[e.jsx("div",{style:{width:48,height:48,borderRadius:8,background:t,border:"1px solid rgba(0,0,0,0.1)"},title:t}),e.jsx("span",{style:{fontSize:11,color:"#666",textAlign:"center",maxWidth:60,wordBreak:"break-all"},children:r}),e.jsx("span",{style:{fontSize:10,color:"#999"},children:t})]})}function S({name:r,shades:t}){return e.jsxs("div",{style:{marginBottom:24},children:[e.jsx("p",{style:{fontSize:13,fontWeight:600,marginBottom:8,textTransform:"capitalize"},children:r}),e.jsx("div",{style:{display:"flex",gap:8,flexWrap:"wrap"},children:Object.entries(t).map(([i,s])=>e.jsx(p,{name:i,value:s},i))})]})}const n={name:"Primitive Colors",render:()=>e.jsx("div",{children:e.jsx(a,{title:"Escala de Cores Primitivas",children:Object.entries(y).map(([r,t])=>e.jsx(S,{name:r,shades:t},r))})})},o={name:"Semantic Colors",render:()=>e.jsx("div",{children:e.jsx(a,{title:"Cores Semânticas (Light Theme)",children:Object.entries(x).map(([r,t])=>e.jsxs("div",{style:{marginBottom:24},children:[e.jsx("p",{style:{fontSize:13,fontWeight:600,marginBottom:8,textTransform:"capitalize"},children:r}),e.jsx("div",{style:{display:"flex",gap:8,flexWrap:"wrap"},children:Object.entries(t).flatMap(([i,s])=>typeof s=="string"?[e.jsx(p,{name:i,value:s},i)]:Object.entries(s).map(([m,g])=>e.jsx(p,{name:`${i}.${m}`,value:g},`${i}.${m}`)))})]},r))})})},l={name:"Spacing Scale",render:()=>e.jsx(a,{title:"Escala de Espaçamento",children:e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:8},children:Object.entries(h).map(([r,t])=>e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:16},children:[e.jsxs("span",{style:{fontSize:12,color:"#666",width:40,textAlign:"right"},children:[r,"px"]}),e.jsx("div",{style:{width:t,height:20,background:"#4a90e2",borderRadius:2,minWidth:2}}),e.jsxs("span",{style:{fontSize:12,color:"#999"},children:[t,"px"]})]},r))})})},d={name:"Typography Scale",render:()=>e.jsx(a,{title:"Escala Tipográfica",children:e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:12},children:Object.entries(f).map(([r,t])=>e.jsxs("div",{style:{display:"flex",alignItems:"baseline",gap:16,borderBottom:"1px solid #f0f0f0",paddingBottom:8},children:[e.jsxs("span",{style:{fontSize:12,color:"#666",width:60},children:["fontSize.",r]}),e.jsx("span",{style:{fontSize:t,lineHeight:1.2},children:"Arbor Design System"}),e.jsxs("span",{style:{fontSize:11,color:"#999"},children:[t,"px"]})]},r))})})},c={name:"Border Radius Scale",render:()=>e.jsx(a,{title:"Escala de Border Radius",children:e.jsx("div",{style:{display:"flex",gap:16,flexWrap:"wrap",alignItems:"flex-end"},children:Object.entries(u).map(([r,t])=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:8},children:[e.jsx("div",{style:{width:64,height:64,background:"#4a90e2",borderRadius:t===1e3?"50%":t}}),e.jsxs("span",{style:{fontSize:11,color:"#666"},children:[r,"px"]})]},r))})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  name: 'Primitive Colors',
  render: () => <div>\r
      <Section title="Escala de Cores Primitivas">\r
        {Object.entries(color).map(([name, shades]) => <ColorPalette key={name} name={name} shades={shades as Record<string | number, string>} />)}\r
      </Section>\r
    </div>
}`,...n.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  name: 'Semantic Colors',
  render: () => <div>\r
      <Section title="Cores Semânticas (Light Theme)">\r
        {Object.entries(themeLightColors).map(([category, tokens]) => <div key={category} style={{
        marginBottom: 24
      }}>\r
            <p style={{
          fontSize: 13,
          fontWeight: 600,
          marginBottom: 8,
          textTransform: 'capitalize'
        }}>{category}</p>\r
            <div style={{
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap'
        }}>\r
              {Object.entries(tokens as Record<string, string | Record<string, string>>).flatMap(([key, value]) => typeof value === 'string' ? [<ColorSwatch key={key} name={key} value={value} />] : Object.entries(value as Record<string, string>).map(([subKey, subValue]) => <ColorSwatch key={\`\${key}.\${subKey}\`} name={\`\${key}.\${subKey}\`} value={subValue} />))}\r
            </div>\r
          </div>)}\r
      </Section>\r
    </div>
}`,...o.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  name: 'Spacing Scale',
  render: () => <Section title="Escala de Espaçamento">\r
      <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }}>\r
        {Object.entries(spacing).map(([key, value]) => <div key={key} style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16
      }}>\r
            <span style={{
          fontSize: 12,
          color: '#666',
          width: 40,
          textAlign: 'right'
        }}>{key}px</span>\r
            <div style={{
          width: value,
          height: 20,
          background: '#4a90e2',
          borderRadius: 2,
          minWidth: 2
        }} />\r
            <span style={{
          fontSize: 12,
          color: '#999'
        }}>{value}px</span>\r
          </div>)}\r
      </div>\r
    </Section>
}`,...l.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  name: 'Typography Scale',
  render: () => <Section title="Escala Tipográfica">\r
      <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }}>\r
        {Object.entries(fontSize).map(([key, value]) => <div key={key} style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: 16,
        borderBottom: '1px solid #f0f0f0',
        paddingBottom: 8
      }}>\r
            <span style={{
          fontSize: 12,
          color: '#666',
          width: 60
        }}>fontSize.{key}</span>\r
            <span style={{
          fontSize: value,
          lineHeight: 1.2
        }}>Arbor Design System</span>\r
            <span style={{
          fontSize: 11,
          color: '#999'
        }}>{value}px</span>\r
          </div>)}\r
      </div>\r
    </Section>
}`,...d.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  name: 'Border Radius Scale',
  render: () => <Section title="Escala de Border Radius">\r
      <div style={{
      display: 'flex',
      gap: 16,
      flexWrap: 'wrap',
      alignItems: 'flex-end'
    }}>\r
        {Object.entries(borderRadius).map(([key, value]) => <div key={key} style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8
      }}>\r
            <div style={{
          width: 64,
          height: 64,
          background: '#4a90e2',
          borderRadius: value === 1000 ? '50%' : value
        }} />\r
            <span style={{
          fontSize: 11,
          color: '#666'
        }}>{key}px</span>\r
          </div>)}\r
      </div>\r
    </Section>
}`,...c.parameters?.docs?.source}}};const k=["PrimitiveColors","SemanticColors","Spacing","Typography","BorderRadius"];export{c as BorderRadius,n as PrimitiveColors,o as SemanticColors,l as Spacing,d as Typography,k as __namedExportsOrder,b as default};
