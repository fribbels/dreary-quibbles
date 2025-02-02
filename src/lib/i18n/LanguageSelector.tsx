import { Button, Flex, Select } from 'antd'
import { completedLocales, languages } from 'lib/i18n/i18n'
import { Assets } from 'lib/rendering/assets'
import { BASE_PATH, BasePath } from 'lib/state/db'
import React from 'react'
import { useTranslation } from 'react-i18next'

export function LanguageSelector() {
  const { i18n } = useTranslation()
  const isBeta = BASE_PATH === BasePath.BETA
  const selectOptions = Object.values(languages)
    .filter((x) => isBeta || completedLocales.includes(x.locale))
    .map(({ locale, nativeName, shortName }) => ({
      value: locale,
      display: (
        <Flex align='center' gap={10}>
          <img style={{ width: 22 }} src={Assets.getGlobe()}/>
          {shortName}
        </Flex>
      ),
      label: (
        <Flex gap={8}>
          {nativeName}
          {isBeta ? ` (${locale})` : ''}
          {completedLocales.includes(locale) ? '' : ' - (WIP)'}
        </Flex>
      ),
    }))

  return (
    <Select
      options={selectOptions}
      optionRender={(option) => option.data.label}
      onChange={(e: string) => {
        void i18n.changeLanguage(e)
        e === 'aa_ER' ? window.jipt.start() : window.jipt.stop()
      }}
      style={{ width: 135, marginRight: 6, height: 36 }}
      placement='bottomLeft'
      optionLabelProp='display'
      dropdownStyle={{ width: 210 }}
      defaultValue={i18n.resolvedLanguage}
      dropdownRender={(menu) => (
        <Flex gap={4} vertical>
          {menu}
          <Button
            type='primary'
            style={{ borderRadius: 5, height: 32 }}
            onClick={() => window.open('https://discord.gg/rDmB4Un7qg')}
          >
            Help translate the website!
          </Button>
        </Flex>
      )}
    />
  )
}
