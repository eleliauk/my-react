# 从零开始手写一个React

## 源码目录结构
先了解一下React 源码的项目结构，React 使用的是 Mono-repo 的结构管理各个包，源码中主要包括如下部分：

- fixtures：测试用例
- packages：主要部分，包含 scheduler，reconciler 等
- scripts：react 构建相关

其中，主要的包在 packages 目录下，主要包含以下模块：

- react：核心 Api 所在，如 React.createElement、React.Component
- react-reconclier：协调器，react 的核心逻辑所在，在 render 阶段用来构建 fiber 节点，宿主环境无关
- scheduler：调度器相关
- react-server: ssr 相关
- react-fetch: 请求相关
- react-interactions: 和事件如点击事件相关

各种宿主环境的包：
- react-dom：浏览器环境
- react-native-renderer：原生环境
- react-art：canvas & svg 渲染
- react-noop-renderer：调试或 fiber 用

辅助包：
- shared：公用辅助方法，宿主环境无关
- react-is : 判断类型
- react-client: 流相关
- react-fetch: 数据请求相关
- react-refresh: 热加载相关

我们先来实现 react 包中的 createElement 和 jsx 方法，并实现 react 包的打包流程。

### 实现 createElement 和 jsx 方法
在 React 中使用 JSX 语法描述用户界面，JSX 语法就是一种语法糖，是 一种 JavaScript 语法扩展，
它允许开发者在 JavaScript 代码中直接编写类似 HTML 的代码，并在运行时将其转换为 React 元素。
JSX 转换的过程大致分为两步：

>编译时：由 Babel 编译实现，Babel 会将 JSX 语法转换为标准的 JavaScript API；
>运行时：由 React 实现，jsx 方法 和 React.createElement 方法；

将所有的类型定义和公共方法都放在一个公用的 shared 包中。

