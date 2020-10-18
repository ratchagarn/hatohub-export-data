import React, { Fragment, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Button } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import CSVReader from 'react-csv-reader'
import services from 'services'
import { formatBytes } from 'helpers/utils'

const uploadInputID = 'react-csv-reader-input'

function ExportManager({ provider, onCompleted }) {
  const [uploadFileInfo, setUploadFileInfo] = useState()
  const inputUpload = useRef()

  return (
    <ExportManagerWrapper>
      <CSVReader inputId={uploadInputID} onFileLoaded={hansleOnFilLoaded} />
      {!uploadFileInfo ? (
        <Button icon={<UploadOutlined />} onClick={handleOnUploadButtonClick}>
          Upload CSV
        </Button>
      ) : (
        <Fragment>
          <FileName>{uploadFileInfo.name}</FileName>
          <Arrow>→</Arrow>
          <FileSize>{formatBytes(uploadFileInfo.size)}</FileSize>
        </Fragment>
      )}
    </ExportManagerWrapper>
  )

  function handleOnUploadButtonClick() {
    if (!inputUpload.current) {
      inputUpload.current = document.getElementById(uploadInputID)
    }

    inputUpload.current.click()
  }

  function hansleOnFilLoaded(rawData, fileInfo) {
    const service = services[provider]

    if (typeof service !== 'function') {
      return
    }

    setUploadFileInfo(fileInfo)

    const fieldName = rawData[0]

    const csvData = rawData.slice(1).map((record) => {
      const result = {}

      record.forEach((row, index) => {
        result[fieldName[index].replace(/\s/g, '_')] = row
      })

      return result
    })

    onCompleted(service(csvData), provider)
  }
}

ExportManager.propTypes = {
  provider: PropTypes.string.isRequired,
  onCompleted: PropTypes.func,
}

ExportManager.defaultProps = {
  provider: 'foodPanda',
  onCompleted: () => {},
}

export default ExportManager

const ExportManagerWrapper = styled.div`
  position: relative;
  line-height: 32px;

  > .csv-reader-input {
    > input[type='file'] {
      height: 32px;
      display: none;
    }
  }
`

const FileName = styled.span`
  font-weight: bold;
`

const FileSize = styled.span`
  text-decoration: underline;
`

const Arrow = styled.span`
  margin: 0 8px;
`
