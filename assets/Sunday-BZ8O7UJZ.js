import{T as s,S as y,A as P,K as i,C as g,h as b,i as r,r as p,s as h,a as q}from"./baseOptimizerWorker-D9p07sLo.js";var Z=(n,V)=>{const a=s.wrappedFixedT(V).get(null,"conditionals","Characters.Sunday"),{basic:O,skill:d,ult:B,talent:N}=q.ULT_BASIC_3_SKILL_TALENT_5,{SOURCE_BASIC:E,SOURCE_SKILL:_,SOURCE_ULT:S,SOURCE_TALENT:F,SOURCE_TECHNIQUE:L,SOURCE_TRACE:w,SOURCE_MEMO:G,SOURCE_E1:T,SOURCE_E2:k,SOURCE_E4:$,SOURCE_E6:c}=y.character("1313"),R=d(n,.3,.33),I=d(n,.5,.55),m=B(n,.3,.336),D=B(n,.12,.128),U=N(n,.2,.22),A=O(n,1,1.1),M={skillDmgBuff:!1,talentCrBuffStacks:0,techniqueDmgBuff:!1,e1DefPen:!1,e2DmgBuff:!1},v={skillDmgBuff:!0,talentCrBuffStacks:n<6?1:3,beatified:!0,teammateCDValue:2.5,techniqueDmgBuff:!1,e1DefPen:!0,e2DmgBuff:!0,e6CrToCdConversion:!0},C={skillDmgBuff:{id:"skillDmgBuff",formItem:"switch",text:a("Content.skillDmgBuff.text"),content:a("Content.skillDmgBuff.content",{DmgBoost:s.precisionRound(100*R),SummonDmgBoost:s.precisionRound(100*I)})},talentCrBuffStacks:{id:"talentCrBuffStacks",formItem:"slider",text:a("Content.talentCrBuffStacks.text"),content:a("Content.talentCrBuffStacks.content",{CritRateBoost:s.precisionRound(100*U)}),min:0,max:n<6?1:3},techniqueDmgBuff:{id:"techniqueDmgBuff",formItem:"switch",text:a("Content.techniqueDmgBuff.text"),content:a("Content.techniqueDmgBuff.content")},e1DefPen:{id:"e1DefPen",formItem:"switch",text:a("Content.e1DefPen.text"),content:a("Content.e1DefPen.content"),disabled:n<1},e2DmgBuff:{id:"e2DmgBuff",formItem:"switch",text:a("Content.e2DmgBuff.text"),content:a("Content.e2DmgBuff.content"),disabled:n<2}},x={skillDmgBuff:C.skillDmgBuff,talentCrBuffStacks:C.talentCrBuffStacks,beatified:{id:"beatified",formItem:"switch",text:a("TeammateContent.beatified.text"),content:a("TeammateContent.beatified.content",{CritBuffScaling:s.precisionRound(100*m),CritBuffFlat:s.precisionRound(100*D)})},teammateCDValue:{id:"teammateCDValue",formItem:"slider",text:a("TeammateContent.teammateCDValue.text"),content:a("TeammateContent.teammateCDValue.content",{CritBuffScaling:s.precisionRound(100*m),CritBuffFlat:s.precisionRound(100*D)}),min:0,max:4,percent:!0},techniqueDmgBuff:C.techniqueDmgBuff,e1DefPen:C.e1DefPen,e2DmgBuff:C.e2DmgBuff,e6CrToCdConversion:{id:"e6CrToCdConversion",formItem:"switch",text:a("TeammateContent.e6CrToCdConversion.text"),content:a("TeammateContent.e6CrToCdConversion.content"),disabled:n<6}};return{activeAbilities:[P.BASIC],content:()=>Object.values(C),teammateContent:()=>Object.values(x),defaults:()=>M,teammateDefaults:()=>v,precomputeEffects:(t,e,o)=>{t.BASIC_ATK_SCALING.buff(A,E),t.BASIC_TOUGHNESS_DMG.set(10,E)},precomputeMutualEffects:(t,e,o)=>{const f=e.characterConditionals;t.CR.buffDual(f.talentCrBuffStacks*U,F),t.ELEMENTAL_DMG.buffDual(f.skillDmgBuff?R:0,_),t.ELEMENTAL_DMG.buffDual(f.skillDmgBuff&&t.a[i.SUMMONS]>0?I:0,_),t.ELEMENTAL_DMG.buffDual(f.techniqueDmgBuff?.5:0,L),t.DEF_PEN.buffDual(n>=1&&f.e1DefPen&&f.skillDmgBuff?.16:0,T),t.DEF_PEN.buffDual(n>=1&&f.e1DefPen&&f.skillDmgBuff&&t.a[i.SUMMONS]>0?.24:0,T),t.ELEMENTAL_DMG.buffDual(n>=2&&f.e2DmgBuff?.3:0,k)},precomputeTeammateEffects:(t,e,o)=>{const f=e.characterConditionals,u=f.beatified?m*f.teammateCDValue+D:0;t.CD.buffDual(u,S),t.UNCONVERTIBLE_CD_BUFF.buffDual(u,S)},finalizeCalculations:(t,e,o)=>{},gpuFinalizeCalculations:(t,e)=>"",teammateDynamicConditionals:[{id:"SundayMemoCrConditional",type:g.ABILITY,activation:b.CONTINUOUS,dependsOn:[r.CR],chainsTo:[r.CD],condition:function(t,e,o){return t.m.a[i.CR]>1},effect:function(t,e,o){const f=e.teammateCharacterConditionals;if(!(n>=6&&f.e6CrToCdConversion&&!t.a[i.DEPRIORITIZE_BUFFS]))return;const u=e.conditionalState[this.id]||0,l=Math.floor((t.m.a[i.CR]-t.m.a[i.UNCONVERTIBLE_CR_BUFF]-1)/.01)*2*.01;e.conditionalState[this.id]=l,t.m.CD.buffDynamic(l-u,c,e,o),t.m.UNCONVERTIBLE_CD_BUFF.buffDynamic(l-u,c,e,o)},gpu:function(t,e){const o=t.teammateCharacterConditionals;return p(this,`
if (${h(n>=6&&o.e6CrToCdConversion)}) {
  return;
}

if (x.DEPRIORITIZE_BUFFS > 0) {
  return;
}

let cr = (*p_m).CR;
let unconvertibleCr = (*p_m).UNCONVERTIBLE_CR_BUFF;

if (cr > 1.00) {
  let buffValue: f32 = floor((cr - unconvertibleCr - 1.00) / 0.01) * 2.00 * 0.01;
  let stateValue: f32 = (*p_state).${this.id};

  (*p_state).${this.id} = buffValue;
  (*p_m).CD += buffValue - stateValue;
  (*p_m).UNCONVERTIBLE_CD_BUFF += buffValue - stateValue;
}
          `)}},{id:"SundayCrConditional",type:g.ABILITY,activation:b.CONTINUOUS,dependsOn:[r.CR],chainsTo:[r.CD],condition:function(t,e,o){return t.a[i.CR]>1},effect:function(t,e,o){const f=e.teammateCharacterConditionals;if(!(n>=6&&f.e6CrToCdConversion&&!t.a[i.DEPRIORITIZE_BUFFS]))return;const u=e.conditionalState[this.id]||0,l=Math.floor((t.a[i.CR]-t.a[i.UNCONVERTIBLE_CR_BUFF]-1)/.01)*2*.01;e.conditionalState[this.id]=l,t.CD.buffDynamic(l-u,c,e,o),t.UNCONVERTIBLE_CD_BUFF.buffDynamic(l-u,c,e,o)},gpu:function(t,e){const o=t.teammateCharacterConditionals;return p(this,`
if (${h(n>=6&&o.e6CrToCdConversion)}) {
  return;
}

if (x.DEPRIORITIZE_BUFFS > 0) {
  return;
}

if (x.CR > 1.00) {
  let buffValue: f32 = floor((x.CR - x.UNCONVERTIBLE_CR_BUFF - 1.00) / 0.01) * 2.00 * 0.01;
  let stateValue: f32 = (*p_state).${this.id};

  (*p_state).${this.id} = buffValue;
  (*p_x).CD += buffValue - stateValue;
  (*p_x).UNCONVERTIBLE_CD_BUFF += buffValue - stateValue;
}
    `)}}]}};export{Z as default};
