(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[521],{512:function(e,r,s){(window.__NEXT_P=window.__NEXT_P||[]).push(["/about",function(){return s(1120)}])},5625:function(e,r,s){"use strict";var a=s(5893),t=s(7294),i=s(7066);r.Z=()=>{let[e,r]=(0,t.useState)(""),[s,n]=(0,t.useState)("idle"),[l,o]=(0,t.useState)(""),c=async s=>{s.preventDefault(),n("loading"),o("");try{await i.Z.post("".concat("https://trendhighlighter.xyz","/api/website/newsletter/subscribe"),{email:e}),n("success"),r("")}catch(e){var a,t;n("error"),o((null===(t=e.response)||void 0===t?void 0:null===(a=t.data)||void 0===a?void 0:a.detail)||"Failed to subscribe. Please try again.")}};return(0,a.jsxs)("div",{className:"border border-primary-dark p-6 bg-surface",children:[(0,a.jsx)("h3",{className:"text-xl font-bold text-primary mb-4",children:"Subscribe to my newsletter"}),(0,a.jsx)("p",{className:"text-primary-light mb-4",children:"Get updates on my latest projects, blog posts, and tech insights."}),(0,a.jsxs)("form",{onSubmit:c,className:"space-y-4",children:[(0,a.jsx)("div",{children:(0,a.jsx)("input",{type:"email",value:e,onChange:e=>r(e.target.value),placeholder:"Enter your email",required:!0,className:"w-full bg-background border border-primary-dark p-2 text-primary-light focus:border-primary focus:outline-none transition-colors"})}),(0,a.jsx)("button",{type:"submit",disabled:"loading"===s,className:"w-full bg-primary-dark text-primary border border-primary-medium hover:bg-primary hover:text-background px-4 py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",children:"loading"===s?"Subscribing...":"Subscribe"}),"success"===s&&(0,a.jsx)("p",{className:"text-primary text-sm",children:"Thanks for subscribing!"}),"error"===s&&(0,a.jsx)("p",{className:"text-red-500 text-sm",children:l})]})]})}},1120:function(e,r,s){"use strict";s.r(r),s.d(r,{default:function(){return n}});var a=s(5893),t=s(1884),i=s(5625);function n(){return(0,a.jsx)(t.Z,{children:(0,a.jsxs)("div",{className:"space-y-24",children:[(0,a.jsxs)("section",{children:[(0,a.jsx)("h1",{className:"text-3xl font-bold mb-8 text-glow",children:"> about me"}),(0,a.jsxs)("div",{className:"space-y-8 text-primary-light",children:[(0,a.jsx)("p",{className:"text-xl",children:"CTPO with a passion for building innovative solutions in AI and blockchain. Currently focused on developing scalable applications and exploring the intersection of artificial intelligence and decentralized systems."}),(0,a.jsx)("p",{children:"With over a decade of experience in software development and technical leadership, I've led teams in delivering complex projects across various domains."})]})]}),(0,a.jsxs)("section",{className:"space-y-8",children:[(0,a.jsx)("h2",{className:"text-2xl font-bold text-primary",children:"> skills"}),(0,a.jsx)("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-8",children:[{category:"Technology",items:["Architecture","Infrastructure","Coordination","Recruitment"]},{category:"Product",items:["Management","Business Value Creation","Stakeholder Management"]},{category:"AI",items:["Generative AI","Research Management","Tooling"]},{category:"Web3",items:["Smart Contracts","Node Management"]}].map((e,r)=>(0,a.jsxs)("div",{className:"border border-primary-dark p-6 hover:border-primary transition-colors",children:[(0,a.jsx)("h3",{className:"text-lg font-medium mb-4 text-primary",children:e.category}),(0,a.jsx)("div",{className:"flex flex-wrap gap-2",children:e.items.map((e,r)=>(0,a.jsx)("span",{className:"px-3 py-1 text-sm bg-primary-dark text-primary border border-primary-medium",children:e},r))})]},r))})]}),(0,a.jsx)("section",{className:"space-y-8",children:(0,a.jsx)(i.Z,{})})]})})}}},function(e){e.O(0,[61,66,884,888,774,179],function(){return e(e.s=512)}),_N_E=e.O()}]);