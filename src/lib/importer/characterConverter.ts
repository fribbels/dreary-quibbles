import {
  Constants,
  MainStats,
  Parts,
  SubStats,
} from 'lib/constants/constants'
import { RelicAugmenter } from 'lib/relics/relicAugmenter'
import DB from 'lib/state/db'
import { ShowcaseTabCharacter } from 'lib/tabs/tabShowcase/useShowcaseTabStore'
import { Utils } from 'lib/utils/utils'
import { CharacterId } from 'types/character'
import { LightCone } from 'types/lightCone'
import { Relic } from 'types/relic'

// FIXME MED

const partConversion = {
  1: Constants.Parts.Head,
  2: Constants.Parts.Hands,
  3: Constants.Parts.Body,
  4: Constants.Parts.Feet,
  5: Constants.Parts.PlanarSphere,
  6: Constants.Parts.LinkRope,
}
const gradeConversion = {
  6: 5,
  5: 4,
  4: 3,
  3: 2,
}
export const statConversion = {
  HPAddedRatio: Constants.Stats.HP_P,
  AttackAddedRatio: Constants.Stats.ATK_P,
  DefenceAddedRatio: Constants.Stats.DEF_P,
  HPDelta: Constants.Stats.HP,
  AttackDelta: Constants.Stats.ATK,
  DefenceDelta: Constants.Stats.DEF,
  SpeedDelta: Constants.Stats.SPD,
  CriticalDamageBase: Constants.Stats.CD,
  CriticalChanceBase: Constants.Stats.CR,
  StatusProbabilityBase: Constants.Stats.EHR,
  StatusResistanceBase: Constants.Stats.RES,
  BreakDamageAddedRatioBase: Constants.Stats.BE,
  SPRatioBase: Constants.Stats.ERR,
  HealRatioBase: Constants.Stats.OHB,
  PhysicalAddedRatio: Constants.Stats.Physical_DMG,
  FireAddedRatio: Constants.Stats.Fire_DMG,
  IceAddedRatio: Constants.Stats.Ice_DMG,
  ThunderAddedRatio: Constants.Stats.Lightning_DMG,
  WindAddedRatio: Constants.Stats.Wind_DMG,
  QuantumAddedRatio: Constants.Stats.Quantum_DMG,
  ImaginaryAddedRatio: Constants.Stats.Imaginary_DMG,
}

export type UnconvertedCharacter = {
  relicList?: PreRelic[],
  equipment?: PreLightCone,
  rank?: number,
  avatarId: CharacterId,
}

type PreRelic = {
  tid: string,
  level: number,
  mainAffixId: number,
  main_affix: {
    type: keyof typeof statConversion,
  },
  subAffixList: SubAffix[],
}

interface SubAffixBase {
  affixId: number
  type: keyof typeof statConversion
  step: number
}

interface SubAffixCnt extends SubAffixBase {
  cnt: number
  count?: never
}

interface SubAffixCount extends SubAffixBase {
  cnt?: never
  count: number
}

type SubAffix = SubAffixCnt | SubAffixCount

type PreLightCone = {
  tid: LightCone['id'],
  level: number,
  rank: number,
}

export const CharacterConverter = {
  convert: (character: UnconvertedCharacter): ShowcaseTabCharacter => {
    const preRelics = character.relicList ?? []
    const preLightCone = character.equipment
    const characterEidolon = character.rank ?? 0
    const id = '' + character.avatarId as CharacterId
    const lightConeId = preLightCone ? ('' + preLightCone.tid) as LightCone['id'] : null
    const lightConeSuperimposition = preLightCone ? preLightCone.rank : 0

    const relics = preRelics
      .map((x) => convertRelic(x))
      .filter((x): x is NonNullable<typeof x> => !!x)
    const equipped = {} as Record<Parts, Relic>
    for (const relic of relics) {
      relic.equippedBy = id
      equipped[relic.part] = relic
    }

    return {
      id: id,
      key: Utils.randomId(),
      index: 0, // gets overwritten later
      form: {
        characterId: id,
        characterEidolon: characterEidolon,
        lightCone: lightConeId,
        lightConeSuperimposition: lightConeSuperimposition,
      },
      equipped: equipped,
    }
  },

  getConstantConversions: () => {
    return {
      statConversion,
      partConversion,
      gradeConversion,
    }
  },
}

