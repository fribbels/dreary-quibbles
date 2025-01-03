import { Flex, Typography } from 'antd'
import React, { CSSProperties } from 'react'

const { Text } = Typography

export enum ShowcaseSource {
  CHARACTER_TAB,
  SHOWCASE_TAB,
  BUILDS_MODAL,
}

export const showcaseOutline = 'rgba(255, 255, 255, 0.4) solid 1px'
export const showcaseShadow = 'rgb(0 0 0 / 75%) 1px 1px 4px'
export const showcaseDropShadowFilter = 'drop-shadow(rgb(0, 0, 0) 1px 1px 3px)'
export const showcaseButtonStyle: CSSProperties = {
  flex: 'auto',
  opacity: 0,
  transition: 'opacity 0.3s ease',
  visibility: 'hidden',
}

export function OverlayText(props: {
  text: string
  top: number
}) {
  const top = props.top
  return (
    <Flex
      vertical
      style={{
        position: 'relative',
        height: 0,
        top: top,
      }}
      align='center'
    >
      <Text
        style={{
          position: 'absolute',
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          padding: '2px 14px',
          borderRadius: 4,
          fontSize: 12,
          whiteSpace: 'nowrap',
          textShadow: '0px 0px 10px black',
          outline: showcaseOutline,
          lineHeight: '12px',
        }}
      >
        {props.text}
      </Text>
    </Flex>
  )
}
