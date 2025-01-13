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

jsx 方法接收两个参数，第一个参数 type 为组件的 type，第二个参数是其他配置，可能有第三个参数为组件的 children，返回一个 ReactElement 数据结构。
index.ts ，这个文件是 react 包的入口，导出一个对象，包含版本号 version 和 React.createElement 方法。其中，React.createElement 方法就是刚才实现的 jsx 方法。

### 实现 Reconciler
- Reconciler 简介
- 实现 FiberNode
- 实现 Reconciler 工作流程
#### Reconciler 简介
![reconciler](https://2xiao.github.io/assets/react-2-K82y7SOy.png)
随着前端框架的出现，工作方式发生了根本性的变化，从过程驱动转变为状态驱动。在状态驱动的模式下，开发者不再直接操作宿主环境 API，而是通过前端框架提供的运行时核心模块来管理页面状态和更新。这些核心模块，例如 React 中的 Reconciler 和 Vue 中的 Renderer，负责将开发者编写的代码翻译成对应的宿主环境 API 调用，以更新页面。

Reconciler 的中文名叫协调器，它负责处理 React 元素的更新并在内部构建虚拟 DOM，这个过程是 React 框架实现高效的 UI 渲染和更新的核心逻辑所在。以下是 Reconciler 主要做的事情：

- 接收并解析 React 元素： Reconciler 接收 JSX 或者 createElement 函数返回的 React 元素，并将其解析成虚拟 DOM 树的结构。
- 协调更新： 比较新旧虚拟 DOM 树的差异，确定哪些部分需要更新，并生成更新计划。
- 构建虚拟 DOM 树： 在组件更新时，根据生成的更新计划，Reconciler 会更新虚拟 DOM 树的结构以反映最新的组件状态。
- 生成 DOM 更新指令： 将更新后的虚拟 DOM 树转换为真实的 DOM 更新指令，描述了如何将变更应用到实际的 DOM 树上

#### 实现 FiberNode
FiberNode（纤维节点）是 Reconciler 的核心数据结构之一，用于构建协调树。Reconciler 使用 FiberNode 来表示 React 元素树中的节点，并通过比较 Fiber 树的差异，找出需要进行更新的部分，生成更新指令，来实现 UI 的渲染和更新。

![fiber](https://2xiao.github.io/assets/react-8-fahbHSk6.png)
每个 FiberNode 都表示着 React 元素树中的一个节点，它包含了以下几个重要的字段：

- type：节点的类型，可以是原生 DOM 元素、函数组件或类组件等；
- props：节点的属性，包括 DOM 元素的属性、函数组件的 props 等；
- stateNode：节点对应的实际 DOM 节点或组件实例；
- child：指向节点的第一个子节点；
- sibling：指向节点的下一个兄弟节点；
- return：指向节点的父节点；
- alternate：指向节点的备份节点，用于在协调过程中进行比较；
- effectTag：表示节点的副作用类型，如更新、插入、删除等；
- pendingProps：表示节点的新属性，用于在协调过程中进行更新。

#### 实现 Reconciler 工作流程
![reconciler](https://2xiao.github.io/assets/react-3-7LStg86R.png)
Reconciler 的工作流程总的来说就是对 Fiber 树进行一次 深度优先遍历（DFS） ，首先访问根节点，然后依次访问左子树和右子树，通过比较新节点（新生成的 React Element）和旧节点（现有的 FiberNode），生成更新计划，并打上不同的标记。

1. 遍历 Fiber 树： React 使用深度优先搜索（DFS）算法来遍历 Fiber 树，首先会从 Fiber 树的根节点开始进行遍历，遍历整个组件树的结构。

2. 比较新旧节点： 对于每个 Fiber 节点，Reconciler 会比较新节点（即新的 React Element）和旧节点（即现有的 FiberNode）之间的差异，比较的内容包括节点类型、属性、子节点等方面的差异。

3. 生成更新计划： 根据比较的结果，Reconciler 会生成一个更新计划，用于确定需要进行的操作，更新计划通常包括哪些节点需要更新、哪些节点需要插入到 DOM 中、哪些节点需要删除等信息。

4. 打标记（Tagging）： 为了记录不同节点的操作，React 会为每个节点打上不同的标记。例如，如果节点需要更新，可能会打上更新标记（Update Tag）；如果节点是新创建的，可能会打上插入标记（Placement Tag）；如果节点被移除，可能会打上删除标记（Deletion Tag）等。

5. 更新 Fiber 节点： 根据生成的更新计划和标记，Reconciler 会更新对应的 Fiber 节点以反映组件的最新状态。更新操作可能包括更新节点的状态、更新节点的属性、调用生命周期方法等。

6. 递归处理子节点： 对于每个节点的子节点，React 会递归地重复进行上述的比较和更新操作，以确保整个组件树都得到了正确的处理。

当所有 React Element 都比较完成之后，会生成一棵新的 Fiber 树，此时，一共存在两棵 Fiber 树：

- current: 与视图中真实 UI 对应的 Fiber 树，当 React 开始新的一轮渲染时，会使用 current 作为参考来比较新的树与旧树的差异，决定如何更新 UI；
- workInProgress: 触发更新后，正在 Reconciler 中计算的 Fiber 树，一旦 workInProgress 上的更新完成，它将会被提交为新的current，成为下一次渲染的参考树，并清空旧的 current 树。
