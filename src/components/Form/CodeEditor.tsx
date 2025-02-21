import { useEffect, useRef } from "react";
import * as monaco from 'monaco-editor'

const CodeEditor = ({ defaultValue, onChange, onBlur }: any) => {
    const editor = useRef<any>()
    useEffect(() => {
        const dom = document.getElementById("code-editor")
        if (!dom || !monaco) return
        editor.current = monaco.editor.create(dom, {
            value: defaultValue,
            language: "javascript",
            lineNumbers: "on",
            roundedSelection: false,
            scrollBeyondLastLine: false,
            readOnly: false,
            theme: "vs-dark",
            padding: { top: 8, bottom: 8 },
            minimap: {
                enabled: false // 关闭右上角的预览框  
            },
        });
        if (defaultValue) {
            onChange?.(defaultValue)
        }
        editor.current.onDidBlurEditorText(() => {
            // console.log('不编辑了', editor.getValue())
            onBlur?.(editor.current.getValue())
        })
        editor.current.onDidChangeModelContent(() => {
            onChange?.(editor.current.getValue())
        })

        return () => {
            editor.current.dispose()
            editor.current = null
        }
    }, [defaultValue]);

    // 监听窗口变化
    useEffect(() => {
        const resize = () => {
            if (!editor.current) return
            editor.current.layout()
        }
        window.addEventListener('resize', resize)
        return () => {
            window.removeEventListener('resize', resize)
        }
    }, []);

    return <div id="code-editor" style={{
        height: 300,
        borderRadius: 8,
        overflow: 'hidden'
    }}></div>
}

export default CodeEditor