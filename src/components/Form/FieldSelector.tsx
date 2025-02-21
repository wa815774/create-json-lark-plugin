import { bitable, ITable, ITableMeta, IViewMeta } from "@lark-base-open/js-sdk"
import { Select, SelectProps } from "antd"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next";

const FieldSelector = ({ tableId, viewId, ...props }: SelectProps & {
  tableId: ITableMeta['id'];
  viewId: IViewMeta['id']
}) => {
  const { t } = useTranslation()
  const [fieldList, setFieldList] = useState<any[]>([])

  useEffect(() => {
    let off
    init()
      .then(o => (off = o))

    return off
  }, [tableId, viewId])

  const init = async () => {
    if (!tableId || !viewId) return
    const table = await bitable.base.getTable(tableId)
    const view = await table.getViewById(viewId)
    const fieldList = (await view.getFieldMetaList())?.filter(f => f.type === 1) // 只显示文本field
    if (fieldList.length <= 0) return
    setFieldList(fieldList)
    const multiple = props.mode == 'multiple'
    const defaultField = fieldList.find(f => f.name === t('en'))?.id || fieldList[0]?.id
    let defaultFields = props.value || (multiple ? [defaultField] : defaultField)
    let change = false
    if (defaultFields) {
      if (!multiple) {
        const valid = fieldList.some(f => f.id === defaultFields)
        if (!valid) {
          defaultFields = defaultField
          change = true
        }
      } else {
        defaultFields = defaultFields.filter((f: string) => fieldList.some(ff => ff.id === f))
        change = defaultFields.length !== props.value?.length
      }
    }

    if (!props.value || change) {
      props.onChange?.(
        defaultFields
      )
    }

    const off = listen(table)
    return off
  }

  const listen = (table: ITable) => {
    const off = table.onFieldDelete((event) => {
      init()
    })
    const off2 = table.onFieldAdd((event) => {
      init()
    })
    return () => {
      off()
      off2()
    }
  }

  return <Select
    {...props}
    value={fieldList.length === 0 ? undefined : props.value}  // 在列表没加载出来之前不显示value
    options={fieldList.map(t => ({ label: t.name, value: t.id }))}
  />
}

export default FieldSelector