import{T as F,S as N,A as l,l as R,F as k,c as K,B as p,d as V,U as z,e as Y,a as v,b as w}from"./baseOptimizerWorker-D9p07sLo.js";import{b as x,g as J}from"./conditionalFinalizers-Dw6EAy4d.js";var $=(a,E)=>{const i=F.wrappedFixedT(E).get(null,"conditionals","Characters.JingYuan"),{basic:T,skill:U,ult:L,talent:d}=v.ULT_BASIC_3_SKILL_TALENT_5,{SOURCE_BASIC:r,SOURCE_SKILL:A,SOURCE_ULT:S,SOURCE_TALENT:c,SOURCE_TECHNIQUE:j,SOURCE_TRACE:C,SOURCE_MEMO:Q,SOURCE_E1:Z,SOURCE_E2:I,SOURCE_E4:q,SOURCE_E6:g}=N.character("1204"),B=T(a,1,1.1),H=U(a,1,1.1),O=L(a,2,2.16),P=d(a,.66,.726);function _(t,n){const s=t.characterConditionals;let e=0;const o=s.talentHitsPerAction,u=s.talentAttacks,y=n.enemyCount>=3?2:0,h=n.enemyCount>=3?3:1,D=n.enemyCount>=3?2:1;let f=y*(o-u);f+=D;let b=0;for(let m=0;m<u;m++)b+=Math.min(8,f)*(1/u),f+=h;return e=b*w,e}const G={skillCritBuff:!0,talentHitsPerAction:10,talentAttacks:10,e2DmgBuff:!0,e6FuaVulnerabilityStacks:3},M={skillCritBuff:{id:"skillCritBuff",formItem:"switch",text:i("Content.skillCritBuff.text"),content:i("Content.skillCritBuff.content")},talentHitsPerAction:{id:"talentHitsPerAction",formItem:"slider",text:i("Content.talentHitsPerAction.text"),content:i("Content.talentHitsPerAction.content"),min:3,max:10},talentAttacks:{id:"talentAttacks",formItem:"slider",text:i("Content.talentAttacks.text"),content:i("Content.talentAttacks.content"),min:0,max:10},e2DmgBuff:{id:"e2DmgBuff",formItem:"switch",text:i("Content.e2DmgBuff.text"),content:i("Content.e2DmgBuff.content"),disabled:a<2},e6FuaVulnerabilityStacks:{id:"e6FuaVulnerabilityStacks",formItem:"slider",text:i("Content.e6FuaVulnerabilityStacks.text"),content:i("Content.e6FuaVulnerabilityStacks.content"),min:0,max:3,disabled:a<6}};return{activeAbilities:[l.BASIC,l.SKILL,l.ULT,l.FUA],content:()=>Object.values(M),defaults:()=>G,initializeConfigurations:(t,n,s)=>{n.characterConditionals,t.SUMMONS.set(1,c)},precomputeEffects:(t,n,s)=>{const e=n.characterConditionals;e.talentHitsPerAction=Math.max(e.talentHitsPerAction,e.talentAttacks),t.CR.buff(e.skillCritBuff?.1:0,C),t.BASIC_ATK_SCALING.buff(B,r),t.SKILL_ATK_SCALING.buff(H,A),t.ULT_ATK_SCALING.buff(O,S),t.FUA_ATK_SCALING.buff(P*e.talentAttacks,c),R(t,k,e.talentHitsPerAction>=6?.25:0,C),K(t,p|V|z,a>=2&&e.e2DmgBuff?.2:0,I),Y(t,k,a>=6?e.e6FuaVulnerabilityStacks*.12:0,g);const o=e.talentAttacks;return t.BASIC_TOUGHNESS_DMG.buff(10,r),t.SKILL_TOUGHNESS_DMG.buff(10,A),t.ULT_TOUGHNESS_DMG.buff(20,S),t.FUA_TOUGHNESS_DMG.buff(5*o,c),t},finalizeCalculations:(t,n,s)=>{x(t,n,s,_(n,s))},gpuFinalizeCalculations:(t,n)=>J(_(t,n))}};export{$ as default};
