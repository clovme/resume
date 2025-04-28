export interface IEditTabItem {
  title: string // 标题
  last: boolean // 带选择最后一个元素标识
  first: boolean // 带选择第一个元素标识
  checked: boolean // 是否选中
  activate: boolean // 是否激活
  option: boolean // 是否可操作
  index: number // 当前元素在列表中的索引
}
