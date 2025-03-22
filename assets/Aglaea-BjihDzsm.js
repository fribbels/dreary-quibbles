import{T as u,S as w,x as r,y as h,A as P,K as c,w as x,C as z,h as Y,i as L,r as j,s as W,a as $}from"./index-CUUFLx9X.js";import{e as Q,n as q}from"./conditionalFinalizers-CYc97pLI.js";import"./vendor-PqicMVLa.js";const it=(a,A)=>{const i=u.wrappedFixedT(A).get(null,"conditionals","Characters.Aglaea"),f=u.wrappedFixedT(A).get(null,"conditionals","Common.BuffPriority"),{basic:E,skill:J,ult:N,talent:_,memoSkill:y,memoTalent:G}=$.SKILL_BASIC_MEMO_TALENT_3_ULT_TALENT_MEMO_SKILL_5,{SOURCE_BASIC:I,SOURCE_SKILL:X,SOURCE_ULT:R,SOURCE_TALENT:l,SOURCE_TECHNIQUE:Z,SOURCE_TRACE:b,SOURCE_MEMO:o,SOURCE_E1:U,SOURCE_E2:O,SOURCE_E4:tt,SOURCE_E6:m}=w.character("1402"),g=E(a,1,1.1),T=E(a,2,2.2),B=N(a,.15,.16),k=_(a,.66,.704),V=_(a,720,828),D=_(a,.3,.336),F=y(a,1.1,1.21),M=G(a,55,57.2),d=a>=4?7:6,K={buffPriority:r,supremeStanceState:!0,seamStitch:!0,memoSpdStacks:d,e1Vulnerability:!0,e2DefShredStacks:3,e6Buffs:!0},v={seamStitch:!0,e1Vulnerability:!0},C={buffPriority:{id:"buffPriority",formItem:"select",text:f("Text"),content:f("Content"),options:[{display:f("Self"),value:r,label:f("Self")},{display:f("Memo"),value:h,label:f("Memo")}],fullWidth:!0},supremeStanceState:{id:"supremeStanceState",formItem:"switch",text:i("Content.supremeStanceState.text"),content:i("Content.supremeStanceState.content",{SpdBuff:u.precisionRound(B*100)})},seamStitch:{id:"seamStitch",formItem:"switch",text:i("Content.seamStitch.text"),content:i("Content.seamStitch.content",{Scaling:u.precisionRound(D*100)})},memoSpdStacks:{id:"memoSpdStacks",formItem:"slider",text:i("Content.memoSpdStacks.text"),content:i("Content.memoSpdStacks.content",{SpdBuff:M,StackLimit:d}),min:0,max:d},e1Vulnerability:{id:"e1Vulnerability",formItem:"switch",text:i("Content.e1Vulnerability.text"),content:i("Content.e1Vulnerability.content"),disabled:a<1},e2DefShredStacks:{id:"e2DefShredStacks",formItem:"slider",text:i("Content.e2DefShredStacks.text"),content:i("Content.e2DefShredStacks.content"),min:1,max:3,disabled:a<2},e6Buffs:{id:"e6Buffs",formItem:"switch",text:i("Content.e6Buffs.text"),content:i("Content.e6Buffs.content"),disabled:a<6}},H={seamStitch:C.seamStitch,e1Vulnerability:C.e1Vulnerability};return{activeAbilities:[P.BASIC,P.MEMO_SKILL],content:()=>Object.values(C),teammateContent:()=>Object.values(H),defaults:()=>K,teammateDefaults:()=>v,initializeConfigurations:(t,n,S)=>{const e=n.characterConditionals;t.SUMMONS.set(1,l),t.MEMOSPRITE.set(1,l),t.MEMO_BUFF_PRIORITY.set(e.buffPriority==r?r:h,l)},precomputeEffects:(t,n,S)=>{const e=n.characterConditionals;t.BASIC_ATK_SCALING.buff(e.supremeStanceState?T:g,I),t.m.BASIC_ATK_SCALING.buff(T,o),t.SPD_P.buff(e.supremeStanceState?B*e.memoSpdStacks:0,R),t.MEMO_BASE_HP_SCALING.buff(k,o),t.MEMO_BASE_HP_FLAT.buff(V,o),t.MEMO_BASE_SPD_SCALING.buff(.35,o),t.MEMO_BASE_DEF_SCALING.buff(1,o),t.MEMO_BASE_ATK_SCALING.buff(1,o),t.BASIC_ADDITIONAL_DMG_SCALING.buff(e.seamStitch?D:0,l),t.m.MEMO_SKILL_ATK_SCALING.buff(F,o),t.m.SPD.buff(e.memoSpdStacks*M,o),t.DEF_PEN.buff(a>=2?.14*e.e2DefShredStacks:0,O),t.m.DEF_PEN.buff(a>=2?.14*e.e2DefShredStacks:0,O),t.LIGHTNING_RES_PEN.buff(a>=6&&e.e6Buffs&&e.supremeStanceState?.2:0,m),t.m.LIGHTNING_RES_PEN.buff(a>=6&&e.e6Buffs&&e.supremeStanceState?.2:0,m),t.BASIC_TOUGHNESS_DMG.buff(e.supremeStanceState?20:10,I),t.m.MEMO_SKILL_TOUGHNESS_DMG.buff(10,o)},precomputeMutualEffects:(t,n,S)=>{const e=n.characterConditionals;t.VULNERABILITY.buffTeam(a>=1&&e.seamStitch&&e.e1Vulnerability?.15:0,U)},finalizeCalculations:(t,n,S)=>{const e=n.characterConditionals;if(a>=6&&e.supremeStanceState&&e.e6Buffs){let s=0;t.a[c.SPD]>320||t.m.a[c.SPD]>=320?s=.6:t.a[c.SPD]>240||t.m.a[c.SPD]>=240?s=.3:(t.a[c.SPD]>160||t.m.a[c.SPD]>=160)&&(s=.1),t.BASIC_DMG_BOOST.buff(s,m),t.m.BASIC_DMG_BOOST.buff(s,m)}Q(t)},gpuFinalizeCalculations:(t,n)=>{const S=t.characterConditionals;return`
if (${x(a>=6&&S.supremeStanceState&&S.e6Buffs)}) {
  if (x.SPD > 320 || m.SPD > 320) {
    x.BASIC_DMG_BOOST += 0.60;
    m.BASIC_DMG_BOOST += 0.60;
  } else if (x.SPD > 240 || m.SPD > 240) {
    x.BASIC_DMG_BOOST += 0.30;
    m.BASIC_DMG_BOOST += 0.30;
  } else if (x.SPD > 160 || m.SPD > 160) {
    x.BASIC_DMG_BOOST += 0.10;
    m.BASIC_DMG_BOOST += 0.10;
  }
}

${q()}
`},dynamicConditionals:[{id:"AglaeaConversionConditional",type:z.ABILITY,activation:Y.CONTINUOUS,dependsOn:[L.SPD],chainsTo:[L.ATK],condition:function(t,n,S){return!0},effect:function(t,n,S){if(!n.characterConditionals.supremeStanceState)return;const s=n.conditionalState[this.id]||0,p=7.2*t.a[c.SPD]+3.6*t.m.a[c.SPD];n.conditionalState[this.id]=p,t.ATK.buffDynamic(p-s,b,n,S),t.m.ATK.buffDynamic(p-s,b,n,S)},gpu:function(t,n){const S=t.characterConditionals;return j(this,`
if (${W(S.supremeStanceState)}) {
  return;
}
let spd = x.SPD;
let memoSpd = (*p_m).SPD;
let stateValue: f32 = (*p_state).AglaeaConversionConditional;
let buffValue: f32 = 7.20 * spd + 3.60 * memoSpd;

(*p_state).AglaeaConversionConditional = buffValue;
(*p_x).ATK += buffValue - stateValue;
(*p_m).ATK += buffValue - stateValue;
    `)}}]}};export{it as default};
