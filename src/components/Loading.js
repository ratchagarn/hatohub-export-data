import React, { Fragment } from 'react'
import styled from 'styled-components'
import { LoadingOutlined } from '@ant-design/icons'

function Loading() {
  return (
    <Fragment>
      <LoadingOutlined />
      <Text>Loading...</Text>
    </Fragment>
  )
}

export default Loading

const Text = styled.span`
  margin-left: 8px;
`
