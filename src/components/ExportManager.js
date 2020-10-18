import React from 'react'
import PropTypes from 'prop-types'
import CSVReader from 'react-csv-reader'

import services from 'services'

function ExportManager({ provider, onCompleted }) {
  return <CSVReader onFileLoaded={hansleOnFilLoaded} />

  function hansleOnFilLoaded(rawData, fileInfo) {
    const service = services[provider]

    if (typeof service !== 'function') {
      return
    }

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
