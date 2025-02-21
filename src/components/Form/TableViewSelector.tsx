import { bitable } from "@lark-base-open/js-sdk"
import { Cascader, CascaderProps } from "antd"
import { useEffect, useState } from "react"

interface Option {
    value?: string | number | null;
    label: React.ReactNode;
    children?: Option[];
    isLeaf?: boolean;
}

// table+view的联级选择框，
// Cascader有bug！！在使用loadData的情况下，只能一级一级的展示，若一开始加载了第二级及以上的数据，只要没打开弹框，
// 在输入框中第二级及以上的数据都会只显示value，而不是label
const TableViewSelector = ({ ...props }: Omit<CascaderProps, 'options' | 'loadData' | 'changeOnSelect'>) => {
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
        const viewList = await activeTable.getViewMetaList()
        const list = tableList.map(t => ({
            label: t.name,
            value: t.id,
            isLeaf: false,
            children: t.id === activeTable.id ? viewList : []
        }))
        setTableList(list)
        props.onChange?.([activeTable.id, viewList[0].id], []) // 懒得计算第二个参数了，反正没用

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

    const loadData = async (selectedOptions: any[]) => {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        // load options lazily
        if (selectedOptions[0].value) {
            const table = await bitable.base.getTable(selectedOptions[0].value.toString())
            const viewList = await table.getViewMetaList()
            targetOption.children = viewList.map(t => ({ label: t.name, value: t.id, }))
            setTableList([...tableList]);
        }
        return
    };

    return <Cascader options={tableList} changeOnSelect {...props as any} />;
}

export default TableViewSelector