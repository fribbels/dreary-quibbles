import{T as e,S as H,A as b,m as x,B as D,a as G}from"./baseOptimizerWorker-D9p07sLo.js";var K=(t,R)=>{const a=e.wrappedFixedT(R).get(null,"conditionals","Characters.ImbibitorLunae"),{basic:s,skill:k,ult:f,talent:_}=G.SKILL_BASIC_3_ULT_TALENT_5,{SOURCE_BASIC:i,SOURCE_SKILL:h,SOURCE_ULT:o,SOURCE_TALENT:m,SOURCE_TECHNIQUE:M,SOURCE_TRACE:g,SOURCE_MEMO:N,SOURCE_E1:P,SOURCE_E2:B,SOURCE_E4:y,SOURCE_E6:O}=H.character("1213"),l=t>=1?10:6,r=k(t,.12,.132),S=_(t,.1,.11),u=s(t,1,1.1),E=s(t,2.6,2.86),d=s(t,3.8,4.18),C=s(t,5,5.5),T=f(t,3,3.24),U={basicEnhanced:3,skillOutroarStacks:4,talentRighteousHeartStacks:l,e6ResPenStacks:3},A={basicEnhanced:{id:"basicEnhanced",formItem:"slider",text:a("Content.basicEnhanced.text"),content:a("Content.basicEnhanced.content",{basicScaling:e.precisionRound(100*u),basicEnhanced1Scaling:e.precisionRound(100*E),basicEnhanced2Scaling:e.precisionRound(100*d),basicEnhanced3Scaling:e.precisionRound(100*C)}),min:0,max:3},skillOutroarStacks:{id:"skillOutroarStacks",formItem:"slider",text:a("Content.skillOutroarStacks.text"),content:a("Content.skillOutroarStacks.content",{outroarStackCdValue:e.precisionRound(100*r)}),min:0,max:4},talentRighteousHeartStacks:{id:"talentRighteousHeartStacks",formItem:"slider",text:a("Content.talentRighteousHeartStacks.text"),content:a("Content.talentRighteousHeartStacks.content",{righteousHeartDmgValue:e.precisionRound(100*S)}),min:0,max:l},e6ResPenStacks:{id:"e6ResPenStacks",formItem:"slider",text:a("Content.e6ResPenStacks.text"),content:a("Content.e6ResPenStacks.content"),min:0,max:3,disabled:t<6}};return{activeAbilities:[b.BASIC,b.ULT],content:()=>Object.values(A),defaults:()=>U,precomputeEffects:(n,I,L)=>{const c=I.characterConditionals;n.CD.buff(L.enemyElementalWeak?.24:0,g),n.CD.buff(c.skillOutroarStacks*r,h);const p={0:u,1:E,2:d,3:C}[c.basicEnhanced]??0;return n.BASIC_ATK_SCALING.buff(p,i),n.ULT_ATK_SCALING.buff(T,o),n.ELEMENTAL_DMG.buff(c.talentRighteousHeartStacks*S,m),x(n,D,t>=6&&c.basicEnhanced==3?.2*c.e6ResPenStacks:0,O),n.BASIC_TOUGHNESS_DMG.buff(10+10*c.basicEnhanced,i),n.ULT_TOUGHNESS_DMG.buff(20,o),n},finalizeCalculations:n=>{},gpuFinalizeCalculations:()=>""}};export{K as default};
