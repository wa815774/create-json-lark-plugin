import { bitable, ITableMeta } from "@lark-base-open/js-sdk"
import { Select, SelectProps } from "antd"
import { useEffect, useState } from "react"

const ViewSelector = ({ tableId, ...props }: SelectProps & { tableId: ITableMeta['id'] }) => {
  const [viewList, setViewList] = useState<any[]>([])

  useEffect(() => {
    init()
  }, [tableId])

  const init = async () => {
    if (!tableId) return
    const table = await bitable.base.getTable(tableId)
    const viewList = await table.getViewMetaList()
    setViewList(viewList)
    props.onChange?.(viewList?.[0]?.id || undefined)
  }

  return <Select {...props} options={viewList.map(t => ({ label: t.name, value: t.id }))} />
}

export default ViewSelector