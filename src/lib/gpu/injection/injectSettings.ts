import { Stats } from 'lib/constants/constants'
import { indent } from 'lib/gpu/injection/wgslUtils'
import { SortOption } from 'lib/optimization/sortOptions'
import { Form } from 'types/form'
import { OptimizerContext } from 'types/optimizer'

export function injectSettings(wgsl: string, context: OptimizerContext, request: Form) {
  wgsl += generateCharacterStats(context.characterStatsBreakdown.base, 'character')
  wgsl += generateCharacterStats(context.characterStatsBreakdown.lightCone, 'lc')
  wgsl += generateCharacterStats(context.characterStatsBreakdown.traces, 'trace')
  wgsl += generateAggregateStats()
  wgsl += generateElement(context)
  wgsl += generateRequest(request)
  wgsl += generateActions(context)

  wgsl += '\n'

  return wgsl
}

function generateActions(context: OptimizerContext) {
  const actionLength = context.resultSort == SortOption.COMBO.key ? context.actions.length : 1
  let actionSwitcher = ``
  for (let i = 0; i < actionLength; i++) {
    actionSwitcher += indent(`case ${i}: { (*outAction) = action${i}; (*outX) = computedStatsX${i}; (*outM) = computedStatsM${i}; }\n`, 0)
  }

  const wgsl = `
fn getAction(actionIndex: i32, outAction: ptr<function, Action>, outX: ptr<function, ComputedStats>, outM: ptr<function, ComputedStats>) {
  switch (actionIndex) {
    ${actionSwitcher}
    default: { 
      (*outAction) = action0; 
    }
  }
}
  `

  return wgsl
}

function generateAggregateStats() {
  return `
const baseHP = characterHP + lcHP;
const baseATK = characterATK + lcATK;
const baseDEF = characterDEF + lcDEF;
const baseSPD = characterSPD + lcSPD;
  `
}

function generateRequest(request: Form) {
  let wgsl = '\n'

  // "combat" == 0 / "base" == 1
  wgsl += `const statDisplay: i32 = ${request.statDisplay == 'combat' ? 0 : 1};\n`
  wgsl += '\n'

  // Enemy
  wgsl += `const enemyCount: i32 = ${request.enemyCount};\n`
  wgsl += `const enemyElementalWeak: i32 = ${request.enemyElementalWeak ? 1 : 0};\n`
  wgsl += `const enemyLevel: i32 = ${request.enemyLevel};\n`
  wgsl += `const enemyMaxToughness: f32 = ${request.enemyMaxToughness};\n`
  wgsl += `const enemyResistance: f32 = ${request.enemyResistance};\n`
  wgsl += `const enemyEffectResistance: f32 = ${request.enemyEffectResistance};\n`
  wgsl += `const enemyWeaknessBroken: i32 = ${request.enemyWeaknessBroken ? 1 : 0};\n`
  wgsl += '\n'

  // TODO: Refactor this to not duplicate res
  wgsl += `const resistance: f32 = ${(request.enemyElementalWeak ? 0 : request.enemyResistance) - request.combatBuffs.RES_PEN};\n`
  wgsl += '\n'

  // Filters
  for (const [key, value] of Object.entries(request)) {
    if (!key.includes('Weight') && (key.startsWith('min') || key.startsWith('max'))) {
      wgsl += `const ${key}: f32 = ${value};\n`
    }
  }
  wgsl += '\n'

  // Buffs
  for (const [key, value] of Object.entries(request.combatBuffs)) {
    wgsl += `const combatBuffs${key}: f32 = ${value};\n`
  }
  wgsl += '\n'

  // Eidolon
  wgsl += `const e: i32 = ${request.characterEidolon};\n`
  wgsl += '\n'

  return wgsl
}

function generateElement(context: OptimizerContext) {
  let wgsl = '\n'

  wgsl += `const ELEMENT_INDEX: i32 = ${paramElementToIndex[context.elementalDamageType]};\n`
  wgsl += `const ELEMENTAL_BREAK_SCALING: f32 = ${context.elementalBreakScaling};\n`

  return wgsl
}

function generateCharacterStats(characterStats: { [key: string]: number }, prefix: string) {
  let wgsl = '\n'

  for (const [name, stat] of Object.entries(paramStatNames)) {
    wgsl += `const ${prefix}${name}: f32 = ${characterStats[stat]};\n`
  }

  return wgsl
}

const paramStatNames = {
  HP_P: Stats.HP_P,
  ATK_P: Stats.ATK_P,
  DEF_P: Stats.DEF_P,
  SPD_P: Stats.SPD_P,
  HP: Stats.HP,
  ATK: Stats.ATK,
  DEF: Stats.DEF,
  SPD: Stats.SPD,
  CR: Stats.CR,
  CD: Stats.CD,
  EHR: Stats.EHR,
  RES: Stats.RES,
  BE: Stats.BE,
  ERR: Stats.ERR,
  OHB: Stats.OHB,
  Physical_DMG: Stats.Physical_DMG,
  Fire_DMG: Stats.Fire_DMG,
  Ice_DMG: Stats.Ice_DMG,
  Lightning_DMG: Stats.Lightning_DMG,
  Wind_DMG: Stats.Wind_DMG,
  Quantum_DMG: Stats.Quantum_DMG,
  Imaginary_DMG: Stats.Imaginary_DMG,
}

const paramElementToIndex = {
  [Stats.Physical_DMG]: 0,
  [Stats.Fire_DMG]: 1,
  [Stats.Ice_DMG]: 2,
  [Stats.Lightning_DMG]: 3,
  [Stats.Wind_DMG]: 4,
  [Stats.Quantum_DMG]: 5,
  [Stats.Imaginary_DMG]: 6,
}
