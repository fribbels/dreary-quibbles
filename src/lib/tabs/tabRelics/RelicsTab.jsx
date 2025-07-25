import { AgGridReact } from 'ag-grid-react'
import {
  Button,
  Collapse,
  Flex,
  Popconfirm,
  Select,
  theme,
  Tooltip,
} from 'antd'
import {
  Constants,
  Stats,
} from 'lib/constants/constants'

import { OpenCloseIDs } from 'lib/hooks/useOpenClose'
import { arrowKeyGridNavigation } from 'lib/interactions/arrowKeyGridNavigation'
import { Hint } from 'lib/interactions/hint'
import { Message } from 'lib/interactions/message'
import RelicModal from 'lib/overlays/modals/RelicModal.tsx'
import { RelicModalController } from 'lib/overlays/modals/relicModalController'
import { RelicScorer } from 'lib/relics/relicScorerPotential'
import { Assets } from 'lib/rendering/assets'
import { Gradient } from 'lib/rendering/gradient'
import { Renderer } from 'lib/rendering/renderer'
import { getGridTheme } from 'lib/rendering/theme'
import DB from 'lib/state/db'
import { SaveState } from 'lib/state/saveState'
import { RecentRelics } from 'lib/tabs/tabRelics/RecentRelics'
import RelicFilterBar from 'lib/tabs/tabRelics/RelicFilterBar'
import { RelicLocator } from 'lib/tabs/tabRelics/RelicLocator.js'
import { RelicPreview } from 'lib/tabs/tabRelics/RelicPreview'
import { TooltipImage } from 'lib/ui/TooltipImage'
import { currentLocale } from 'lib/utils/i18nUtils.js'
import Plotly from 'plotly.js/dist/plotly-basic'
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import createPlotlyComponent from 'react-plotly.js/factory'
import { useScannerState } from '../tabImport/ScannerWebsocketClient'

const Plot = createPlotlyComponent(Plotly)

const { useToken } = theme

const PLOT_ALL = 'PLOT_ALL'
const PLOT_CUSTOM = 'PLOT_CUSTOM'

const TAB_WIDTH = 1460

