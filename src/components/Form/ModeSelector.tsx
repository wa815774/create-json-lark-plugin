import { Radio, RadioGroupProps } from "antd"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

export enum Mode {
    default = 'default',
    regExp = 'regExp',
    smartling = 'smartling',
    custom = 'custom'
}

const ModeSelector = (props: RadioGroupProps) => {
    const { t } = useTranslation()

    const list = useMemo(() => {
        return [
            {
                title: t('default'),
                value: Mode.default
            },
            {
                title: t('regExp'),
                value: Mode.regExp
            },
            {
                title: t('smartling'),
                value: Mode.smartling
            },
            {
                title: t('custom'),
                value: Mode.custom
            }
        ]
    }, [t])


    return <Radio.Group defaultValue="default" {...props}>
        {list.map(l => (
            <Radio.Button value={l.value} key={l.value}>{l.title}</Radio.Button>
        ))}
    </Radio.Group>
}

export default ModeSelector