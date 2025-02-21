import { bitable } from "@lark-base-open/js-sdk"
import { Select, SelectProps } from "antd"
import { useEffect, useState } from "react"

const TableSelector = ({ ...props }: SelectProps) => {
  const [tableList, setTableList] = useState<any[]>([])

  useEffect(() => {
    let off
    init()
      .then(o => (off = o))

    return off
  }, [])

  const init = async () => {
    const [activeTable, tableList] = await Promise.all([
      bitable.base.getActiveTable(),
      bitable.base.getTableMetaList()
    ])
    setTableList(tableList)
    props.onChange?.(activeTable.id)

    const off = listen()
    return off
  }


  const listen = () => {
    const off = bitable.base.onTableDelete((event) => {
      init()
    })
    const off2 = bitable.base.onTableAdd((event) => {
      init()
    })
    return () => {
      off()
      off2()
    }
  }

  return <Select {...props} options={tableList.map(t => ({ label: t.name, value: t.id }))} />
}

export default TableSelector