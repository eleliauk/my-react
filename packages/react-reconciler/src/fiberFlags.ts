export type Flags = number;

// 没有任何操作标记
// 二进制：0000000
export const NoFlags = 0b0000000;

// 表示该 fiber 节点已经完成工作
// 用于标记节点已被处理过
// 二进制：0000001
export const PerformedWork = 0b0000001;

// 表示节点需要插入到 DOM 中或者需要改变位置
// 在首次渲染或者节点移动时使用
// 二进制：0000010
export const Placement = 0b0000010;

// 表示节点需要更新
// 当 props、state 等发生改变时使用
// 二进制：0000100
export const Update = 0b0000100;

// 表示需要删除子节点
// 当组件的子元素需要从 DOM 中移除时使用
// 二进制：0001000
export const ChildDeletion = 0b0001000;
