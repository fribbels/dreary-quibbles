import{T as C,S as k,A as s,U as y,F as M,e as R,f as K,a as F,b as h}from"./index-CUUFLx9X.js";import{b as z,c as H,g as P,d as w}from"./conditionalFinalizers-CYc97pLI.js";import"./vendor-PqicMVLa.js";const q=(e,T)=>{const a=C.wrappedFixedT(T).get(null,"conditionals","Characters.Moze"),{basic:L,skill:p,ult:E,talent:_}=F.ULT_TALENT_3_SKILL_BASIC_5,{SOURCE_BASIC:c,SOURCE_SKILL:l,SOURCE_ULT:u,SOURCE_TALENT:f,SOURCE_TECHNIQUE:v,SOURCE_TRACE:S,SOURCE_MEMO:Y,SOURCE_E1:j,SOURCE_E2:m,SOURCE_E4:b,SOURCE_E6:D}=k.character("1223"),U=L(e,1,1.1),G=p(e,1.5,1.65),g=E(e,2.7,2.916),d=_(e,1.6,1.76),i=_(e,.3,.33),I=h*(1*.08+2*.08+3*.08+4*.08+5*.08+6*.6),B={preyMark:!0,e2CdBoost:!0,e4DmgBuff:!0,e6MultiplierIncrease:!0},N={preyMark:!0,e2CdBoost:!0},A={preyMark:{id:"preyMark",formItem:"switch",text:a("Content.preyMark.text"),content:a("Content.preyMark.content",{PreyAdditionalMultiplier:C.precisionRound(100*i),FuaScaling:C.precisionRound(100*d)})},e2CdBoost:{id:"e2CdBoost",formItem:"switch",text:a("Content.e2CdBoost.text"),content:a("Content.e2CdBoost.content"),disabled:e<2},e4DmgBuff:{id:"e4DmgBuff",formItem:"switch",text:a("Content.e4DmgBuff.text"),content:a("Content.e4DmgBuff.content"),disabled:e<4},e6MultiplierIncrease:{id:"e6MultiplierIncrease",formItem:"switch",text:a("Content.e6MultiplierIncrease.text"),content:a("Content.e6MultiplierIncrease.content"),disabled:e<6}},O={preyMark:A.preyMark,e2CdBoost:A.e2CdBoost};return{activeAbilities:[s.BASIC,s.SKILL,s.ULT,s.FUA],content:()=>Object.values(A),teammateContent:()=>Object.values(O),defaults:()=>B,teammateDefaults:()=>N,initializeConfigurations:(t,o,r)=>{t.ULT_DMG_TYPE.set(y|M,S)},precomputeEffects:(t,o,r)=>{const n=o.characterConditionals;return t.ELEMENTAL_DMG.buff(e>=4&&n.e4DmgBuff?.3:0,b),t.BASIC_ATK_SCALING.buff(U,c),t.SKILL_ATK_SCALING.buff(G,l),t.FUA_ATK_SCALING.buff(d,f),t.FUA_ATK_SCALING.buff(e>=6&&n.e6MultiplierIncrease?.25:0,D),t.ULT_ATK_SCALING.buff(g,u),t.BASIC_ADDITIONAL_DMG_SCALING.buff(n.preyMark?i:0,c),t.SKILL_ADDITIONAL_DMG_SCALING.buff(n.preyMark?i:0,l),t.FUA_ADDITIONAL_DMG_SCALING.buff(n.preyMark?i:0,f),t.ULT_ADDITIONAL_DMG_SCALING.buff(n.preyMark?i:0,u),t.BASIC_TOUGHNESS_DMG.buff(10,c),t.SKILL_TOUGHNESS_DMG.buff(20,l),t.ULT_TOUGHNESS_DMG.buff(30,f),t.FUA_TOUGHNESS_DMG.buff(10,u),t},precomputeMutualEffects:(t,o,r)=>{const n=o.characterConditionals;R(t,M,n.preyMark?.25:0,S,K.TEAM),t.CD.buffTeam(e>=2&&n.preyMark&&n.e2CdBoost?.4:0,m)},finalizeCalculations:(t,o,r)=>{z(t,o,r,I),H(t)},gpuFinalizeCalculations:(t,o)=>P(I)+w()}};export{q as default};
