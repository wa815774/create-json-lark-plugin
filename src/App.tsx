import "./App.css"
import { useEffect, useRef, useState } from 'react';
import { bitable } from "@lark-base-open/js-sdk";
import MyForm, { FormValues } from './components/Form/MyForm';
import CodePreview from './components/CodePreview';
import { Alert, Divider, Form, Typography } from "antd";
import { Mode } from "./components/Form/ModeSelector";
import Link from "antd/es/typography/Link";
import { Trans, useTranslation } from "react-i18next";

const customCode = `(function hello(key) {
    // 随便写...
    return key // 请在这里返回最终结果
})`
const usageLink = 'https://dqo52yjrxl.larksuite.com/docx/RaQCd9tvQokdhRxW1ULuuNoXsXc'

export default function App() {
  const { t } = useTranslation()
  const [form] = Form.useForm<FormValues>();
  const [submitValue, setSubmitValue] = useState<FormValues>();
  const [cellOfKeys, setCellOfKeys] = useState<{ type: string; text: string }[][]>([])
  const [cellOfValues, setCellOfValues] = useState<{ name: string; id: string; cells: { type: string; text: string }[][] }[]>([])
  const codePreviewRef = useRef<any>()
  const initialValues = restoreLocalData()

  const handleData = async (values: FormValues) => {
    // console.log('values', values)
    const table = await bitable.base.getTable(values.table)
    const view = await table.getViewById(values.view)
    const recordIdList = await view.getVisibleRecordIdList()
    const keyFieid = await table.getField(values.keyField)
    const valuesField = await Promise.all(values.valuesField.map(f => table.getField(f)))
    const min = Math.max((values.range?.[0] || 0) - 1, 0)
    const max = values.range?.[1] || Number.MAX_SAFE_INTEGER
    let cellOfKeys = (await Promise.all(recordIdList.map(c => keyFieid.getValue(c as any))))
    cellOfKeys = cellOfKeys.slice(min, max).filter(c => c)
    const cellOfValues = await
      Promise.all(
        valuesField.map(async (f) => {
          const cells = await Promise.all(cellOfKeys.map((c, i) => f.getValue(recordIdList[i + min] as any)))
          return {
            ...f,
            name: await f.getName(),
            id: f.id,
            cells
          }
        })
      )

    // console.log('cellOfKeys', cellOfKeys)
    // console.log('cellOfValues', cellOfValues)
    setCellOfKeys(cellOfKeys)
    setCellOfValues(cellOfValues)
    setSubmitValue(values)
  }

  const handleFinish = async (values: FormValues) => {
    await handleData(values)

    setTimeout(() => {
      codePreviewRef.current?.scrollIntoView()
    }, 20)
  }

  const handleDownloadAll = async (values: FormValues) => {
    if (!values) return
    await handleData(values)
    setTimeout(() => {
      codePreviewRef.current?.downloadAll()
    }, 20)
  }

  // 缓存数据
  const saveLocalData = () => {
    const values = {
      ...JSON.parse(localStorage.getItem('json_form') ?? '{}'),
      ...form.getFieldsValue(),
    }
    localStorage.setItem('json_form', JSON.stringify(values))
  }

  // 恢复数据
  function restoreLocalData() {
    const defaultValues = {
      mode: Mode.default,
      prefix: '',
      range: [1],
      customKeyFn: customCode
    }
    const values = {
      ...defaultValues,
      ...JSON.parse(localStorage.getItem('json_form') ?? '{}')
    }
    return values
  }

  return (
    <>
      <Alert
        showIcon={false}
        message={<div>{t('suggestion')} <Link style={{ textDecoration: 'underline' }} href={usageLink} target="_blank">{t('useage')}</Link> {t('or-contact')}</div>}
        type="info"
        closable
        banner
      />
      <MyForm form={form} initialValues={initialValues} onValuesChange={saveLocalData} onFinish={handleFinish} onDownloadAll={handleDownloadAll} />
      <CodePreview
        ref={codePreviewRef}
        mode={submitValue?.mode || ''}
        prefix={submitValue?.prefix || ''}
        regExp={submitValue?.regExp || ''}
        replacement={submitValue?.replacement}
        customKeyFn={submitValue?.customKeyFn}
        isCheckKey={submitValue?.isCheckKey}
        cellOfKeys={cellOfKeys}
        cellOfValues={cellOfValues}
      />
    </>
  );
}