import "./style.css"
import { Button, Checkbox, Flex, Form, FormInstance, FormProps, Input, Radio, Space, Tooltip } from "antd";
import FieldSelector from "./FieldSelector";
import NumberRange from "./NumberRange";
import TableSelector from "./TableSelector";
import ViewSelector from "./ViewSelector";
import ModeSelector, { Mode } from "./ModeSelector";
import SmartlingRule from "./SmartlingRule";
import { TipIcon } from "../Icon";
import CodeEditor from "./CodeEditor";
import { safeEval } from "../../utils";
import { useTranslation } from "react-i18next";

export interface FormValues {
  mode: string;
  table: string;
  tableAndView: [string, string];
  view: string;
  name: string;
  keyField: string;
  valuesField: string[];
  prefix?: string
  regExp?: string
  replacement?: string
  customKeyFn?: string
  isCheckKey?: boolean
  range?: [number | undefined, number | undefined] | []
}

interface MyFormProps extends FormProps<FormValues> {
  onDownloadAll: (values: FormValues) => void
}


const MyForm = ({ onDownloadAll, form, ...props }: MyFormProps) => {
  const { t } = useTranslation()
  const mode = Form.useWatch('mode', form);
  const table = Form.useWatch('table', form);
  const view = Form.useWatch('view', form);

  return <>
    <Form
      form={form}
      layout="vertical"
      autoComplete="off"
      variant={'filled'}
      colon={false}
      {...props}
    >
      <Form.Item
        className="sticky-tabs"
        name="mode"
      >
        <ModeSelector className="form-item--mode" size="small" />
      </Form.Item>

      <Form.Item label={`${t('form-table')}:`} layout="horizontal">
        <Flex align="flex-start" gap={8}>
          <Form.Item
            className="inline-form-item"
            // label="表格"
            name="table"
          // rules={[{ required: true, message: '请选择数据表！' }]}
          >
            <TableSelector />
          </Form.Item>
          <span className="form-item-split">/</span>
          <Form.Item
            className="inline-form-item"
            // label="视图"
            name="view"
          // rules={[{ required: true, message: '请选择视图！' }]}
          >
            <ViewSelector tableId={table} />
          </Form.Item>
        </Flex>
      </Form.Item>

      <Form.Item
        label={`${t('form-range')}:`}
        name="range"
        layout="horizontal"
      >
        <NumberRange />
      </Form.Item>

      <Form.Item label={`${t('form-field')}:`}>
        <Flex gap={8} align="center">
          <span className="form-item-split">{'{'}</span>
          <Flex style={{ width: '100%' }} gap={8} align="center">
            <Form.Item
              // label="键值对"
              name="keyField"
              rules={[{ required: true, message: t('rules-required-keyField') }]}
              style={{ marginBottom: 0, width: '20vw' }}
            >
              <FieldSelector tableId={table} viewId={view} />
            </Form.Item>

            <span className="form-item-split">:</span>

            <Form.Item
              className="inline-form-item"
              // label="生成value的字段"
              name="valuesField"
              rules={[{ required: true, message: t('rules-required-valuesField') }]}
            >
              <FieldSelector mode="multiple" tableId={table} viewId={view} />
            </Form.Item>
          </Flex>
          <span className="form-item-split">{'}'}</span>
        </Flex>
      </Form.Item>

      <Form.Item
        label={`${t('form-prefix')}:`}
        name="prefix"
      >
        <Input />
      </Form.Item>

      {mode === Mode.regExp && <Form.Item
        label={`${t('form-regExp')}:`}
        name="regExp"
        rules={[{ pattern: (/^\/(.*)\/([gimuy]*)$/), message: t('rules-invalid-pattern') }]}
      >
        <Input placeholder="/(w+)/g" />
      </Form.Item>}

      {mode === Mode.regExp && <Form.Item
        label={`${t('form-replacement')}:`}
        name="replacement"
      >
        <Input placeholder="$1" />
      </Form.Item>}

      {mode === Mode.custom && <Form.Item
        label={`${t('form-customKeyFn')}:`}
        name="customKeyFn"
        rules={[
          ({ getFieldValue }) => ({
            validator(_, value) {
              try {
                if (value && (value.indexOf('document') > -1 || value.indexOf('fetch') > -1 || !safeEval(value))) {
                  return Promise.reject(new Error(t('rules-invalid-code')));
                }
                return Promise.resolve();
              } catch (e) {
                return Promise.reject(new Error(t('rules-invalid-code2')));
              }
            },
            // validateTrigger: 'blur'
          }),
        ]}
      >
        <CodeEditor defaultValue={props.initialValues?.customKeyFn} />
      </Form.Item>}


      {mode === Mode.smartling && <Form.Item
        name="isCheckKey"
        valuePropName="checked"
      >
        <Checkbox>
          <Flex gap={8} align="center">
            {t('form-isCheckKey')}
            <Tooltip placement="right" title={<SmartlingRule />}>
              <TipIcon />
            </Tooltip>
          </Flex>
        </Checkbox>
      </Form.Item>}
    </Form>

    <Flex gap={16} className="sticky-footer-btn">
      <Button type="primary" onClick={form?.submit}>
        {t('create-json')}
      </Button>
      <Button color="primary" variant="filled" onClick={async () => {
        await form?.validateFields()
        onDownloadAll(form?.getFieldsValue() || {} as FormValues)
      }}>
        {t('download-all')}
      </Button>
    </Flex>
  </>
}

export default MyForm