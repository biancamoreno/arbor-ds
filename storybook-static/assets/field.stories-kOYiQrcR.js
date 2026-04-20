import{u as N,j as e,A as m,R as C,r as _}from"./iframe-DkxCh0KI.js";import{u as h,F as S}from"./field-context-Cg-4C5YY.js";import{T as y}from"./textinput-BjoN5v6o.js";import"./preload-helper-D9Z9MdNV.js";function w(o){return"slots"in o}function j(o,r={}){const t=N().components?.[o];if(!t||typeof t!="object"||!w(t))return{};const a=t,{slots:c,base:l={},variants:p={},defaultVariants:s={}}=a,u={};for(const n of c)u[n]={...l[n]??{}};for(const[n,I]of Object.entries(p)){const R=r[n]??s[n];if(R!==void 0&&I[R])for(const[v,L]of Object.entries(I[R]))u[v]={...u[v]??{},...L}}return u}function g({children:o}){const r=h(),t=j("field",{}).label;return e.jsxs(m,{as:"label",htmlFor:r?.fieldId,color:r?.isInvalid?"feedback.critical.base":"text.primary",...t??{},children:[o,r?.isRequired&&e.jsx(m,{as:"span",color:"feedback.critical.base","aria-hidden":"true",children:" *"})]})}g.__docgenInfo={description:"",methods:[],displayName:"FieldLabel",props:{children:{required:!0,tsType:{name:"ReactNode"},description:""}}};function q({children:o}){const r=h();if(!r||!C.isValidElement(o))return e.jsx(e.Fragment,{children:o});const{fieldId:d,descriptionId:t,errorId:a,isDisabled:c,isRequired:l,isInvalid:p}=r,s={id:d,"aria-describedby":t};return l&&(s["aria-required"]=!0),p&&(s["aria-invalid"]=!0,s["aria-errormessage"]=a),c&&(s.disabled=!0),C.cloneElement(o,s)}q.__docgenInfo={description:"",methods:[],displayName:"FieldControl",props:{children:{required:!0,tsType:{name:"ReactNode"},description:""}}};function E({children:o}){const r=h(),t=j("field",{}).description;return e.jsx(m,{as:"p",id:r?.descriptionId,color:"text.secondary",...t??{},children:o})}E.__docgenInfo={description:"",methods:[],displayName:"FieldDescription",props:{children:{required:!0,tsType:{name:"ReactNode"},description:""}}};function T({children:o}){const r=h(),t=j("field",{}).error;return r&&!r.isInvalid?null:e.jsx(m,{as:"p",id:r?.errorId,role:"alert",color:"feedback.critical.base",...t??{},children:o})}T.__docgenInfo={description:"",methods:[],displayName:"FieldError",props:{children:{required:!0,tsType:{name:"ReactNode"},description:""}}};function D({id:o,isDisabled:r=!1,isRequired:d=!1,isInvalid:t=!1,children:a}){const c=_.useId(),l=o??c,p=`${l}-description`,s=`${l}-error`,n=j("field",{}).root;return e.jsx(S.Provider,{value:{fieldId:l,descriptionId:p,errorId:s,isDisabled:r,isRequired:d,isInvalid:t},children:e.jsx(m,{as:"div",...n??{},children:a})})}const i=Object.assign(D,{Label:g,Control:q,Description:E,Error:T});D.__docgenInfo={description:"",methods:[],displayName:"FieldRoot",props:{id:{required:!1,tsType:{name:"string"},description:""},isDisabled:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},isRequired:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},isInvalid:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},children:{required:!0,tsType:{name:"ReactNode"},description:""}}};const P={title:"Form/Field",component:i,tags:["autodocs"],parameters:{layout:"centered"}},f={render:()=>e.jsxs(i.Root,{id:"name-field",style:{width:320},children:[e.jsx(i.Label,{children:"Nome completo"}),e.jsx(i.Control,{children:e.jsx(y,{placeholder:"Digite seu nome"})}),e.jsx(i.Description,{children:"Como aparece no seu documento de identidade."})]})},b={render:()=>e.jsxs(i.Root,{id:"email-field",isRequired:!0,style:{width:320},children:[e.jsx(i.Label,{children:"E-mail *"}),e.jsx(i.Control,{children:e.jsx(y,{type:"email",placeholder:"seu@email.com"})})]})},F={render:()=>e.jsxs(i.Root,{id:"email-error",isInvalid:!0,style:{width:320},children:[e.jsx(i.Label,{children:"E-mail"}),e.jsx(i.Control,{children:e.jsx(y,{type:"email",value:"nao-e-email"})}),e.jsx(i.Error,{children:"Formato de e-mail inválido."})]})},x={render:()=>e.jsxs(i.Root,{id:"disabled-field",isDisabled:!0,style:{width:320},children:[e.jsx(i.Label,{children:"Campo desabilitado"}),e.jsx(i.Control,{children:e.jsx(y,{value:"Valor fixo",disabled:!0})})]})};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <Field.Root id="name-field" style={{
    width: 320
  }}>\r
      <Field.Label>Nome completo</Field.Label>\r
      <Field.Control>\r
        <TextInput placeholder="Digite seu nome" />\r
      </Field.Control>\r
      <Field.Description>Como aparece no seu documento de identidade.</Field.Description>\r
    </Field.Root>
}`,...f.parameters?.docs?.source}}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => <Field.Root id="email-field" isRequired style={{
    width: 320
  }}>\r
      <Field.Label>E-mail *</Field.Label>\r
      <Field.Control>\r
        <TextInput type="email" placeholder="seu@email.com" />\r
      </Field.Control>\r
    </Field.Root>
}`,...b.parameters?.docs?.source}}};F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  render: () => <Field.Root id="email-error" isInvalid style={{
    width: 320
  }}>\r
      <Field.Label>E-mail</Field.Label>\r
      <Field.Control>\r
        <TextInput type="email" value="nao-e-email" />\r
      </Field.Control>\r
      <Field.Error>Formato de e-mail inválido.</Field.Error>\r
    </Field.Root>
}`,...F.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => <Field.Root id="disabled-field" isDisabled style={{
    width: 320
  }}>\r
      <Field.Label>Campo desabilitado</Field.Label>\r
      <Field.Control>\r
        <TextInput value="Valor fixo" disabled />\r
      </Field.Control>\r
    </Field.Root>
}`,...x.parameters?.docs?.source}}};const W=["Default","Required","WithError","Disabled"];export{f as Default,x as Disabled,b as Required,F as WithError,W as __namedExportsOrder,P as default};