export default function RelicsTab() {
  const { token } = useToken()

  // TODO: This is currently rerendering the whole tab on every relic click, revisit
  console.log('======================================================================= RENDER RelicsTab')
  const gridRef = useRef()
  window.relicsGrid = gridRef

  const [relicRows, setRelicRows] = useState(DB.getRelics())
  window.setRelicRows = setRelicRows

  const [selectedRelicID, setSelectedRelicID] = useState()
  const [selectedRelicIDs, setSelectedRelicIDs] = useState([])
  window.setSelectedRelicIDs = (ids) => {
    setSelectedRelicID(ids[0])
    setSelectedRelicIDs(ids)

    // Ensure the grid is updated with the latest data
    window.relicsGrid.current.api.updateGridOptions({ rowData: DB.getRelics() })

    // Get the row nodes for the selected relics
    const rowNodes = ids.map((id) => window.relicsGrid.current?.api.getRowNode(id)).filter((x) => x)

    // Deselect all rows
    window.relicsGrid.current.api.deselectAll()

    // Select the new rows
    window.relicsGrid.current.api.setNodesSelected({ nodes: rowNodes, newValue: true, source: 'api' })

    // Ensure the new rows are visible
    window.relicsGrid.current.api.ensureNodeVisible(rowNodes[0])

    if (rowNodes.length > 1) {
      window.relicsGrid.current.api.ensureNodeVisible(rowNodes[rowNodes.length - 1])
    }
  }

  // TODO: Can/should we memoize these?
  const selectedRelic = DB.getRelicById(selectedRelicID)
  const selectedRelics = DB.getRelics().filter((x) => selectedRelicIDs.includes(x.id))

  const [editModalOpen, setEditModalOpen] = useState(false)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [plottedCharacterType, setPlottedCharacterType] = useState(PLOT_CUSTOM)
  const [relicInsight, setRelicInsight] = useState('buckets')
  const [gridDestroyed, setGridDestroyed] = useState(false)

  const isLiveImport = useScannerState((s) => s.ingest)
  const hasRecentRelics = useScannerState((s) => s.recentRelics.length > 0)

  const relicTabFilters = window.store((s) => s.relicTabFilters)

  const { t, i18n } = useTranslation(['relicsTab', 'common', 'gameData'])
  const initialLanguage = useRef(i18n.resolvedLanguage)

  const relicInsightOptions = [
    { value: 'buckets', label: t('Toolbar.InsightOptions.Buckets') /* Relic Insight: Buckets */ },
    { value: 'top10', label: t('Toolbar.InsightOptions.Top10') /* Relic Insight: Top 10 */ },
  ]
  const characterPlotOptions = [
    { value: PLOT_ALL, label: t('Toolbar.PlotOptions.PlotAll') /* Show all characters */ },
    { value: PLOT_CUSTOM, label: t('Toolbar.PlotOptions.PlotCustom') /* Show custom characters */ },
  ]

  useEffect(() => {
    // locale updates require the grid to be destroyed and reconstructed in order to take effect
    if (i18n.resolvedLanguage !== initialLanguage.current) {
      setGridDestroyed(true)
      setTimeout(() => setGridDestroyed(false), 100)
    }
  }, [i18n.resolvedLanguage])

  useEffect(() => {
    if (!window.relicsGrid?.current?.api) return
    console.log('RelicTabFilters', relicTabFilters)

    if (Object.values(relicTabFilters).filter((x) => x.length > 0).length == 0) {
      window.relicsGrid.current.api.setFilterModel(null)
      return
    }

    // Calculate filter conditions
    const filterModel = {}

    filterModel.set = {
      conditions: relicTabFilters.set.map((x) => ({
        filterType: 'text',
        type: 'equals',
        filter: x,
      })),
      operator: 'OR',
    }

    filterModel.part = {
      conditions: relicTabFilters.part.map((x) => ({
        filterType: 'text',
        type: 'equals',
        filter: x,
      })),
      operator: 'OR',
    }

    filterModel.grade = {
      conditions: relicTabFilters.grade.map((x) => ({
        filterType: 'number',
        type: 'equals',
        filter: x,
      })),
      operator: 'OR',
    }

    filterModel.verified = {
      conditions: [
        relicTabFilters.verified.includes('true') && {
          filterType: 'text',
          type: 'true',
        },
        relicTabFilters.verified.includes('false') && {
          filterType: 'text',
          type: 'false',
        },
      ],
      operator: 'OR',
    }

    filterModel.initialRolls = {
      conditions: relicTabFilters.initialRolls.map((x) => ({
        filterType: 'number',
        type: 'equals',
        filter: x,
      })),
      operator: 'OR',
    }

    filterModel.equippedBy = {
      conditions: [
        relicTabFilters.equippedBy.includes('true') && {
          filterType: 'text',
          type: 'notBlank',
        },
        relicTabFilters.equippedBy.includes('false') && {
          filterType: 'text',
          type: 'blank',
        },
      ],
      operator: 'OR',
    }

    filterModel['main.stat'] = {
      conditions: relicTabFilters.mainStats.map((x) => ({
        filterType: 'text',
        type: 'equals',
        filter: x,
      })),
      operator: 'OR',
    }

    // Substats have to filter augmented stats individually
    for (const substatFilter of relicTabFilters.subStats) {
      filterModel[`augmentedStats.${substatFilter}`] = {
        filterType: 'number',
        type: 'greaterThan',
        filter: 0,
      }
    }

    // Enhance includes a range from x to x + 2
    filterModel.enhance = {
      conditions: relicTabFilters.enhance.flatMap((x) => [
        {
          filterType: 'number',
          type: 'equals',
          filter: x,
        },
        {
          filterType: 'number',
          type: 'equals',
          filter: x + 1,
        },
        {
          filterType: 'number',
          type: 'equals',
          filter: x + 2,
        },
      ]),
      operator: 'OR',
    }

    console.log('FilterModel', filterModel)

    // Apply to grid
    window.relicsGrid.current.api.setFilterModel(filterModel)
  }, [relicTabFilters])

  const valueColumnOptions = useMemo(() => [
    {
      label: t('RelicGrid.ValueColumns.SelectedCharacter.Label'), /* Selected character */
      options: [
        /* 'Selected Char\nScore' | 'Selected character: Score' */
        {
          column: t('RelicGrid.ValueColumns.SelectedCharacter.ScoreCol.Header'),
          value: 'weights.current',
          label: t('RelicGrid.ValueColumns.SelectedCharacter.ScoreCol.Label'),
        },
        /* 'Selected Char\nAvg Potential' | 'Selected character: Average potential' */
        {
          column: t('RelicGrid.ValueColumns.SelectedCharacter.AvgPotCol.Header'),
          value: 'weights.potentialSelected.averagePct',
          label: t('RelicGrid.ValueColumns.SelectedCharacter.AvgPotCol.Label'),
          percent: true,
        },
        /* 'Selected Char\nMax Potential' | 'Selected character: Max potential' */
        {
          column: t('RelicGrid.ValueColumns.SelectedCharacter.MaxPotCol.Header'),
          value: 'weights.potentialSelected.bestPct',
          label: t('RelicGrid.ValueColumns.SelectedCharacter.MaxPotCol.Label'),
          percent: true,
        },
        // Selected Char\nReroll Avg | Selected character: Reroll average potential
        {
          column: t('RelicGrid.ValueColumns.SelectedCharacter.RerollAvg.Header'),
          value: 'weights.rerollAvgSelected',
          label: t('RelicGrid.ValueColumns.SelectedCharacter.RerollAvg.Label'),
          percent: true,
        },
        // Selected Char\nΔ Reroll Avg | Selected character: Reroll average delta potential
        {
          column: t('RelicGrid.ValueColumns.SelectedCharacter.RerollAvgDelta.Header'),
          value: 'weights.rerollAvgSelectedDelta',
          label: t('RelicGrid.ValueColumns.SelectedCharacter.RerollAvgDelta.Label'),
          percent: true,
        },
        // Selected Char\n∆ Reroll AVG\nVS Equipped | Selected character: Reroll average delta potential vs equipped
        {
          column: t('RelicGrid.ValueColumns.SelectedCharacter.RerollAvgEquippedDelta.Header'),
          value: 'weights.rerollAvgSelectedEquippedDelta',
          label: t('RelicGrid.ValueColumns.SelectedCharacter.RerollAvgEquippedDelta.Label'),
          percent: true,
        },
      ],
    },
    {
      label: t('RelicGrid.ValueColumns.CustomCharacters.Label'), /* Custom characters */
      options: [
        /* 'Custom Chars\nAvg Potential' | 'Custom characters: Average potential' */
        {
          column: t('RelicGrid.ValueColumns.CustomCharacters.AvgPotCol.Header'),
          value: 'weights.potentialAllCustom.averagePct',
          label: t('RelicGrid.ValueColumns.CustomCharacters.AvgPotCol.Label'),
          percent: true,
        },
        /* 'Custom Chars\nMax Potential' | 'Custom characters: Max potential' */
        {
          column: t('RelicGrid.ValueColumns.CustomCharacters.MaxPotCol.Header'),
          value: 'weights.potentialAllCustom.bestPct',
          label: t('RelicGrid.ValueColumns.CustomCharacters.MaxPotCol.Label'),
          percent: true,
        },
        // Custom Chars\nAvg Reroll | Custom characters: Average reroll potential
        {
          column: t('RelicGrid.ValueColumns.CustomCharacters.RerollAvg.Header'),
          value: 'weights.rerollAllCustom.rerollAvgPct',
          label: t('RelicGrid.ValueColumns.CustomCharacters.RerollAvg.Label'),
          percent: true,
        },
      ],
    },
    {
      label: t('RelicGrid.ValueColumns.AllCharacters.Label'), /* All characters */
      options: [
        /* 'All Chars\nAvg Potential' | 'All characters: Average potential' */
        {
          column: t('RelicGrid.ValueColumns.AllCharacters.AvgPotCol.Header'),
          value: 'weights.potentialAllAll.averagePct',
          label: t('RelicGrid.ValueColumns.AllCharacters.AvgPotCol.Label'),
          percent: true,
        },
        /* 'All Chars\nMax Potential' | 'All characters: Max potential' */
        {
          column: t('RelicGrid.ValueColumns.AllCharacters.MaxPotCol.Header'),
          value: 'weights.potentialAllAll.bestPct',
          label: t('RelicGrid.ValueColumns.AllCharacters.MaxPotCol.Label'),
          percent: true,
        },
        // All Chars\nAvg Reroll | All characters: Average reroll potential
        {
          column: t('RelicGrid.ValueColumns.AllCharacters.RerollAvg.Header'),
          value: 'weights.rerollAllAll.rerollAvgPct',
          label: t('RelicGrid.ValueColumns.AllCharacters.RerollAvg.Label'),
          percent: true,
        },
      ],
    },
    {
      label: t('RelicGrid.ValueColumns.ComingSoon.Label'), /* Coming soon */
      options: [
        /* 'Relic / Ornament sets potential' | 'All Chars\nMax Potential + Sets' */
        {
          column: t('RelicGrid.ValueColumns.ComingSoon.SetsPotential.Header'),
          disabled: true,
          value: 'weights.potentialAllSets',
          label: t('RelicGrid.ValueColumns.ComingSoon.SetsPotential.Label'),
          percent: true,
        },
      ],
    },
  ], [t])

  const flatValueColumnOptions = useMemo(() => valueColumnOptions.flatMap((x) => x.options), [valueColumnOptions])

  const [valueColumns, setValueColumns] = useState([
    'weights.current',
    'weights.rerollAvgSelected',
    'weights.rerollAvgSelectedDelta',
    'weights.potentialSelected.averagePct',
    'weights.potentialSelected.bestPct',
    'weights.potentialAllCustom.averagePct',
    'weights.potentialAllCustom.bestPct',
  ])

  const columnDefs = useMemo(() =>
    [
      { field: 'verified', hide: true, filter: 'agTextColumnFilter', filterParams: { maxNumConditions: 2 } },
      { field: 'initialRolls', hide: true, filter: 'agNumberColumnFilter' },
      {
        field: 'equippedBy',
        headerName: t('RelicGrid.Headers.EquippedBy'), /* Owner */
        width: 40,
        cellRenderer: Renderer.characterIcon,
        filter: 'agTextColumnFilter',
      },
      {
        field: 'set',
        cellRenderer: Renderer.anySet,
        width: 40,
        headerName: t('RelicGrid.Headers.Set'), /* Set */
        filter: 'agTextColumnFilter',
      },
      {
        field: 'grade',
        width: 30,
        cellRenderer: Renderer.renderGradeCell,
        headerName: '★',
        headerClass: 'large-grid-column-header',
        filter: 'agNumberColumnFilter',
      },
      {
        field: 'enhance',
        width: 30,
        headerName: '+',
        headerClass: 'large-grid-column-header',
        filter: 'agNumberColumnFilter',
      },
      {
        field: 'part',
        valueFormatter: Renderer.readablePart,
        width: 55,
        headerName: t('RelicGrid.Headers.Part'), /* Part */
        filter: 'agTextColumnFilter',
      },
      {
        field: 'main.stat',
        valueFormatter: Renderer.readableStat,
        headerName: t('RelicGrid.Headers.MainStat'), /* Main\nStat */
        width: 78,
        filter: 'agTextColumnFilter',
      },
      {
        field: 'main.value',
        headerName: t('RelicGrid.Headers.MainValue'), /* Main Value */
        width: 50,
        valueFormatter: Renderer.mainValueRenderer,
        filter: 'agNumberColumnFilter',
      },
      {
        field: `augmentedStats.${Constants.Stats.HP_P}`,
        headerName: t('RelicGrid.Headers.HPP'), /* HP % */
        cellStyle: Gradient.getRelicGradient,
        valueFormatter: Renderer.hideZeroesX100Tenths,
        filter: 'agNumberColumnFilter',
      },
      {
        field: `augmentedStats.${Constants.Stats.ATK_P}`,
        headerName: t('RelicGrid.Headers.ATKP'), /* ATK % */
        cellStyle: Gradient.getRelicGradient,
        valueFormatter: Renderer.hideZeroesX100Tenths,
        filter: 'agNumberColumnFilter',
      },
      {
        field: `augmentedStats.${Constants.Stats.DEF_P}`,
        headerName: t('RelicGrid.Headers.DEFP'), /* DEF % */
        cellStyle: Gradient.getRelicGradient,
        valueFormatter: Renderer.hideZeroesX100Tenths,
        filter: 'agNumberColumnFilter',
      },
      {
        field: `augmentedStats.${Constants.Stats.HP}`,
        headerName: t('RelicGrid.Headers.HP'), /* HP */
        cellStyle: Gradient.getRelicGradient,
        valueFormatter: Renderer.hideZeroesFloor,
        filter: 'agNumberColumnFilter',
      },
      {
        field: `augmentedStats.${Constants.Stats.ATK}`,
        headerName: t('RelicGrid.Headers.ATK'), /* ATK */
        cellStyle: Gradient.getRelicGradient,
        valueFormatter: Renderer.hideZeroesFloor,
        filter: 'agNumberColumnFilter',
      },
      {
        field: `augmentedStats.${Constants.Stats.DEF}`,
        headerName: t('RelicGrid.Headers.DEF'), /* DEF */
        cellStyle: Gradient.getRelicGradient,
        valueFormatter: Renderer.hideZeroesFloor,
        filter: 'agNumberColumnFilter',
      },
      {
        field: `augmentedStats.${Constants.Stats.SPD}`,
        headerName: t('RelicGrid.Headers.SPD'), /* SPD */
        cellStyle: Gradient.getRelicGradient,
        valueFormatter: Renderer.hideZeroes10thsRelicTabSpd,
        filter: 'agNumberColumnFilter',
      },
      {
        field: `augmentedStats.${Constants.Stats.CR}`,
        headerName: t('RelicGrid.Headers.CR'), /* Crit\nRate */
        cellStyle: Gradient.getRelicGradient,
        valueFormatter: Renderer.hideZeroesX100Tenths,
        filter: 'agNumberColumnFilter',
      },
      {
        field: `augmentedStats.${Constants.Stats.CD}`,
        headerName: t('RelicGrid.Headers.CD'), /* Crit\nDMG */
        cellStyle: Gradient.getRelicGradient,
        valueFormatter: Renderer.hideZeroesX100Tenths,
        filter: 'agNumberColumnFilter',
      },
      {
        field: `augmentedStats.${Constants.Stats.EHR}`,
        headerName: t('RelicGrid.Headers.EHR'), /* Effect\nHit Rate */
        cellStyle: Gradient.getRelicGradient,
        valueFormatter: Renderer.hideZeroesX100Tenths,
        filter: 'agNumberColumnFilter',
      },
      {
        field: `augmentedStats.${Constants.Stats.RES}`,
        headerName: t('RelicGrid.Headers.RES'), /* Effect\nRES */
        cellStyle: Gradient.getRelicGradient,
        valueFormatter: Renderer.hideZeroesX100Tenths,
        filter: 'agNumberColumnFilter',
      },
      {
        field: `augmentedStats.${Constants.Stats.BE}`,
        headerName: t('RelicGrid.Headers.BE'), /* Break\nEffect */
        cellStyle: Gradient.getRelicGradient,
        valueFormatter: Renderer.hideZeroesX100Tenths,
        filter: 'agNumberColumnFilter',
      },
      {
        field: 'cv',
        valueGetter: cvValueGetter,
        headerName: t('RelicGrid.Headers.CV'), /* Crit\nValue */
        cellStyle: Gradient.getRelicGradient,
        valueFormatter: Renderer.hideZeroesX100Tenths,
        filter: 'agNumberColumnFilter',
      },
    ].concat(
      valueColumns
        .map((vc) => {
          const i = flatValueColumnOptions.findIndex((x) => x.value === vc)
          return [i, flatValueColumnOptions[i]]
        })
        .sort((a, b) => a[0] - b[0])
        .map(([_i, field]) => (
          {
            field: field.value,
            headerName: field.column,
            cellStyle: Gradient.getRelicGradient,
            valueFormatter: field.percent ? Renderer.hideNaNAndFloorPercent : Renderer.hideNaNAndFloor,
            filter: 'agNumberColumnFilter',
            width: 75,
          }
        )),
    ), [flatValueColumnOptions, valueColumns, t])

  const gridOptions = useMemo(() => ({
    rowHeight: 33,
    suppressDragLeaveHidesColumns: true,
    suppressScrollOnNewData: true,
    suppressMultiSort: true,
    getRowId: (params) => String(params.data.id),
  }), [])

  // headerTooltip
  const defaultColDef = useMemo(() => ({
    sortable: true,
    width: 46,
    headerClass: 'relicsTableHeader',
    sortingOrder: ['desc', 'asc'],
    filterParams: { maxNumConditions: 200 },
    wrapHeaderText: true,
    autoHeaderHeight: true,
    suppressHeaderMenuButton: true,
  }), [])

  const onSelectionChanged = useCallback((event) => {
    console.log('selectionChanged', event)
    setSelectedRelicIDs(event.api.getSelectedRows().map((r) => r.id))
  }, [])

  const rowClickedListener = useCallback((event) => {
    console.log('rowClicked', event)
    if (!event.type) {
      const node = gridRef.current.api.getRowNode(event.id)
      node.setSelected(true, true)
    }
    setSelectedRelicID(event.data.id)
  }, [])

  const onRowDoubleClickedListener = useCallback((e) => {
    console.log('rowDblClicked', e)
    setSelectedRelicID(e.data.id)
    setEditModalOpen(true)
  }, [])

  const navigateToNextCell = useCallback((params) => {
    return arrowKeyGridNavigation(params, gridRef, (selectedNode) => rowClickedListener(selectedNode))
  }, [])

  const getLocaleText = useCallback((params) => {
    if (params.key == 'to') return (t('RelicGrid.To') /* to */)
    if (params.key == 'of') return (t('RelicGrid.Of') /* of */)
    if (params.key == 'noRowsToShow') return ''
    return params.key
  }, [t])

  function onAddOk(relic) {
    DB.setRelic(relic)
    setRelicRows(DB.getRelics())
    SaveState.delayedSave()

    setSelectedRelicID(relic.id)

    Message.success(t('Messages.AddRelicSuccess') /* Successfully added relic */)
    console.log('onAddOk', relic)
  }

  // DRY this up (CharacterPreview.js, OptimizerBuildPreview.js, RelicsTab.js)
  function onEditOk(relic) {
    const updatedRelic = RelicModalController.onEditOk(selectedRelic, relic)
    setSelectedRelicID(updatedRelic.id)
  }

  function editClicked() {
    console.log('edit clicked')
    if (!selectedRelicID) return Message.error(t('Messages.NoRelicSelected') /* No relic selected */)
    setEditModalOpen(true)
  }

  function addClicked() {
    console.log('add clicked')
    setAddModalOpen(true)
  }

  function deleteClicked(isOpen) {
    console.log('delete clicked')

    if (selectedRelics.length === 0) {
      setDeleteConfirmOpen(false)
      return Message.error(t('Messages.NoRelicSelected') /* No relic selected */)
    }

    setDeleteConfirmOpen(isOpen)
  }

  function deletePerform() {
    if (selectedRelics.length === 0) return Message.error(t('Messages.NoRelicSelected') /* No relic selected */)

    selectedRelicIDs.forEach((id) => {
      DB.deleteRelic(id)
    })

    setRelicRows(DB.getRelics())
    setSelectedRelicID(undefined)
    setSelectedRelicIDs([])
    SaveState.delayedSave()

    Message.success(t('Messages.DeleteRelicSuccess') /* Successfully deleted relic */)
  }

  const focusCharacter = window.store.getState().relicsTabFocusCharacter
  let score
  if (focusCharacter && selectedRelic) {
    score = RelicScorer.scoreCurrentRelic(selectedRelic, focusCharacter)
  }

  const numScores = 10
  const [scores, setScores] = useState(null)
  const [scoreBuckets, setScoreBuckets] = useState(null)
  const excludedRelicPotentialCharacters = window.store((s) => s.excludedRelicPotentialCharacters)
  useEffect(() => {
    if (selectedRelic) {
      const chars = DB.getMetadata().characters
      const allScores = Object.keys(chars)
        .filter((id) => !(plottedCharacterType === PLOT_CUSTOM && excludedRelicPotentialCharacters.includes(id)))
        .map((id) => ({
          cid: id,
          name: t(`gameData:Characters.${id}.Name`),
          score: RelicScorer.scoreRelicPotential(selectedRelic, id, true),
          color: '#000',
          owned: !!DB.getCharacterById(id),
        }))

      allScores.sort((a, b) => b.score.bestPct - a.score.bestPct)
      allScores.forEach((x, idx) => {
        x.color = 'hsl(' + (idx * 360 / (numScores + 1)) + ',50%,50%)'
      })
      setScores(allScores.slice(0, numScores))

      //        0+  10+ 20+ 30+ 40+ 50+ 60+ 70+ 80+ 90+
      const sb = [[], [], [], [], [], [], [], [], [], []]
      for (const score of allScores) {
        let lowerBound = Math.floor(score.score.bestPct / 10)
        lowerBound = Math.min(9, Math.max(0, lowerBound))
        sb[lowerBound].push(score)
      }
      sb.forEach((bucket) => bucket.sort((s1, s2) => s1.name.localeCompare(s2.name)))
      setScoreBuckets(sb)
    }
  }, [plottedCharacterType, selectedRelic, excludedRelicPotentialCharacters, t])

  return (
    <Flex style={{ width: TAB_WIDTH, marginBottom: 100 }}>
      <RelicModal
        type='add'
        onOk={onAddOk}
        setOpen={setAddModalOpen}
        open={addModalOpen}
      />
      <RelicModal
        selectedRelic={selectedRelic}
        type='edit'
        onOk={onEditOk}
        setOpen={setEditModalOpen}
        open={editModalOpen}
      />
      <Flex vertical gap={10} style={{ width: '100%' }}>
        <RelicFilterBar
          setValueColumns={setValueColumns}
          valueColumns={valueColumns}
          valueColumnOptions={valueColumnOptions}
        />

        {hasRecentRelics && (
          <Collapse
            size='small'
            defaultActiveKey={['1']}
            items={[
              {
                key: '1',
                label: t('RecentlyUpdatedRelics.Header'), /* Recently Updated Relics */
                children: (
                  <RecentRelics
                    scoringCharacter={focusCharacter}
                    selectedRelicID={selectedRelicID}
                    setSelectedRelicID={(id) => {
                      const node = gridRef.current.api.getRowNode(id)
                      node.setSelected(true, true)
                      gridRef.current.api.ensureNodeVisible(node, 'middle')
                      setSelectedRelicID(id)
                    }}
                  />
                ),
              },
            ]}
          />
        )}

        {!gridDestroyed && (
          <div
            id='relicGrid'
            className='ag-theme-balham-dark'
            style={{
              width: TAB_WIDTH,
              height: 500,
              resize: 'vertical',
              overflow: 'hidden',
              ...getGridTheme(token),
            }}
          >
            <AgGridReact
              ref={gridRef}
              rowData={relicRows}
              gridOptions={gridOptions}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              animateRows={true}
              headerHeight={24}
              pagination={true}
              paginationPageSizeSelector={false}
              paginationPageSize={2100}
              paginationNumberFormatter={(param) => param.value.toLocaleString(currentLocale())}
              getLocaleText={getLocaleText}
              onSelectionChanged={onSelectionChanged}
              onRowClicked={rowClickedListener}
              onRowDoubleClicked={onRowDoubleClickedListener}
              navigateToNextCell={navigateToNextCell}
              rowSelection='multiple'
            />
          </div>
        )}
        {gridDestroyed && <div style={{ width: TAB_WIDTH, height: 500 }} />}
        <Flex gap={10} justify='space-between'>
          <Button
            type='primary'
            onClick={editClicked}
            style={{ width: 170 }}
            disabled={selectedRelics.length === 0 || selectedRelics.length > 1}
          >
            {t('Toolbar.EditRelic') /* Edit relic */}
          </Button>
          <Popconfirm
            title={t('common:Confirm') /* confirm */}
            description={t('Toolbar.DeleteRelic.Warning', { count: selectedRelics.length }) /* Delete the selected relic(s) */}
            open={deleteConfirmOpen}
            onOpenChange={deleteClicked}
            onConfirm={deletePerform}
            placement='bottom'
            okText={t('common:Yes') /* yes */}
            cancelText={t('common:Cancel') /* cancel */}
          >
            <Tooltip title={isLiveImport ? 'Disabled in live import mode.' : ''}>
              <Button type='primary' style={{ width: 170 }} disabled={selectedRelics.length === 0 || isLiveImport}>
                {t('Toolbar.DeleteRelic.ButtonText') /* Delete relic */}
              </Button>
            </Tooltip>
          </Popconfirm>
          <Tooltip title={isLiveImport ? 'Disabled in live import mode.' : ''}>
            <Button type='primary' onClick={addClicked} style={{ width: 170 }} disabled={isLiveImport}>
              {t('Toolbar.AddRelic') /* Add New Relic */}
            </Button>
          </Tooltip>

          <RelicLocator relic={selectedRelic} />
          <Flex style={{ display: 'block' }}>
            <TooltipImage type={Hint.relicLocation()} />
          </Flex>

          <Select
            value={relicInsight}
            onChange={setRelicInsight}
            options={relicInsightOptions}
            style={{ width: 275 }}
          />
          <Flex style={{ display: 'block' }}>
            <TooltipImage type={Hint.relicInsight()} />
          </Flex>
          <Select
            value={plottedCharacterType}
            onChange={setPlottedCharacterType}
            options={characterPlotOptions}
            style={{ width: 275 }}
          />
        </Flex>
        <Flex gap={10}>
          <RelicPreview
            relic={selectedRelic}
            setSelectedRelic={(r) => setSelectedRelicID(r.id)}
            setEditModalOpen={setEditModalOpen}
            score={score}
          />
          <Flex style={{ display: 'block' }}>
            <TooltipImage type={Hint.relics()} />
          </Flex>

          {relicInsight === 'top10' && scores && (
            <Flex gap={10}>
              <Flex style={{ borderRadius: 8, overflow: 'hidden', border: `1px solid ${token.colorBorderSecondary}` }}>
                <Plot
                  onClick={(e) => {
                    store.getState().setScoringAlgorithmFocusCharacter(e.points[0].data.cid)
                    setOpen(OpenCloseIDs.SCORING_MODAL)
                  }}
                  data={scores.map((s) => ({
                    x: [s.score.averagePct],
                    y: [s.name],
                    hoverinfo: 'name',
                    mode: 'markers',
                    type: 'scatter',
                    error_x: {
                      type: 'data',
                      symmetric: false,
                      array: [s.score.bestPct - s.score.averagePct],
                      arrayminus: [s.score.averagePct - s.score.worstPct],
                    },
                    marker: { color: s.color },
                    name: s.name,
                    cid: s.cid,
                  })).reverse()}
                  layout={{
                    plot_bgcolor: 'rgba(0, 0, 0, 0)',
                    paper_bgcolor: token.colorBgContainer,
                    font: {
                      color: 'rgba(255, 255, 255, 0.85)',
                    },
                    autosize: true,
                    width: 320,
                    height: 278,
                    margin: {
                      b: 20,
                      l: 10,
                      r: 20,
                      t: 10,
                    },
                    showlegend: false,
                    xaxis: {
                      fixedrange: true,
                      range: [0, 100],
                      tick0: 0,
                      dtick: 10,
                      showgrid: true,
                      showline: true,
                      showticklabels: true,
                      type: 'linear',
                      zeroline: true,
                      gridcolor: 'rgba(128, 128, 128, 0.15)',
                    },
                    yaxis: {
                      fixedrange: true,
                      showticklabels: false,
                      gridcolor: 'rgba(128, 128, 128, 0.15)',
                    },
                  }}
                  config={{
                    displayModeBar: false,
                    editable: false,
                    scrollZoom: false,
                  }}
                />
              </Flex>
              <ol>
                <Flex vertical gap={5.5}>
                  {scores
                    .map((x) => {
                      const rect = (
                        <svg width={10} height={10}>
                          <rect
                            width={10}
                            height={10}
                            style={{
                              fill: x.color,
                              strokeWidth: 1,
                              stroke: 'rgb(0,0,0)',
                            }}
                          />
                        </svg>
                      )
                      const worstPct = Math.floor(x.score.worstPct)
                      const bestPct = Math.floor(x.score.bestPct)
                      const pctText = worstPct === bestPct ? `${worstPct}%` : `${worstPct}% - ${bestPct}%`
                      return (
                        <Flex key={x.cid} gap={4}>
                          <li style={x.owned ? { fontWeight: 'bold' } : undefined}>
                            <Flex align='center' gap={8}>
                              {rect}
                              <a style={{ height: '19px' }}>
                                {/* 20 px is too big and pushes the characters below the lower edge of the plot */}
                                <img
                                  src={Assets.getCharacterAvatarById(x.cid)}
                                  style={{ height: '19px' }}
                                  onClick={(e) => {
                                    store.getState().setScoringAlgorithmFocusCharacter(e.target.attributes.src.nodeValue.split('avatar/')[1].split('.webp')[0])
                                    setOpen(OpenCloseIDs.SCORING_MODAL)
                                  }}
                                />
                              </a>
                              {x.name}: {pctText}
                            </Flex>
                          </li>
                        </Flex>
                      )
                    })}
                </Flex>
              </ol>
            </Flex>
          )}
          <Flex style={{ borderRadius: 8, overflow: 'hidden', border: `1px solid ${token.colorBorderSecondary}` }}>
            {relicInsight === 'buckets' && scoreBuckets && (
              // Since plotly doesn't natively support images as points, we emulate it in this plot
              // by adding invisible points for each character (to get 'name on hover' behavior),
              // then adding an image on top of each point
              <Plot
                onClick={(e) => {
                  store.getState().setScoringAlgorithmFocusCharacter(e.points[0].data.cid[e.points[0].pointIndex])
                  setOpen(OpenCloseIDs.SCORING_MODAL)
                }}
                data={[
                  // Add fake data in each category to make sure we don't elide any categories - that would
                  // mess up our image placement
                  {
                    type: 'scatter',
                    x: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    y: ['0%+', '10%+', '20%+', '30%+', '40%+', '50%+', '60%+', '70%+', '80%+', '90%+'],
                    hoverinfo: 'skip',
                    mode: 'markers',
                    marker: {
                      color: 'rgba(0, 0, 0, 0)',
                      symbol: 'circle',
                      size: 16,
                    },
                  },
                  {
                    type: 'scatter',
                    hoverinfo: 'text',
                    mode: 'markers',
                    x: scoreBuckets.flatMap((bucket, _bucketIdx) => bucket.map((_score, idx) => idx + 0.5)),
                    y: scoreBuckets.flatMap((bucket, bucketIdx) => bucket.map((_score, _idx) => (bucketIdx * 10) + '%+')),
                    hovertext: scoreBuckets.flatMap((bucket, _bucketIdx) =>
                      bucket.map((score, _idx) =>
                        [
                          score.name,
                          score.score.meta.bestAddedStats.length === 0
                            ? ''
                            : t('RelicInsights.NewStats') /* 'New stats: ' */ + score.score.meta.bestAddedStats.join(' / '),
                          score.score.meta.bestUpgradedStats == null
                            ? ''
                            : t('RelicInsights.UpgradedStats') /* 'Upgraded stats: ' */ + score.score.meta.bestUpgradedStats.join(' / '),
                        ].filter((t) => t !== '').join('<br>')
                      )
                    ),
                    cid: scoreBuckets.flatMap((bucket, _bucketIdx) => bucket.map((score, _idx) => score.cid)),
                    marker: {
                      color: 'rgba(0, 0, 0, 0)', // change to 1 to see backing points
                      symbol: 'circle',
                      size: 16,
                    },
                  },
                ]}
                layout={{
                  plot_bgcolor: 'rgba(0, 0, 0, 0)',
                  paper_bgcolor: token.colorBgContainer,
                  font: {
                    color: 'rgba(255, 255, 255, 0.85)',
                  },
                  autosize: true,
                  height: 278,
                  width: 1222,
                  margin: {
                    b: 5,
                    l: 50,
                    r: 20,
                    t: 0,
                  },
                  hovermode: 'closest',
                  hoverdistance: 20,
                  showlegend: false,
                  images: scoreBuckets.flatMap((bucket, bucketIdx) =>
                    bucket.map((score, idx) => ({
                      source: Assets.getCharacterAvatarById(score.cid),
                      xref: 'x',
                      yref: 'y',
                      x: idx + 0.6,
                      y: bucketIdx,
                      sizex: 1,
                      sizey: 1,
                      xanchor: 'center',
                      yanchor: 'middle',
                    }))
                  ),
                  xaxis: {
                    fixedrange: true,
                    range: [0, Math.max(...scoreBuckets.map((sb) => sb.length)) + 1],
                    tick0: 0,
                    showgrid: false,
                    showticklabels: false,
                    type: 'linear',
                    zeroline: false,
                  },
                  yaxis: {
                    fixedrange: true,
                    showticklabels: true,
                    gridcolor: 'rgba(128, 128, 128, 0.15)',
                  },
                }}
                config={{
                  displayModeBar: false,
                  editable: false,
                  scrollZoom: false,
                }}
              />
            )}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}
// RelicsTab.propTypes = {
//   active: PropTypes.bool,
// }

function cvValueGetter(params) {
  return params.data.augmentedStats[Stats.CR] * 2 + params.data.augmentedStats[Stats.CD]
}
