import { Ref } from 'vue'

// 菜单
export interface IMenus {
  id: string // 数据ID
  title: string // 菜单标题
  name: string // 菜单名称
  isActivate: boolean // 激活选项
  form: Ref<any> // 表单动态组件
  module: Ref<any> // 页面模块动态组件
  isOption: boolean // 是否可操作
  isChecked: boolean // 是否开启模块
  isPage: boolean // 模块是否在页面显示
  sort: number // 模块是否在页面显示
}
