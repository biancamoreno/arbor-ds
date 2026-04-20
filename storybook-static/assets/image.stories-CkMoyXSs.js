import{j as a}from"./iframe-DkxCh0KI.js";import{I as s}from"./image-B2zvFNb-.js";import"./preload-helper-D9Z9MdNV.js";import"./box-Dm3A0a77.js";const m={title:"Core/Layout/Image",component:s,tags:["autodocs"],parameters:{layout:"centered"},argTypes:{resizeMode:{control:{type:"select"},options:["cover","contain","stretch","center"]}}},t="https://placehold.co/400x250/4a90e2/ffffff?text=Arbor+DS",e={args:{source:t,width:400,height:250,alt:"Imagem de exemplo",resizeMode:"cover"}},r={args:{source:t,width:400,height:250,alt:"Contain mode",resizeMode:"contain"}},o={render:()=>a.jsx(s,{source:t,width:400,height:250,alt:"Com overlay",children:a.jsx("div",{style:{position:"absolute",bottom:0,left:0,right:0,padding:"12px 16px",background:"rgba(0,0,0,0.6)",color:"#fff"},children:"Legenda da imagem"})})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    source: PLACEHOLDER,
    width: 400,
    height: 250,
    alt: 'Imagem de exemplo',
    resizeMode: 'cover'
  }
}`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    source: PLACEHOLDER,
    width: 400,
    height: 250,
    alt: 'Contain mode',
    resizeMode: 'contain'
  }
}`,...r.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <Image source={PLACEHOLDER} width={400} height={250} alt="Com overlay">\r
      <div style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: '12px 16px',
      background: 'rgba(0,0,0,0.6)',
      color: '#fff'
    }}>\r
        Legenda da imagem\r
      </div>\r
    </Image>
}`,...o.parameters?.docs?.source}}};const p=["Default","Contain","WithOverlay"];export{r as Contain,e as Default,o as WithOverlay,p as __namedExportsOrder,m as default};