// Some special relics have a weird id -> set/part/main mapping
const tidOverrides = {
  55001: { set: '101', part: '3', main: '436' },
  55002: { set: '101', part: '4', main: '441' },
  55003: { set: '102', part: '3', main: '434' },
  55004: { set: '103', part: '3', main: '433' },
  55005: { set: '103', part: '4', main: '443' },
  55006: { set: '105', part: '3', main: '434' },
}

function convertRelic(preRelic: PreRelic) {
  try {
    const metadata = DB.getMetadata().relics
    const tid = '' + preRelic.tid

    const enhance: Relic['enhance'] = preRelic.level || 0

    let setId = tid.substring(1, 4)
    // @ts-ignore
    if (tidOverrides[tid]) {
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      setId = tidOverrides[tid].set
    }
    const setName = metadata.relicSets[setId].name

    let partId = tid.substring(4, 5) as '1' | '2' | '3' | '4' | '5' | '6'
    // @ts-ignore
    if (tidOverrides[tid]) {
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      partId = tidOverrides[tid].part
    }
    const partName: Relic['part'] = partConversion[partId]

    const gradeId = tid.substring(0, 1) as '3' | '4' | '5' | '6'
    const grade: Relic['grade'] = gradeConversion[gradeId]

    let mainId = preRelic.mainAffixId
    if (!mainId) {
      mainId = Number(
        Object.values(metadata.relicMainAffixes[`${grade}${partId}`].affixes)
          .find((x) => x.property == preRelic.main_affix.type)!.affix_id,
      )
    }
    let mainData = metadata.relicMainAffixes[`${grade}${partId}`].affixes[mainId]
    // @ts-ignore
    if (tidOverrides[tid]) {
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      mainData = metadata.relicMainAffixes[tidOverrides[tid].main].affixes[mainId]
    }

    const mainStat = statConversion[mainData.property] as MainStats
    const mainBase = mainData.base
    const mainStep = mainData.step
    const mainValue = mainBase + mainStep * enhance

    const main: Relic['main'] = {
      stat: mainStat,
      value: Utils.precisionRound(mainValue * (Utils.isFlat(mainStat) ? 1 : 100), 5),
    }

    const substats: Relic['substats'] = []
    for (const sub of preRelic.subAffixList) {
      let subId = sub.affixId
      if (!subId) {
        subId = Number(
          Object.values(metadata.relicSubAffixes[`${grade}`].affixes)
            .find((x) => x.property == sub.type)!.affix_id,
        )
      }
      const count: number = sub.cnt ?? sub.count
      const step: number = sub.step || 0

      const subData = metadata.relicSubAffixes[grade].affixes[subId]
      const subStat = statConversion[subData.property] as SubStats
      const subBase = subData.base
      const subStep = subData.step

      const subValue = subBase * count + subStep * step

      if (count != undefined && step != undefined) {
        const rolls = rollCounter(count, step).rolls

        substats.push({
          stat: subStat,
          value: Utils.precisionRound(subValue * (Utils.isFlat(subStat) ? 1 : 100), 5),
          addedRolls: Math.max(0, count - 1),
          rolls,
        })
      } else {
        substats.push({
          stat: subStat,
          value: Utils.precisionRound(subValue * (Utils.isFlat(subStat) ? 1 : 100), 5),
        })
      }
    }

    const relic = {
      verified: true,
      part: partName,
      set: setName,
      enhance: enhance,
      grade: grade,
      main: main,
      substats: substats,
    }

    return RelicAugmenter.augment(relic)
  } catch (e) {
    console.error(e)
    return null
  }
}

export function rollCounter(count: number | undefined, step: number | undefined) {
  const rolls: Relic['substats'][number]['rolls'] = { high: 0, mid: 0, low: 0 }
  let errorFlag = false
  if (count != undefined && step != undefined) {
    rolls.low = count

    for (let i = 0; i < step; i++) {
      if (rolls.low == 0) {
        rolls.high++
        rolls.mid--
      } else {
        rolls.mid++
        rolls.low--
      }
    }
    if (
      rolls.high > count
      || rolls.mid < 0
      || rolls.low < 0
    ) errorFlag = true

    rolls.high = Math.min(count, rolls.high)
    rolls.mid = Math.max(0, rolls.mid)
    rolls.low = Math.max(0, rolls.low)
  } else {
    errorFlag = true
  }
  return { rolls, errorFlag }
}
