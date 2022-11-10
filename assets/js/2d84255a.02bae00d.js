"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[3928],{5162:(e,t,n)=>{n.d(t,{Z:()=>i});var a=n(7294),r=n(6010);const o="tabItem_Ymn6";function i(e){let{children:t,hidden:n,className:i}=e;return a.createElement("div",{role:"tabpanel",className:(0,r.Z)(o,i),hidden:n},t)}},5488:(e,t,n)=>{n.d(t,{Z:()=>c});var a=n(7462),r=n(7294),o=n(6010),i=n(2389),l=n(7392),d=n(7094),p=n(2466);const s="tabList__CuJ",m="tabItem_LNqP";function u(e){var t;const{lazy:n,block:i,defaultValue:u,values:c,groupId:k,className:h}=e,N=r.Children.map(e.children,(e=>{if((0,r.isValidElement)(e)&&"value"in e.props)return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)})),g=c??N.map((e=>{let{props:{value:t,label:n,attributes:a}}=e;return{value:t,label:n,attributes:a}})),b=(0,l.l)(g,((e,t)=>e.value===t.value));if(b.length>0)throw new Error(`Docusaurus error: Duplicate values "${b.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`);const v=null===u?u:u??(null==(t=N.find((e=>e.props.default)))?void 0:t.props.value)??N[0].props.value;if(null!==v&&!g.some((e=>e.value===v)))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${v}" but none of its children has the corresponding value. Available values are: ${g.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);const{tabGroupChoices:f,setTabGroupChoices:y}=(0,d.U)(),[C,x]=(0,r.useState)(v),w=[],{blockElementScrollPositionUntilNextRender:D}=(0,p.o5)();if(null!=k){const e=f[k];null!=e&&e!==C&&g.some((t=>t.value===e))&&x(e)}const T=e=>{const t=e.currentTarget,n=w.indexOf(t),a=g[n].value;a!==C&&(D(t),x(a),null!=k&&y(k,String(a)))},A=e=>{var t;let n=null;switch(e.key){case"Enter":T(e);break;case"ArrowRight":{const t=w.indexOf(e.currentTarget)+1;n=w[t]??w[0];break}case"ArrowLeft":{const t=w.indexOf(e.currentTarget)-1;n=w[t]??w[w.length-1];break}}null==(t=n)||t.focus()};return r.createElement("div",{className:(0,o.Z)("tabs-container",s)},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,o.Z)("tabs",{"tabs--block":i},h)},g.map((e=>{let{value:t,label:n,attributes:i}=e;return r.createElement("li",(0,a.Z)({role:"tab",tabIndex:C===t?0:-1,"aria-selected":C===t,key:t,ref:e=>w.push(e),onKeyDown:A,onClick:T},i,{className:(0,o.Z)("tabs__item",m,null==i?void 0:i.className,{"tabs__item--active":C===t})}),n??t)}))),n?(0,r.cloneElement)(N.filter((e=>e.props.value===C))[0],{className:"margin-top--md"}):r.createElement("div",{className:"margin-top--md"},N.map(((e,t)=>(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==C})))))}function c(e){const t=(0,i.Z)();return r.createElement(u,(0,a.Z)({key:String(t)},e))}},2274:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>m,contentTitle:()=>p,default:()=>k,frontMatter:()=>d,metadata:()=>s,toc:()=>u});var a=n(7462),r=(n(7294),n(3905)),o=n(5488),i=n(5162),l=n(6693);const d={},p="Devices",s={unversionedId:"config/devices",id:"config/devices",title:"Devices",description:"The format of Detox config allows you to define inside it multiple device configs in a key-value manner, i.e.:",source:"@site/../docs/config/devices.mdx",sourceDirName:"config",slug:"/config/devices",permalink:"/Detox/docs/next/config/devices",draft:!1,editUrl:"https://github.com/wix/Detox/edit/master/docs/../docs/config/devices.mdx",tags:[],version:"current",frontMatter:{},sidebar:"apiSidebar",previous:{title:"Overview",permalink:"/Detox/docs/next/config/overview"},next:{title:"Apps",permalink:"/Detox/docs/next/config/apps"}},m={},u=[{value:"Location",id:"location",level:2},{value:"Examples",id:"examples",level:2},{value:"Properties",id:"properties",level:2}],c={toc:u};function k(e){let{components:t,...n}=e;return(0,r.kt)("wrapper",(0,a.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"devices"},"Devices"),(0,r.kt)("p",null,"The format of Detox config allows you to define inside it multiple device configs in a key-value manner, i.e.:"),(0,r.kt)("h2",{id:"location"},"Location"),(0,r.kt)(l.ZP,{sectionName:"devices",propertyName:"device",mdxType:"Location"}),(0,r.kt)("h2",{id:"examples"},"Examples"),(0,r.kt)(o.Z,{groupId:"deviceType",mdxType:"Tabs"},(0,r.kt)(i.Z,{value:"ios.simulator",default:!0,mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-json"},'{\n  "type": "ios.simulator",\n  "device": {\n    // one of these or a combination of them\n    "id": "D53474CF-7DD1-4673-8517-E75DAD6C34D6",\n    "type": "iPhone 11 Pro",\n    "name": "MySim",\n    "os": "iOS 13.0"\n  },\n}\n'))),(0,r.kt)(i.Z,{value:"android.emulator",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-json"},'{\n  "type": "android.emulator",\n  "device": {\n    "avdName": "Pixel_2_API_29"\n  },\n  "utilBinaryPaths": [\n    "optional-property-with/path/to/test-butler-or-anything-else.apk"\n  ]\n}\n'))),(0,r.kt)(i.Z,{value:"android.attached",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-json"},'{\n  "type": "android.attached",\n  "device": {\n    "adbName": "YOGAA1BBB412"\n  }\n}\n'))),(0,r.kt)(i.Z,{value:"android.genycloud",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-json"},'{\n  "type": "android.genycloud",\n  "device": {\n    // one of these:\n    "recipeUUID": "11111111-2222-3333-4444-555555555555"\n    "recipeName": "MyRecipeName",\n  }\n}\n')))),(0,r.kt)("h2",{id:"properties"},"Properties"),(0,r.kt)("p",null,"A device config can have the following params:"),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"Configuration Params"),(0,r.kt)("th",{parentName:"tr",align:null},"Details"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"type")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("em",{parentName:"td"},(0,r.kt)("strong",{parentName:"em"},"Required.")," String Literal"),". Mandatory property to discern device types: ",(0,r.kt)("inlineCode",{parentName:"td"},"ios.simulator"),", ",(0,r.kt)("inlineCode",{parentName:"td"},"android.emulator"),", ",(0,r.kt)("inlineCode",{parentName:"td"},"android.attached"),", ",(0,r.kt)("inlineCode",{parentName:"td"},"android.genycloud")," etc.")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"device")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("em",{parentName:"td"},(0,r.kt)("strong",{parentName:"em"},"Required.")," Object.")," Device query, e.g. ",(0,r.kt)("inlineCode",{parentName:"td"},'{ "byType": "iPhone 11 Pro" }')," for iOS simulator, ",(0,r.kt)("inlineCode",{parentName:"td"},'{ "avdName": "Pixel_2_API_29" }')," for Android emulator or ",(0,r.kt)("inlineCode",{parentName:"td"},'{ "adbName": "<pattern>" }')," for attached Android device with name matching the regex.")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"bootArgs")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("em",{parentName:"td"},"Optional. String. Supported by ",(0,r.kt)("inlineCode",{parentName:"em"},"ios.simulator")," and ",(0,r.kt)("inlineCode",{parentName:"em"},"android.emulator")," only.")," ",(0,r.kt)("br",null)," Supply an extra ",(0,r.kt)("em",{parentName:"td"},"String")," of arguments to ",(0,r.kt)("inlineCode",{parentName:"td"},"xcrun simctl boot ...")," or ",(0,r.kt)("inlineCode",{parentName:"td"},"emulator -verbose ... @AVD_Name"),".")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"forceAdbInstall")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("em",{parentName:"td"},"Optional. Boolean. Supported for Android devices only.")," ",(0,r.kt)("br",null)," A ",(0,r.kt)("em",{parentName:"td"},"Boolean")," value, ",(0,r.kt)("inlineCode",{parentName:"td"},"false")," by default. When set to ",(0,r.kt)("inlineCode",{parentName:"td"},"true"),", it tells ",(0,r.kt)("inlineCode",{parentName:"td"},"device.installApp()")," to use ",(0,r.kt)("inlineCode",{parentName:"td"},"adb install"),". Otherwise, it would use the combination of ",(0,r.kt)("inlineCode",{parentName:"td"},"adb push <app.apk>")," and ",(0,r.kt)("inlineCode",{parentName:"td"},"adb shell pm install"),".")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"utilBinaryPaths")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("em",{parentName:"td"},"Optional. Array of strings. Supported for Android devices only.")," ",(0,r.kt)("br",null)," An array of relative paths of ",(0,r.kt)("em",{parentName:"td"},"utility")," app (APK) binary-files to preinstall on the tested devices - once before the test execution begins.",(0,r.kt)("br",null),(0,r.kt)("strong",{parentName:"td"},"Note"),": these are not affected by various install-lifecycle events, such as launching an app with ",(0,r.kt)("inlineCode",{parentName:"td"},"device.launchApp({delete: true})"),", which reinstalls the app. A good example of why this might come in handy is ",(0,r.kt)("a",{parentName:"td",href:"https://github.com/linkedin/test-butler"},"Test Butler"),".")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"gpuMode")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("em",{parentName:"td"},"Optional. String Literal (",(0,r.kt)("code",null,"auto ","|"," host ","|"," swiftshader","_","indirect ","|"," angle","_","indirect ","|"," guest"),"). Supported by ",(0,r.kt)("inlineCode",{parentName:"em"},"android.emulator")," only.")," ",(0,r.kt)("br",null)," A fixed ",(0,r.kt)("strong",{parentName:"td"},"string")," , which tells ",(0,r.kt)("a",{parentName:"td",href:"https://developer.android.com/studio/run/emulator-acceleration#command-gpu"},"in which GPU mode")," the emulator should be booted.")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"headless")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("em",{parentName:"td"},"Optional. Boolean.")," ",(0,r.kt)("inlineCode",{parentName:"td"},"false")," by default. When set to ",(0,r.kt)("inlineCode",{parentName:"td"},"true"),", it tells Detox to boot an Android emulator with ",(0,r.kt)("inlineCode",{parentName:"td"},"-no-window")," option, or to not open the iOS Simulator app when running with Android or iOS respectively.")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"readonly")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("em",{parentName:"td"},"Optional. Boolean. Supported by ",(0,r.kt)("inlineCode",{parentName:"em"},"android.emulator")," only.")," ",(0,r.kt)("br",null),"  ",(0,r.kt)("inlineCode",{parentName:"td"},"false")," by default. When set to ",(0,r.kt)("inlineCode",{parentName:"td"},"true"),", it forces Detox to boot even a single emulator with ",(0,r.kt)("inlineCode",{parentName:"td"},"-read-only")," option.",(0,r.kt)("br",null),(0,r.kt)("strong",{parentName:"td"},"Note"),": when used with multiple workers, this setting has no effect \u2014 emulators will be booted always with ",(0,r.kt)("inlineCode",{parentName:"td"},"-read-only"),".")))))}k.isMDXComponent=!0},6693:(e,t,n)=>{n.d(t,{ZP:()=>l});var a=n(7462),r=(n(7294),n(3905)),o=n(814);const i={toc:[]};function l(e){let{components:t,...n}=e;return(0,r.kt)("wrapper",(0,a.Z)({},i,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"You can define the ",n.propertyName," config in two ways: ",(0,r.kt)("i",null,"aliased")," and ",(0,r.kt)("i",null,"inlined")," (per a configuration):"),(0,r.kt)(o.Z,{title:".detoxrc.js",language:"javascript",mdxType:"CodeBlock"},["/** @type {Detox.DetoxConfig} */","module.exports = {",`  ${n.sectionName}: {`,"// highlight-start",`    ${n.propertyName}Key: {`,`      /* \u2026 ${n.propertyName} config \u2026 */`,"    }","// highlight-end","  },","  /* \u2026 */","  configurations: {","    'example.aliased': {","      /* \u2026 */","// highlight-next-line",`      ${n.propertyName}: '${n.propertyName}Key', // (1)`,"    },","    'example.inlined': {","      /* \u2026 */","// highlight-start",`      ${n.propertyName}: { // (2)`,`        /* \u2026 ${n.propertyName} config \u2026 */`,"      },","// highlight-end","    },","  },","};"].join("\n")))}l.isMDXComponent=!0}}]);