import { Button, Flex, message, Tabs, TabsProps, Tooltip, Typography } from "antd"
import { forwardRef, useImperativeHandle, useMemo, useRef, } from "react"
import { copyTextToClipboard, downloadAllFiles, downloadFile, removeExtraLineBreaks, removeSpecialChars, splitWithLineThrough } from "../../utils"
import "./style.css"
import { Mode } from "../Form/ModeSelector"
import { CopyIcon, DownloadIcon } from "../Icon"
import { useTranslation } from "react-i18next"


export interface CodePreviewProps {
  mode: string
  prefix: string
  regExp?: string
  replacement?: string
  customKeyFn?: string
  isCheckKey?: boolean
  cellOfKeys: { type: string; text: string }[][]
  cellOfValues: { name: string; id: string; cells: { type: string; text: string }[][] }[]
}

const CodePreview = ({
  mode = '',
  prefix = '',
  regExp = '',
  replacement = '',
  customKeyFn = '',
  isCheckKey = false,
  cellOfKeys = [],
  cellOfValues = []
}: CodePreviewProps, ref: any) => {
  const { t } = useTranslation()
  const [messageApi, contextHolder] = message.useMessage();
  const codePreviewRef = useRef<HTMLDivElement>(null)

  // 生成key
  const createKey = (orginKey: string, obj: Record<string, string> = {}) => {
    if (!orginKey) return ''
    if (mode === Mode.default) {
      return prefix + orginKey
    }
    if (mode === Mode.regExp) {
      if (!regExp) return orginKey
      try {
        const regexParts = regExp.match(/^\/(.*)\/([gimuy]*)$/);
        const pattern = regexParts?.[1] || '';
        const flags = regexParts?.[2];
        return prefix + orginKey.replace(new RegExp(pattern, flags), replacement)
      } catch (e) {
        console.error(e)
        return ''
      }
    }
    if (mode === Mode.smartling) {
      return createSmartlingKey(orginKey, obj)
    }
    if (mode === Mode.custom) {
      try {
        const text = eval(customKeyFn)(orginKey)
        return prefix + text
      } catch (e) {
        console.error(e);
        return ''
      }
    }
  }

  // 生成smartling需要的key
  const createSmartlingKey = (
    orginKey: string,
    obj: Record<string, string> = {},
    level = 0
  ): string => {
    if (!orginKey) return ''
    let key = level ? `${level}-${orginKey}` : orginKey
    key = removeSpecialChars(removeExtraLineBreaks(
      splitWithLineThrough(key.toLowerCase())
    ), true)
    key = (prefix + key)

    const splitKey = key.split('.')
    if (splitKey.length > 3) { // 层数大于3
      key = splitKey.slice(0, 3).join('.') + splitKey.slice(3)
    }
    key = key.slice(0, 24)

    if (!obj[key]) {
      level > 0 && console.error(t('repeated-key', { orginKey, key }))
      return key
    }
    return createSmartlingKey(orginKey, obj, level + 1)
  }

  // 生成json
  const createJSON = (
    fieldName: string,
    cellOfKeys: CodePreviewProps['cellOfKeys'],
    values: CodePreviewProps['cellOfValues'][0]['cells']
  ) => {
    try {
      let obj: Record<string, string> = {}
      cellOfKeys.forEach((c, i) => {
        const orginKey = getText(c)
        let key = createKey(orginKey, obj)
        const val = getText(values[i])
        if (key) {
          obj[key] = val
        }
        // !val && console.error(`列（${fieldName}）：${key} 的值为空`)
        !val && console.error(t('empty-value', { fieldName, key }))
        isCheckKey && key !== orginKey && console.error(t('invalid-key', { fieldName, orginKey, key }))
      })

      return JSON.stringify(obj, null, 2)
    } catch (e) {
      console.log(e)
      return ''
    }
  }

  // 获取cell中的纯文本
  const getText = (cell: { type: string, text: string }[]) => {
    if (!cell || !Array.isArray(cell)) return ''
    return cell.reduce((val, curVal) => {
      return val + (curVal.text || '')
    }, '')
  }

  // 每个field下的json
  const jsonList = useMemo(() => {
    return cellOfValues.map(v => createJSON(v.name, cellOfKeys, v.cells))
  }, [cellOfKeys, cellOfValues])


  const copy = (text: string) => {
    if (!text) return
    copyTextToClipboard(text)
    messageApi.info(t('copied'))
  }

  // 下载所有文件
  const downloadAll = () => {
    // 要生成的文件内容
    const filesContent: Record<string, string> = {}
    jsonList.forEach((json, i) => {
      filesContent[`${cellOfValues[i].name}.json`] = json
    })
    downloadAllFiles(filesContent)
  }


  const renderJSON = (json: string, label: string) => <div className="code-preview">
    <Flex gap={16} style={{ position: 'absolute', right: 12, top: 12, fontSize: 16 }}>
      <Tooltip title={t('copy')}>
        <CopyIcon onClick={() => copy(json)} />
      </Tooltip>
      <Tooltip title={t('download-json')}>
        <DownloadIcon onClick={() => downloadFile(json, `${label}.json`)} />
      </Tooltip>
    </Flex>
    <code className="json">{json}</code>
  </div>

  const items: TabsProps['items'] = useMemo(() => {
    return jsonList.map((json, i) => ({
      key: cellOfValues[i].id,
      label: cellOfValues[i].name,
      children: renderJSON(json, cellOfValues[i].name)
    }))
  }, [jsonList])


  useImperativeHandle(ref, () => ({
    scrollIntoView: () => {
      window?.scrollTo({
        top: (codePreviewRef.current?.offsetTop || 0) - 40,
        behavior: 'smooth',
      })
    },
    downloadAll
  }))


  if (!cellOfKeys?.length) return null

  return <div ref={codePreviewRef}>
    {contextHolder}
    <Tabs
      id="tabs"
      items={items}
    />
  </div>
}

export default forwardRef(CodePreview)