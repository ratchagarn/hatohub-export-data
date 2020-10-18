import get from 'lodash/get'

function foodPandaExtrackLineItem(csvData) {
  if (
    typeof csvData[0].Order_ID !== 'string' ||
    typeof csvData[0].Items !== 'string'
  ) {
    return {
      error: {
        message: 'Missing field "Order ID" and "Items"',
      },
    }
  }

  let _id = 0
  const rawLineItemData = csvData.map((record) => record.Items)

  const extractedData = rawLineItemData
    .filter((item) => item != null)
    .map((rawData, index) => {
      const orderID = get(csvData[index], 'Order_ID')

      const spliter = /\[.*\]/.test(rawData) ? '], ' : ','
      let content
      let lineItems = []

      rawData.split(spliter).forEach((item) => {
        content = item.trim()

        // console.log(extractedData)

        if (/\[/.test(content) && !/\]/.test(content)) {
          content += ']'
        } else if (!/\[/.test(content) && /,/.test(item)) {
          content = content.split(',').map((item) => item.trim())
        }

        if (Array.isArray(content)) {
          content.forEach((item) => lineItems.push(item))
        } else {
          lineItems.push(content)
        }
      })

      // console.log(lineItems)

      return {
        rawData: rawData,
        lineItems: extractLineItem(lineItems, orderID),
      }
    })

  const result = []

  extractedData.forEach((row) => {
    row.lineItems.forEach((lineItem) => result.push(lineItem))
  })

  return {
    error: null,
    result,
  }

  function extractLineItem(data, orderID) {
    return data.map((item) => {
      const qty = item.match(/^([0-9]+)/)
      const store = item.match(/^[0-9]+\s+([A-Z]{2})/)
      const menu = item.match(
        /^[0-9]+\s+[A-Z]{2}\s+(.+)\s+\[.+\]|^[0-9]+\s+[A-Z]{2}\s+(.+)$/
      )
      const option = item.match(/\[(.+)\]/)

      _id += 1

      return {
        _id,
        orderID,
        qty: qty ? Number(qty[0]) : '',
        store: store ? store[1] : '',
        menu: menu ? (menu[1] ? menu[1] : menu[2]) : '',
        option: option ? option[1] : '',
      }
    })
  }
}

export default foodPandaExtrackLineItem
