import fs from 'fs/promises'
import type { PluginOption } from 'vite'

export interface CodeReplaceOptions {
  replaces: {
    file: RegExp // 对哪些文件执行这个替换
    source: RegExp | string
    target: string | number | boolean
  }[]
}

const loadAndReplaceFile = async (
  id: string,
  options: CodeReplaceOptions,
): Promise<string | null> => {
  let fileContent: string | null = null

  for (const replaceConfig of options.replaces) {
    if (!replaceConfig.file || replaceConfig.file?.test(id)) {
      if (!fileContent) fileContent = (await fs.readFile(id, 'utf-8')) || ''
      fileContent = (fileContent as string).replace(replaceConfig.source, `${replaceConfig.target}`)
    }
  }

  /**
   * hint: 根据 vite 当前的策略，这里如果直接返回 null 就相当于跳过这个插件，也是不会报错的
   */
  return fileContent
}

function viteCodeReplace(options: CodeReplaceOptions): PluginOption {
  return {
    name: 'path-load-file',
    load(id: string) {
      return loadAndReplaceFile(id, options)
    },
  }
}

export default viteCodeReplace