import{T as u,S as R,A as o,a as x}from"./index-CUUFLx9X.js";import"./vendor-PqicMVLa.js";const v=(a,E)=>{const e=u.wrappedFixedT(E).get(null,"conditionals","Characters.Asta"),{basic:S,skill:_,ult:d,talent:D}=x.SKILL_TALENT_3_ULT_BASIC_5,{SOURCE_BASIC:r,SOURCE_SKILL:m,SOURCE_ULT:k,SOURCE_TALENT:T,SOURCE_TECHNIQUE:H,SOURCE_TRACE:f,SOURCE_MEMO:K,SOURCE_E1:N,SOURCE_E2:G,SOURCE_E4:A,SOURCE_E6:M}=R.character("1009"),B=d(a,50,52.8),C=D(a,.14,.154),g=.06,l=a>=1?5:4,p=S(a,1,1.1),i=_(a,.5,.55),O=S(a,.5,.55),I={talentBuffStacks:5,skillExtraDmgHits:l,ultSpdBuff:!0,fireDmgBoost:!0},L={talentBuffStacks:5,ultSpdBuff:!0,fireDmgBoost:!0},s={skillExtraDmgHits:{id:"skillExtraDmgHits",formItem:"slider",text:e("Content.skillExtraDmgHits.text"),content:e("Content.skillExtraDmgHits.content",{skillScaling:u.precisionRound(i*100),skillExtraDmgHitsMax:l}),min:0,max:l},talentBuffStacks:{id:"talentBuffStacks",formItem:"slider",text:e("Content.talentBuffStacks.text"),content:e("Content.talentBuffStacks.content",{talentStacksAtkBuff:u.precisionRound(100*C)}),min:0,max:5},ultSpdBuff:{id:"ultSpdBuff",formItem:"switch",text:e("Content.ultSpdBuff.text"),content:e("Content.ultSpdBuff.content",{ultSpdBuffValue:B})},fireDmgBoost:{id:"fireDmgBoost",formItem:"switch",text:e("Content.fireDmgBoost.text"),content:e("Content.fireDmgBoost.content")}},U={talentBuffStacks:s.talentBuffStacks,ultSpdBuff:s.ultSpdBuff,fireDmgBoost:s.fireDmgBoost};return{activeAbilities:[o.BASIC,o.SKILL,o.ULT,o.DOT],content:()=>Object.values(s),teammateContent:()=>Object.values(U),defaults:()=>I,teammateDefaults:()=>L,precomputeEffects:(t,c,b)=>{const n=c.characterConditionals;return t.DEF_P.buff(n.talentBuffStacks*g,f),t.ERR.buff(a>=4&&n.talentBuffStacks>=2?.15:0,A),t.BASIC_ATK_SCALING.buff(p,r),t.SKILL_ATK_SCALING.buff(i+n.skillExtraDmgHits*i,m),t.DOT_ATK_SCALING.buff(O,f),t.BASIC_TOUGHNESS_DMG.buff(10,r),t.SKILL_TOUGHNESS_DMG.buff(10+5*n.skillExtraDmgHits,m),t.DOT_CHANCE.set(.8,f),t},precomputeMutualEffects:(t,c,b)=>{const n=c.characterConditionals;t.SPD.buffTeam(n.ultSpdBuff?B:0,k),t.ATK_P.buffTeam(n.talentBuffStacks*C,T),t.FIRE_DMG_BOOST.buffTeam(n.fireDmgBoost?.18:0,f)},finalizeCalculations:t=>{},gpuFinalizeCalculations:()=>""}};export{v as default};
