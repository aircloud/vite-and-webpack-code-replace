vite-code-replace: 替换代码文件中的代码片段或者变量

![npm version](https://img.shields.io/npm/v/vite-code-replace)

## 基本使用

可以用于对文件中的变量、代码段进行替换或删减，由于替换发生在 load 文件阶段，所以能够保证最终代码产物的纯净。

```typescript
import ViteCodeReplace from 'vite-code-replace'

{
  plugins: [
    ViteCodeReplace({
      replaces: [{
        file: /\/src\/router.ts$/,
        source: "SOME_ROUTE",
        target: "real_route"
      },{
        file: /\/src\/router.ts$/,
        source: /\/\/\sDELET_PREFIX(.|\n)*?\/\/\sDELET_SUFFIX/,
        target: ""
      }]
    })
  ]
}
```

参数类型定义：

```typescript
interface CodeReplaceOptions {
    replaces: {
        file: RegExp;
        source: RegExp | string;
        target: string | number | boolean;
    }[];
}
```

## 使用场景

1. 对不同发布渠道的代码进行删减，并且防止源代码的泄漏

有的时候，我们的代码在某些渠道分发时候需要删减掉一部分逻辑，并且打包产物中不能包含这部分逻辑。

我们可以采用类似宏编译的思想，通过本插件来完成各类复杂的代码删减工作。

例如，我们可以采用添加前后注释的方式对代码进行删减：

```typescript
// DELET_PREFIX
// some secret code ...
// DELET_SUFFIX
```

在我们顶部给出的配置例子中，`some secret code ...` 这部分代码可以安全地被移除，完全不会被包含在产物代码中。

2. 更灵活和高效的动态路由

众所周知，import 的语法由于是静态分析是不允许使用变量的，vue 虽然提供了 `defineAsyncComponent` 等能力，但是实际上并没有什么黑魔法，而是将相关文件目录遍历和打包，并没有真正达到按需打包，保护源代码的目的。

借助 vite-code-replace 插件，我们可以更灵活地在构建时决定我们的路由目录。