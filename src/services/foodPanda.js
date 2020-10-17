function foodPanda(csvData) {
  const rawLineItemData = csvData.map((record) => record.Items);

  const result = rawLineItemData
    .filter((item) => item != null)
    .map((rawData) => {
      const spliter = /\[.*\]/.test(rawData) ? "], " : ",";
      let content;
      let lineItems = [];

      rawData.split(spliter).forEach((item) => {
        content = item.trim();

        // console.log(result)

        if (/\[/.test(content) && !/\]/.test(content)) {
          content += "]";
        } else if (!/\[/.test(content) && /,/.test(item)) {
          content = content.split(",").map((item) => item.trim());
        }

        if (Array.isArray(content)) {
          content.forEach((item) => lineItems.push(item));
        } else {
          lineItems.push(content);
        }
      });

      // console.log(lineItems)

      return {
        rawData: rawData,
        lineItems: extractLineItem(lineItems),
      };
    });

  return result;

  function extractLineItem(data) {
    return data.map((item) => {
      const qty = item.match(/^([0-9]+)/);
      const store = item.match(/^[0-9]+\s+([A-Z]{2})/);
      const menu = item.match(
        /^[0-9]+\s+[A-Z]{2}\s+(.+)\s+\[.+\]|^[0-9]+\s+[A-Z]{2}\s+(.+)$/
      );
      const option = item.match(/\[(.+)\]/);

      return {
        qty: qty ? Number(qty[0]) : null,
        store: store ? store[1] : null,
        menu: menu ? (menu[1] ? menu[1] : menu[2]) : null,
        option: option ? option[1] : null,
      };
    });
  }
}

export default foodPanda;
