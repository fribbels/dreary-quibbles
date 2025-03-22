import{K as a,S as _,n as i}from"./index-CUUFLx9X.js";const N=A=>A.BASIC_ADDITIONAL_DMG.buff(A.a[a.BASIC_ADDITIONAL_DMG_SCALING]*D(A,0),_.NONE),t=A=>A.ULT_ADDITIONAL_DMG.buff(A.a[a.ULT_ADDITIONAL_DMG_SCALING]*D(A,0),_.NONE),O=()=>`x.BASIC_ADDITIONAL_DMG += x.BASIC_ADDITIONAL_DMG_SCALING * (x.ATK + (x.ATK_P_BOOST) * baseATK);
`,S=()=>`x.ULT_ADDITIONAL_DMG += x.ULT_ADDITIONAL_DMG_SCALING * (x.ATK + (x.ATK_P_BOOST) * baseATK);
`,s=A=>A.BASIC_ADDITIONAL_DMG.buff(A.a[a.BASIC_ADDITIONAL_DMG_SCALING]*A.a[a.HP],_.NONE),G=A=>A.ULT_ADDITIONAL_DMG.buff(A.a[a.ULT_ADDITIONAL_DMG_SCALING]*A.a[a.HP],_.NONE),e=A=>A.FUA_ADDITIONAL_DMG.buff(A.a[a.FUA_ADDITIONAL_DMG_SCALING]*A.a[a.HP],_.NONE),l=()=>`x.BASIC_ADDITIONAL_DMG += x.BASIC_ADDITIONAL_DMG_SCALING * x.HP;
`,u=()=>`x.ULT_ADDITIONAL_DMG += x.ULT_ADDITIONAL_DMG_SCALING * x.HP;
`,d=()=>`x.FUA_ADDITIONAL_DMG += x.FUA_ADDITIONAL_DMG_SCALING * x.HP;
`;function r(A){A.BASIC_ADDITIONAL_DMG.buff(A.a[a.BASIC_ADDITIONAL_DMG_SCALING]*D(A,0),_.NONE),A.SKILL_ADDITIONAL_DMG.buff(A.a[a.SKILL_ADDITIONAL_DMG_SCALING]*D(A,0),_.NONE),A.ULT_ADDITIONAL_DMG.buff(A.a[a.ULT_ADDITIONAL_DMG_SCALING]*D(A,0),_.NONE),A.FUA_ADDITIONAL_DMG.buff(A.a[a.FUA_ADDITIONAL_DMG_SCALING]*D(A,0),_.NONE)}function o(){return`
x.BASIC_ADDITIONAL_DMG += x.BASIC_ADDITIONAL_DMG_SCALING * (x.ATK + (x.ATK_P_BOOST) * baseATK);
x.SKILL_ADDITIONAL_DMG += x.SKILL_ADDITIONAL_DMG_SCALING * (x.ATK + (x.ATK_P_BOOST) * baseATK);
x.ULT_ADDITIONAL_DMG += x.ULT_ADDITIONAL_DMG_SCALING * (x.ATK + (x.ATK_P_BOOST) * baseATK);
x.FUA_ADDITIONAL_DMG += x.FUA_ADDITIONAL_DMG_SCALING * (x.ATK + (x.ATK_P_BOOST) * baseATK);
`}function D(A,I){return A.a[a.ATK]+(I+A.a[a.ATK_P_BOOST])*A.a[a.BASE_ATK]}function E(A,I,L,n){A.FUA_ATK_P_BOOST.buff(i(A,I,L,n),_.NONE)}function f(A){return`x.FUA_ATK_P_BOOST += calculateAshblazingSetP(sets.TheAshblazingGrandDuke, action.setConditionals.valueTheAshblazingGrandDuke, ${A});`}function H(A){A.HEAL_VALUE.buff(A.a[a.HEAL_SCALING]*A.a[a.HP]+A.a[a.HEAL_FLAT],_.NONE)}function F(A){A.HEAL_VALUE.buff(A.a[a.HEAL_SCALING]*A.a[a.ATK]+A.a[a.HEAL_FLAT],_.NONE)}function C(A){A.HEAL_VALUE.buff(A.a[a.HEAL_FLAT],_.NONE)}function M(){return`
x.HEAL_VALUE += x.HEAL_SCALING * x.ATK + x.HEAL_FLAT;
`}function c(){return`
x.HEAL_VALUE += x.HEAL_SCALING * x.HP + x.HEAL_FLAT;
`}function U(){return`
x.HEAL_VALUE += x.HEAL_FLAT;
`}function b(A){A.SHIELD_VALUE.buff(A.a[a.SHIELD_SCALING]*A.a[a.DEF]+A.a[a.SHIELD_FLAT],_.NONE)}function K(){return`
x.SHIELD_VALUE += x.SHIELD_SCALING * x.DEF + x.SHIELD_FLAT;
`}export{K as a,E as b,r as c,o as d,N as e,H as f,f as g,c as h,F as i,M as j,C as k,U as l,S as m,O as n,s as o,G as p,e as q,l as r,b as s,u as t,t as u,d as v};
