import React, { Fragment, useState, useEffect } from 'react'
import styled from 'styled-components'
import { Row, Col, Table, Button, Tag } from 'antd'
import { DownloadOutlined, RedoOutlined } from '@ant-design/icons'
import CsvDownloader from 'react-csv-downloader'
import dayjs from 'dayjs'

import Loading from 'components/Loading'
import ExportManager from 'components/ExportManager'

import './App.css'
import packageJson from '../package.json'

function App() {
  const [loading, setLoading] = useState(false)
  const [downloadData, setDownloadData] = useState()

  useEffect(() => {
    let timer

    if (loading) {
      timer = setTimeout(() => {
        setLoading(false)
        setDownloadData(undefined)
      }, 1000)
    }

    return () => clearTimeout(timer)
  }, [loading])

  return (
    <AppLayout>
      <Title>
        Hatohub Export Data
        <Version>v{packageJson.version}</Version>
      </Title>

      {loading ? (
        <Loading />
      ) : (
        <Fragment>
          <Row type="flex" gutter={32}>
            <Col>
              <ExportManager onCompleted={handleOnComplete} />
            </Col>
            {downloadData && (
              <Fragment>
                <Col>
                  <Button
                    type="dashed"
                    icon={<RedoOutlined />}
                    onClick={handleOnReload}
                  >
                    Upload New file
                  </Button>
                </Col>
                <Col>
                  <DownloadLinkContainer>
                    <CsvDownloader
                      filename={dayjs().format()}
                      separator=","
                      wrapColumnChar={'"'}
                      datas={downloadData}
                      columns={createFieldColumnsForCSV(downloadData[0])}
                      text="Download CSV"
                    >
                      <Button type="primary" icon={<DownloadOutlined />}>
                        Download CSV
                      </Button>
                    </CsvDownloader>
                  </DownloadLinkContainer>
                </Col>
              </Fragment>
            )}
          </Row>

          <Separator />

          {downloadData && (
            <Fragment>
              <TableTitle>Output Preview</TableTitle>
              <Table
                rowKey="_id"
                dataSource={downloadData}
                columns={createTableColumn(downloadData[0])}
                bordered
              />
            </Fragment>
          )}
        </Fragment>
      )}
    </AppLayout>
  )

  function handleOnReload() {
    setLoading(true)
  }

  function handleOnComplete(result, serviceName) {
    setDownloadData(result)
  }

  function createFieldColumnsForCSV(firstRow) {
    if (!firstRow) {
      return
    }

    const columns = Object.keys(firstRow)
      .slice(1)
      .map((key) => ({
        id: key,
        displayName: key,
      }))

    return columns
  }

  function createTableColumn(firstRow) {
    if (!firstRow) {
      return
    }

    return Object.keys(firstRow)
      .slice(1)
      .map((key) => ({
        title: key,
        dataIndex: key,
        key,
      }))
  }
}

export default App

const Title = styled.h1`
  margin-bottom: 32px;
  padding-bottom: 8px;
  border-bottom: 2px solid black;
  font-size: 24px;
`

const TableTitle = styled.h3`
  margin-top: 32px;
  font-size: 20px;
`

const AppLayout = styled.div`
  padding: 24px;
`

const Separator = styled.div`
  margin-bottom: 32px;
`

const DownloadLinkContainer = styled.div`
  > * {
    display: inline-block;
    outline: none;
    user-select: none;

    > a {
      &:hover {
        text-decoration: none;
      }
    }
  }
`

const Version = styled(Tag).attrs({
  color: 'blue',
})`
  position: relative;
  top: -4px;
  margin-left: 12px;
`
