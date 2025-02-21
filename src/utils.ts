// 复制文本
export const copyTextToClipboard = (text: string) => {
  const textArea = document.createElement("textarea");
  textArea.value = text;

  // 使 textarea 不可见  
  textArea.style.position = "fixed";
  textArea.style.top = '0';
  textArea.style.left = '0';
  textArea.style.width = "2em";
  textArea.style.height = "2em";
  textArea.style.padding = '0';
  textArea.style.border = "none";
  textArea.style.outline = "none";
  textArea.style.boxShadow = "none";
  textArea.style.background = "transparent";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand('copy');
    const msg = successful ? '成功' : '失败';
    console.log('复制命令' + msg);
  } catch (err) {
    console.error('无法复制文本: ', err);
  }

  document.body.removeChild(textArea);
}

/**
 * 删除转义字符
 * @param str 
 * @returns 
 */
export const removeSpecialChars = (str: string, retainLineThrough = false): string => {
  const specialCharacters = retainLineThrough ? /[\/\\^$*+?,():|[\]{}"]/g : /[-\/\\^$*+?,():|[\]{}"]/g;
  const result = str?.replace(specialCharacters, "");
  return result;
}


/**
 * 去除多余的回车
 * @param input 
 * @returns 
 */
export function removeExtraLineBreaks(input: string): string {
  // return input?.replace(/(\r\n|\n|\r)+/g, '\n');
  return input?.replace(/\s+/g, '');
}


/**
 * 转换为每个单词都以“-”来分割
 * @param str 
 * @returns 
 */
export function splitWithLineThrough(str: string) {
  if (!str) return ''
  str = str.replace(/\s+/g, '-');
  // return str[0].toUpperCase() + str.slice(1)
  return str
}

// 下载文件
export const downloadFile = (content: string, fileName: string = '生成的文件.txt') => {
  // 创建一个Blob对象，用于存储文件内容  
  const mimeType = fileName.endsWith('.json') ? 'application/json' : 'text/plain'
  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob); // 创建Blob URL

  // 创建一个链接元素  
  const link = document.createElement('a');
  link.href = url; // 设置链接的href为Blob URL  
  link.download = fileName; // 设置下载文件名  

  // 触发下载  
  document.body.appendChild(link); // 将链接添加到文档中  
  link.click(); // 触发点击事件  
  link.remove(); // 下载后移除链接  
  window.URL.revokeObjectURL(url); // 释放Blob URL 
}

// 下载所有文件
export const downloadAllFiles = (filesContent: Record<string, string>) => {
  const zip = new JSZip();

  // 将所有文件添加到zip
  for (const [filename, content] of Object.entries(filesContent)) {
    zip.file(filename, content);
  }

  // 生成压缩包
  zip.generateAsync({ type: 'blob' })
    .then((content: string) => {
      // 使用FileSaver.js下载生成的zip文件
      saveAs(content, '翻译json.zip');
    })
    .catch((error: Error) => {
      console.error('生成压缩包时出错:', error);
    });
}

export function safeEval(code: string) {
  // 在沙箱中执行代码
  const sandbox = { Math };
  try {
    return new Function('sandbox', `with(sandbox) { return ${code} }`)(sandbox);
  } catch (error: any) {
    console.error('代码执行出错：', error.message);
    throw error;
  }
}