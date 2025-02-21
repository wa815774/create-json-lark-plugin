import { Flex, InputNumber, } from "antd";

interface NumberRangeProps {
  value?: [number | undefined, number | undefined] | []
  onChange?: (value: [number | undefined, number | undefined]) => void
}

const NumberRange = ({ value = [], onChange }: NumberRangeProps) => {
  return <Flex gap={16}>
    <InputNumber value={value[0]} onChange={v => onChange?.([v || undefined, value[1]])} min={1} />
    <span style={{ lineHeight: '32px' }}>~</span>
    <InputNumber value={value[1]} onChange={v => onChange?.([value[0], v || undefined])} min={0} />
  </Flex>
}

export default NumberRange