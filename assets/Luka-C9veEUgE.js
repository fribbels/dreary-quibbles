import{T as b,S as N,A as s,a as R}from"./index-CUUFLx9X.js";import"./vendor-PqicMVLa.js";const w=(e,S)=>{const n=b.wrappedFixedT(S).get(null,"conditionals","Characters.Luka"),{basic:i,skill:r,ult:E}=R.SKILL_TALENT_3_ULT_BASIC_5,{SOURCE_BASIC:o,SOURCE_SKILL:c,SOURCE_ULT:l,SOURCE_TALENT:B,SOURCE_TECHNIQUE:k,SOURCE_TRACE:p,SOURCE_MEMO:x,SOURCE_E1:T,SOURCE_E2:G,SOURCE_E4:C,SOURCE_E6:H}=N.character("1111"),_=i(e,.2,.22),d=E(e,.2,.216),U=i(e,1,1.1),g=i(e,.2*3+.8,.22*3+.88),m=r(e,1.2,1.32),L=E(e,3.3,3.564),A=r(e,3.38,3.718),I={basicEnhanced:!0,targetUltDebuffed:!0,e1TargetBleeding:!0,basicEnhancedExtraHits:3,e4TalentStacks:4},h={targetUltDebuffed:!0},u={basicEnhanced:{id:"basicEnhanced",formItem:"switch",text:n("Content.basicEnhanced.text"),content:n("Content.basicEnhanced.content")},targetUltDebuffed:{id:"targetUltDebuffed",formItem:"switch",text:n("Content.targetUltDebuffed.text"),content:n("Content.targetUltDebuffed.content",{targetUltDebuffDmgTakenValue:b.precisionRound(100*d)})},basicEnhancedExtraHits:{id:"basicEnhancedExtraHits",formItem:"slider",text:n("Content.basicEnhancedExtraHits.text"),content:n("Content.basicEnhancedExtraHits.content"),min:0,max:3},e1TargetBleeding:{id:"e1TargetBleeding",formItem:"switch",text:n("Content.e1TargetBleeding.text"),content:n("Content.e1TargetBleeding.content"),disabled:e<1},e4TalentStacks:{id:"e4TalentStacks",formItem:"slider",text:n("Content.e4TalentStacks.text"),content:n("Content.e4TalentStacks.content"),min:0,max:4,disabled:e<4}},D={targetUltDebuffed:u.targetUltDebuffed};return{activeAbilities:[s.BASIC,s.SKILL,s.ULT,s.DOT],content:()=>Object.values(u),teammateContent:()=>Object.values(D),defaults:()=>I,teammateDefaults:()=>h,precomputeEffects:(t,f,O)=>{const a=f.characterConditionals;return t.ATK_P.buff(e>=4?a.e4TalentStacks*.05:0,C),t.BASIC_ATK_SCALING.buff(a.basicEnhanced?g:U,o),t.BASIC_ATK_SCALING.buff((a.basicEnhanced&&a.basicEnhancedExtraHits)*_,o),t.SKILL_ATK_SCALING.buff(m,c),t.ULT_ATK_SCALING.buff(L,l),t.DOT_ATK_SCALING.buff(A,c),t.ELEMENTAL_DMG.buff(e>=1&&a.e1TargetBleeding?.15:0,T),t.BASIC_TOUGHNESS_DMG.buff(a.basicEnhanced?20:10,o),t.SKILL_TOUGHNESS_DMG.buff(20,c),t.ULT_TOUGHNESS_DMG.buff(30,l),t.DOT_CHANCE.set(1,c),t},precomputeMutualEffects:(t,f,O)=>{const a=f.characterConditionals;t.VULNERABILITY.buffTeam(a.targetUltDebuffed?d:0,l)},finalizeCalculations:t=>{},gpuFinalizeCalculations:()=>""}};export{w as default};
