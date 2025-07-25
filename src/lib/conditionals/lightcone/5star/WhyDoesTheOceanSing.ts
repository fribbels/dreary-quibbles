import i18next from 'i18next'
import { DOT_DMG_TYPE } from 'lib/conditionals/conditionalConstants'
import {
  Conditionals,
  ContentDefinition,
} from 'lib/conditionals/conditionalUtils'
import { CURRENT_DATA_VERSION } from 'lib/constants/constants'
import { Source } from 'lib/optimization/buffSource'
import { buffAbilityDefPen } from 'lib/optimization/calculateBuffs'
import { ComputedStatsArray } from 'lib/optimization/computedStatsArray'
import { WHY_DOES_THE_OCEAN_SING } from 'lib/simulations/tests/testMetadataConstants'
import { TsUtils } from 'lib/utils/TsUtils'
import { LightConeConditionalsController } from 'types/conditionals'
import { SuperImpositionLevel } from 'types/lightCone'
import {
  OptimizerAction,
  OptimizerContext,
} from 'types/optimizer'

export default (s: SuperImpositionLevel, withContent: boolean): LightConeConditionalsController => {
  // const t = TsUtils.wrappedFixedT(withContent).get(null, 'conditionals', 'Lightcones.ReforgedRemembrance')
  const { SOURCE_LC } = Source.lightCone(WHY_DOES_THE_OCEAN_SING)

  const sValuesDotVuln = [0.05, 0.0625, 0.075, 0.0875, 0.10]
  const sValuesSpd = [0.10, 0.125, 0.15, 0.175, 0.20]

  const defaults = {
    dotVulnStacks: 6,
    spdBuff: true,
  }

  const teammateDefaults = {
    dotVulnStacks: 6,
    spdBuff: true,
  }

  const content: ContentDefinition<typeof defaults> = {
    dotVulnStacks: {
      lc: true,
      id: 'dotVulnStacks',
      formItem: 'slider',
      text: 'DOT vulnerability stacks',
      content: i18next.t('BetaMessage', { ns: 'conditionals', Version: CURRENT_DATA_VERSION }),
      min: 0,
      max: 6,
    },
    spdBuff: {
      lc: true,
      id: 'spdBuff',
      formItem: 'switch',
      text: 'SPD buff',
      content: i18next.t('BetaMessage', { ns: 'conditionals', Version: CURRENT_DATA_VERSION }),
    },
  }

  const teammateContent: ContentDefinition<typeof teammateDefaults> = {
    dotVulnStacks: content.dotVulnStacks,
    spdBuff: content.spdBuff,
  }

  return {
    content: () => Object.values(content),
    teammateContent: () => Object.values(teammateContent),
    defaults: () => defaults,
    teammateDefaults: () => teammateDefaults,
    precomputeEffects: (x: ComputedStatsArray, action: OptimizerAction, context: OptimizerContext) => {
      const r = action.lightConeConditionals as Conditionals<typeof content>
    },
    precomputeMutualEffects: (x: ComputedStatsArray, action: OptimizerAction, context: OptimizerContext) => {
      const m = action.lightConeConditionals as Conditionals<typeof teammateContent>

      x.DOT_VULNERABILITY.buffTeam(m.dotVulnStacks * sValuesDotVuln[s], SOURCE_LC)
      x.SPD_P.buffTeam((m.spdBuff) ? sValuesSpd[s] : 0, SOURCE_LC)
    },
    finalizeCalculations: () => {
    },
  }
}
