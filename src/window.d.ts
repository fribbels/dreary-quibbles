import { WorkerPool } from 'lib/workerPool'
import { Constants } from 'lib/constants'
import { DataParser } from 'lib/dataParser'
import { OptimizerTabController } from 'lib/optimizerTabController'
import { DB } from 'lib/db'
import { CharacterStats } from 'lib/characterStats'
import { Utils } from 'lib/utils'
import { Assets } from 'lib/assets'
import { RelicAugmenter } from 'lib/relicAugmenter'
import { StatCalculator } from 'lib/statCalculator'
import { Gradient } from 'lib/gradient'
import { SaveState } from 'lib/saveState'
import { RelicFilters } from 'lib/relicFilters'
import { Renderer } from 'lib/renderer'
import { Message } from 'lib/message'
import { Hint } from 'lib/hint'
import { CharacterConverter } from 'lib/characterConverter'
import { RelicScorer } from 'lib/relicScorerPotential'
import { CharacterConditionals } from 'lib/characterConditionals'
import { LightConeConditionals } from 'lib/lightConeConditionals'
import { BufferPacker } from 'lib/bufferPacker'
import { RelicRollFixer } from 'lib/relicRollFixer'
import { NotificationInstance } from 'antd/es/notification/interface'
import { MessageInstance } from 'antd/es/message/interface'
import { StoreApi, UseBoundStore } from 'zustand'
import { HsrOptimizerStore } from 'types/store'
import { Build, Character } from 'types/Character'
import { Relic } from 'types/Relic'
import { AgGridReact } from 'ag-grid-react'
import { DispatchWithoutAction, RefObject } from 'react'
import { Hero } from './types/calc'
import { FormInstance } from 'antd/es/form/hooks/useForm'
import { ColorThemeOverrides } from 'lib/theme.ts'
import { HookAPI } from 'antd/lib/modal/useModal'

declare global {
  interface Window {
    notificationApi: NotificationInstance
    messageApi: MessageInstance
    modalApi: HookAPI
    store: UseBoundStore<StoreApi<HsrOptimizerStore>>
    colorTheme: ColorThemeOverrides

    characterGrid: RefObject<AgGridReact<Character>>
    relicsGrid: RefObject<AgGridReact<Relic>>
    optimizerGrid: RefObject<AgGridReact<Hero>>

    setCharacterRows: (characters: Character[]) => void
    setRelicRows: (characters: Relic[]) => void
    setOptimizerBuild: (build?: Build) => void
    setSelectedRelic: (relic: Partial<Relic>) => void
    setEditModalOpen: (open: boolean) => void

    // TODO see OptimizerForm
    onOptimizerFormValuesChange: (...args: unknown[]) => unknown
    optimizerForm: FormInstance
    statSimulationForm: FormInstance

    forceOptimizerBuildPreviewUpdate: DispatchWithoutAction
    forceCharacterTabUpdate: DispatchWithoutAction
    refreshRelicsScore: DispatchWithoutAction

    rescoreSingleRelic: (relic: Relic) => void

    WorkerPool: typeof WorkerPool
    Constants: typeof Constants
    DataParser: typeof DataParser
    OptimizerTabController: typeof OptimizerTabController
    DB: typeof DB
    CharacterStats: typeof CharacterStats
    Utils: typeof Utils
    Assets: typeof Assets
    RelicAugmenter: typeof RelicAugmenter
    StatCalculator: typeof StatCalculator
    Gradient: typeof Gradient
    SaveState: typeof SaveState
    RelicFilters: typeof RelicFilters
    Renderer: typeof Renderer
    Message: typeof Message
    Hint: typeof Hint
    CharacterConverter: typeof CharacterConverter
    RelicScorer: typeof RelicScorer
    CharacterConditionals: typeof CharacterConditionals
    LightConeConditionals: typeof LightConeConditionals
    BufferPacker: typeof BufferPacker
    RelicRollFixer: typeof RelicRollFixer

    WEBGPU_DEBUG: boolean
  }
}
