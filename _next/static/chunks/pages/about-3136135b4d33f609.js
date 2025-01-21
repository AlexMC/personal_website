(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[521],{3454:function(e,r,t){"use strict";var n,s;e.exports=(null==(n=t.g.process)?void 0:n.env)&&"object"==typeof(null==(s=t.g.process)?void 0:s.env)?t.g.process:t(7663)},512:function(e,r,t){(window.__NEXT_P=window.__NEXT_P||[]).push(["/about",function(){return t(8670)}])},2259:function(e,r,t){"use strict";t.d(r,{Z:function(){return m}});var n=t(5893),s=t(9008),a=t.n(s),i=t(1664),o=t.n(i);function c(){return(0,n.jsx)("header",{className:"pt-16",children:(0,n.jsx)("div",{className:"max-w-3xl mx-auto px-4",children:(0,n.jsxs)("div",{className:"flex flex-col space-y-4",children:[(0,n.jsx)("h1",{className:"text-4xl font-bold text-glow",children:"ALEXANDRE CARVALHO"}),(0,n.jsx)("h2",{className:"text-primary-light",children:"CTPO | GEN AI | DECENTRALIZED LEDGER TECH"}),(0,n.jsxs)("nav",{className:"flex space-x-8 text-primary-light",children:[(0,n.jsx)(o(),{href:"/",className:"hover:text-primary transition-colors",children:"HOME"}),(0,n.jsx)(o(),{href:"/work",className:"hover:text-primary transition-colors",children:"WORK"}),(0,n.jsx)(o(),{href:"/blog",className:"hover:text-primary transition-colors",children:"BLOG"}),(0,n.jsx)(o(),{href:"/about",className:"hover:text-primary transition-colors",children:"ABOUT"})]})]})})})}function l(){return(0,n.jsx)("footer",{className:"py-8 border-t border-primary-dark",children:(0,n.jsxs)("div",{className:"max-w-3xl mx-auto px-4 text-center",children:[(0,n.jsxs)("div",{className:"flex justify-center space-x-8 mb-6",children:[(0,n.jsx)("a",{href:"https://github.com/alexmc",target:"_blank",rel:"noopener noreferrer",className:"text-primary-light hover:text-primary transition-colors",children:"GITHUB"}),(0,n.jsx)("a",{href:"https://twitter.com/alexmc",target:"_blank",rel:"noopener noreferrer",className:"text-primary-light hover:text-primary transition-colors",children:"TWITTER"}),(0,n.jsx)("a",{href:"https://www.linkedin.com/in/alexandremcarvalho/",target:"_blank",rel:"noopener noreferrer",className:"text-primary-light hover:text-primary transition-colors",children:"LINKEDIN"})]}),(0,n.jsxs)("p",{className:"text-primary-light",children:["\xa9 ",new Date().getFullYear()," Alexandre Carvalho"]})]})})}function m(e){let{children:r}=e;return(0,n.jsxs)("div",{className:"min-h-screen bg-background text-primary",children:[(0,n.jsxs)(a(),{children:[(0,n.jsx)("title",{children:"Alexandre Carvalho"}),(0,n.jsx)("meta",{name:"description",content:"Software Engineer & Developer"}),(0,n.jsx)("link",{rel:"icon",href:"/favicon.ico"})]}),(0,n.jsx)(c,{}),(0,n.jsx)("main",{className:"max-w-3xl mx-auto px-4 py-10",children:r}),(0,n.jsx)(l,{})]})}},5728:function(e,r,t){"use strict";var n=t(5893),s=t(7294),a=t(3454);r.Z=()=>{let[e,r]=(0,s.useState)(""),[t,i]=(0,s.useState)(""),o=async t=>{t.preventDefault(),i("sending");try{{let r=await fetch("https://connect.mailerlite.com/api/subscribers",{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json",Authorization:"Bearer ".concat(a.env.NEXT_PUBLIC_MAILERLITE_API_KEY)},body:JSON.stringify({email:e,groups:[],status:"active"})}),t=await r.json();if(!r.ok)throw Error(t.message||"Subscription failed")}i("success"),r("")}catch(e){i("error"),console.error("Newsletter subscription error:",e)}};return(0,n.jsx)("div",{className:"section",children:(0,n.jsx)("div",{className:"container-custom max-w-2xl",children:(0,n.jsxs)("div",{className:"p-6 bg-surface rounded-none border border-primary-dark",children:[(0,n.jsx)("h2",{className:"text-2xl font-bold mb-4 text-glow",children:"> subscribe"}),(0,n.jsx)("p",{className:"text-primary-light mb-6",children:"Get notified about new blog posts and projects. No spam, unsubscribe at any time."}),(0,n.jsxs)("form",{onSubmit:o,className:"space-y-4",children:[(0,n.jsxs)("div",{children:[(0,n.jsx)("label",{htmlFor:"email",className:"sr-only",children:"Email address"}),(0,n.jsx)("input",{type:"email",id:"email",value:e,onChange:e=>r(e.target.value),placeholder:"your@email.com",className:"terminal-input",required:!0})]}),(0,n.jsx)("button",{type:"submit",disabled:"sending"===t,className:"btn-primary w-full",children:"sending"===t?(0,n.jsx)("span",{className:"loading-cursor",children:"Subscribing_"}):"Subscribe"}),"success"===t&&(0,n.jsx)("p",{className:"text-primary text-sm",children:(0,n.jsx)("span",{className:"loading-cursor",children:"Thanks for subscribing_"})}),"error"===t&&(0,n.jsx)("p",{className:"text-primary text-sm",children:(0,n.jsx)("span",{className:"loading-cursor",children:"Error: Please try again_"})})]})]})})})}},8670:function(e,r,t){"use strict";t.r(r),t.d(r,{default:function(){return i}});var n=t(5893),s=t(2259),a=t(5728);function i(){return(0,n.jsx)(s.Z,{children:(0,n.jsxs)("div",{className:"space-y-24",children:[(0,n.jsxs)("section",{children:[(0,n.jsx)("h1",{className:"text-3xl font-bold mb-8 text-glow",children:"> about me"}),(0,n.jsxs)("div",{className:"space-y-8 text-primary-light",children:[(0,n.jsx)("p",{className:"text-xl",children:"CTPO with a passion for building innovative solutions in AI and blockchain. Currently focused on developing scalable applications and exploring the intersection of artificial intelligence and decentralized systems."}),(0,n.jsx)("p",{children:"With over a decade of experience in software development and technical leadership, I've led teams in delivering complex projects across various domains."})]})]}),(0,n.jsxs)("section",{className:"space-y-8",children:[(0,n.jsx)("h2",{className:"text-2xl font-bold text-primary",children:"> skills"}),(0,n.jsx)("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-8",children:[{category:"Technology",items:["Architecture","Infrastructure","Coordination","Recruitment"]},{category:"Product",items:["Management","Business Value Creation","Stakeholder Management"]},{category:"AI",items:["Generative AI","Research Management","Tooling"]},{category:"Web3",items:["Smart Contracts","Node Management"]}].map((e,r)=>(0,n.jsxs)("div",{className:"border border-primary-dark p-6 hover:border-primary transition-colors",children:[(0,n.jsx)("h3",{className:"text-lg font-medium mb-4 text-primary",children:e.category}),(0,n.jsx)("div",{className:"flex flex-wrap gap-2",children:e.items.map((e,r)=>(0,n.jsx)("span",{className:"px-3 py-1 text-sm bg-primary-dark text-primary border border-primary-medium",children:e},r))})]},r))})]}),(0,n.jsx)("section",{className:"space-y-8",children:(0,n.jsx)(a.Z,{})})]})})}},7663:function(e){!function(){var r={229:function(e){var r,t,n,s=e.exports={};function a(){throw Error("setTimeout has not been defined")}function i(){throw Error("clearTimeout has not been defined")}function o(e){if(r===setTimeout)return setTimeout(e,0);if((r===a||!r)&&setTimeout)return r=setTimeout,setTimeout(e,0);try{return r(e,0)}catch(t){try{return r.call(null,e,0)}catch(t){return r.call(this,e,0)}}}!function(){try{r="function"==typeof setTimeout?setTimeout:a}catch(e){r=a}try{t="function"==typeof clearTimeout?clearTimeout:i}catch(e){t=i}}();var c=[],l=!1,m=-1;function d(){l&&n&&(l=!1,n.length?c=n.concat(c):m=-1,c.length&&u())}function u(){if(!l){var e=o(d);l=!0;for(var r=c.length;r;){for(n=c,c=[];++m<r;)n&&n[m].run();m=-1,r=c.length}n=null,l=!1,function(e){if(t===clearTimeout)return clearTimeout(e);if((t===i||!t)&&clearTimeout)return t=clearTimeout,clearTimeout(e);try{t(e)}catch(r){try{return t.call(null,e)}catch(r){return t.call(this,e)}}}(e)}}function h(e,r){this.fun=e,this.array=r}function x(){}s.nextTick=function(e){var r=Array(arguments.length-1);if(arguments.length>1)for(var t=1;t<arguments.length;t++)r[t-1]=arguments[t];c.push(new h(e,r)),1!==c.length||l||o(u)},h.prototype.run=function(){this.fun.apply(null,this.array)},s.title="browser",s.browser=!0,s.env={},s.argv=[],s.version="",s.versions={},s.on=x,s.addListener=x,s.once=x,s.off=x,s.removeListener=x,s.removeAllListeners=x,s.emit=x,s.prependListener=x,s.prependOnceListener=x,s.listeners=function(e){return[]},s.binding=function(e){throw Error("process.binding is not supported")},s.cwd=function(){return"/"},s.chdir=function(e){throw Error("process.chdir is not supported")},s.umask=function(){return 0}}},t={};function n(e){var s=t[e];if(void 0!==s)return s.exports;var a=t[e]={exports:{}},i=!0;try{r[e](a,a.exports,n),i=!1}finally{i&&delete t[e]}return a.exports}n.ab="//";var s=n(229);e.exports=s}()}},function(e){e.O(0,[996,774,888,179],function(){return e(e.s=512)}),_N_E=e.O()}]);