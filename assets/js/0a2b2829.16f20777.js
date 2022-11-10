"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[8952],{3905:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>d});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var l=r.createContext({}),c=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},p=function(e){var t=c(e.components);return r.createElement(l.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},h=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),h=c(n),d=a,m=h["".concat(l,".").concat(d)]||h[d]||u[d]||o;return n?r.createElement(m,i(i({ref:t},p),{},{components:n})):r.createElement(m,i({ref:t},p))}));function d(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,i=new Array(o);i[0]=h;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:a,i[1]=s;for(var c=2;c<o;c++)i[c]=n[c];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}h.displayName="MDXCreateElement"},3967:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>i,default:()=>u,frontMatter:()=>o,metadata:()=>s,toc:()=>c});var r=n(7462),a=(n(7294),n(3905));const o={},i="How Detox Works",s={unversionedId:"articles/how-detox-works",id:"articles/how-detox-works",title:"How Detox Works",description:"Detox is an end-to-end testing framework. This means it runs your app on an actual device/simulator and interacts with it just like a real user would. This type of testing can give a lot of confidence in your app and help automate a manual QA process.",source:"@site/../docs/articles/how-detox-works.md",sourceDirName:"articles",slug:"/articles/how-detox-works",permalink:"/Detox/docs/next/articles/how-detox-works",draft:!1,editUrl:"https://github.com/wix/Detox/edit/master/docs/../docs/articles/how-detox-works.md",tags:[],version:"current",frontMatter:{},sidebar:"apiSidebar",previous:{title:"Design Principles",permalink:"/Detox/docs/next/articles/design-principles"},next:{title:"Third-Party Drivers",permalink:"/Detox/docs/next/articles/third-party-drivers"}},l={},c=[{value:"How Detox Automatically Synchronizes With Your App",id:"how-detox-automatically-synchronizes-with-your-app",level:2},{value:"Architecture",id:"architecture",level:2}],p={toc:c};function u(e){let{components:t,...n}=e;return(0,a.kt)("wrapper",(0,r.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"how-detox-works"},"How Detox Works"),(0,a.kt)("p",null,"Detox is an end-to-end testing framework. This means it runs your app on an actual device/simulator and interacts with it just like a real user would. This type of testing can give a lot of confidence in your app and help automate a manual QA process."),(0,a.kt)("p",null,"When a Detox test executes, you actually have two different parts running side by side:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("p",{parentName:"li"},(0,a.kt)("strong",{parentName:"p"},"The mobile app itself"),", usually running on a simulator/emulator. A regular native build of your app is installed and executed on the device. Your app is usually built once before the tests start running.")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("p",{parentName:"li"},(0,a.kt)("strong",{parentName:"p"},"The test suite"),", running on Node.js, using a test runner like Jest. The tests are normally written in JavaScript. Because the tests are asynchronous in nature (every test line requires to access the app and wait for a response), the tests rely heavily on ",(0,a.kt)("a",{parentName:"p",href:"https://ponyfoo.com/articles/understanding-javascript-async-await"},(0,a.kt)("inlineCode",{parentName:"a"},"async"),"-",(0,a.kt)("inlineCode",{parentName:"a"},"await")),"."))),(0,a.kt)("p",null,"The two parts are usually running in separate processes on your machine. It is also possible to run the two parts on different machines. Communication between the two parts takes place over the network using a web socket."),(0,a.kt)("p",null,"In practice, to make the communication more resilient, both parts are implemented as clients and communicate with a Detox server that acts as proxy. This allows some nice behaviors like allowing one side to disconnect (during a simulator boot for example or app restart) without disconnecting the other side and losing its state."),(0,a.kt)("h2",{id:"how-detox-automatically-synchronizes-with-your-app"},"How Detox Automatically Synchronizes With Your App"),(0,a.kt)("p",null,"One of the key features of Detox is its ability to automatically synchronize the test execution with your app. The most annoying aspect of end-to-end tests is flakiness\u2014tests sometimes fail without anything changing. Flakiness happens because tests are nondeterministic. Every time a test is running, things take place in a slightly different order inside your app."),(0,a.kt)("p",null,"Consider a scenario where the app is making multiple network requests at the same time. What is the order of execution? It depends on which request completes first. This is an external concern depending on network congestion and how busy the server is."),(0,a.kt)("p",null,"The traditional method of dealing with flakiness is adding various ",(0,a.kt)("inlineCode",{parentName:"p"},"sleep()"),"/",(0,a.kt)("inlineCode",{parentName:"p"},"waitFor()")," commands throughout the test in an attempt to force a certain execution order. This is a bad practice, riddled with fragile magic values that often change if the machine running the tests becomes faster or slower."),(0,a.kt)("p",null,"Detox tries to eliminate flakiness by automatically synchronizing your tests with the app. A test cannot continue to the next command until the app becomes idle. Detox monitors your app very closely in order to know when it\u2019s idle. It tracks several asynchronous operations and waits until they complete. This includes:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"Keeping track of all network requests that are currently in-flight and waiting until they complete"),(0,a.kt)("li",{parentName:"ul"},"Keeping track of pending animations and waiting until they complete"),(0,a.kt)("li",{parentName:"ul"},"Keeping track of timers and waiting until they expire or are cancelled"),(0,a.kt)("li",{parentName:"ul"},"Keeping track of the React Native operations")),(0,a.kt)("h2",{id:"architecture"},"Architecture"),(0,a.kt)("p",null,"Detox comprises the following components:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://github.com/wix/Detox/tree/master/detox/src"},(0,a.kt)("strong",{parentName:"a"},"Tester")),": The testing component, running in a Node.js process on the host computer, executing the test logic. The tester is also responsible for device management and artifact collection."),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("strong",{parentName:"li"},"Detox native client (",(0,a.kt)("a",{parentName:"strong",href:"https://github.com/wix/Detox/tree/master/detox/ios"},"iOS")," & ",(0,a.kt)("a",{parentName:"strong",href:"https://github.com/wix/Detox/tree/master/detox/android"},"Android"),"):")," A component that gets seamlessly integrated into the tested app on the tested device, right as Detox starts executing. It synchronizes with the app, matches user queries, executes user commands (e.g. taps, scrolls) and validates expectations."),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("strong",{parentName:"li"},(0,a.kt)("a",{parentName:"strong",href:"https://github.com/wix/Detox/tree/master/detox/src/server"},"Detox mediator server")),": A small web socket server, running in a Node.js process on the host computer, used to connect between the tester and the client. Normally, the tester starts a server on a randomized session id and an available port, and sends the session and port to the client app as a launch argument.")))}u.isMDXComponent=!0}}]);