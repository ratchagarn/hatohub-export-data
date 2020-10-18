import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Form, Row, Col, Select, Button } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import CSVReader from 'react-csv-reader'
import services from 'services'
import { camelCaseToWord, formatBytes } from 'helpers/utils'
import serviceName from 'variables/serviceName'

const uploadInputID = 'react-csv-reader-input'
const { Option } = Select
const serviceNameList = Object.keys(serviceName)

function ExportManager({ onCompleted }) {
  const [serviceName, setServiceName] = useState()
  const [uploadFileInfo, setUploadFileInfo] = useState()
  const inputUpload = useRef()

  return (
    <Form layout="vertical">
      <ExportManagerWrapper>
        <CSVReader inputId={uploadInputID} onFileLoaded={hansleOnFilLoaded} />
        {!uploadFileInfo ? (
          <Row type="flex" gutter={16}>
            <Col>
              <Form.Item noStyle>
                <Select
                  placeholder="Select service"
                  style={{ width: 300 }}
                  onChange={(name) => setServiceName(name)}
                >
                  {serviceNameList.map((name) => (
                    <Option key={name}>{camelCaseToWord(name)}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item noStyle>
                <Button
                  disabled={!serviceName}
                  icon={<UploadOutlined />}
                  onClick={handleOnUploadButtonClick}
                >
                  Upload CSV
                </Button>
              </Form.Item>
            </Col>
          </Row>
        ) : (
          <TableFileInfo>
            <tbody>
              <tr>
                <td>Name:</td>
                <td>{uploadFileInfo.name}</td>
              </tr>
              <tr>
                <td>Size:</td>
                <td>{formatBytes(uploadFileInfo.size)}</td>
              </tr>
            </tbody>
          </TableFileInfo>
        )}
      </ExportManagerWrapper>
    </Form>
  )

  function handleOnUploadButtonClick() {
    if (!inputUpload.current) {
      inputUpload.current = document.getElementById(uploadInputID)
    }

    inputUpload.current.click()
  }

  function hansleOnFilLoaded(rawData, fileInfo) {
    const service = services[serviceName]

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

    onCompleted(service(csvData), serviceName)
  }
}

ExportManager.propTypes = {
  onCompleted: PropTypes.func,
}

ExportManager.defaultProps = {
  brand: 'foodPanda',
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

const TableFileInfo = styled.table`
  td {
    padding: 0;
    height: 32px;

    &:first-child {
      padding-right: 8px;
      font-weight: bold;
    }
  }
`
