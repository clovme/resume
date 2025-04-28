import { useStore } from 'vuex'
import { State } from '@/store/interface'
import { computed, ComputedRef } from 'vue'
import axios from './axios.ts'
import { ElMessage } from 'element-plus'

/**
 * 类似jQuery选择元素
 * @param selector
 */
export function $(selector: string): NodeListOf<HTMLElement> {
  const elem = document.querySelectorAll(selector)
  if (!elem) {
    throw new Error(`Element ${selector} not found`)
  }
  return elem as NodeListOf<HTMLElement>
}

/**
 * 获取元素实际的值，x,y,width,height
 * @param selector
 */
export function elemRect(selector: string): DOMRect {
  return $(selector)[0].getBoundingClientRect()
}

/**
 * 操作表单页面宽
 * @param col 多少列
 * @param w 总宽度减去多少
 */
export function getFormPageWidth(col: number = 4, w: number = 100) {
  const menuEditTabItem = $('.edit-tab-item')
  return (
    ((menuEditTabItem[0] as HTMLElement).offsetWidth * menuEditTabItem.length -
      w) /
    col
  )
}

/**
 * 交换数组元素
 * @param arr 数组
 * @param index1 索引1
 * @param index2 索引2
 */
export function swapArray(arr: object[], index1: number, index2: number) {
  // 确保索引在数组范围内
  if (
    index1 < 0 ||
    index1 >= arr.length ||
    index2 < 0 ||
    index2 >= arr.length
  ) {
    return arr // 如果索引超出范围，则直接返回原数组
  }
  // 使用 splice 方法删除一个元素并插入另一个元素，来实现交换
  arr.splice(index2, 1, arr.splice(index1, 1, arr[index2])[0])
}

/**
 * 获取store的数据
 * @param obj 获取的对象
 */
export function getStore<T>(obj: string): ComputedRef<T> {
  const store = useStore<State>()
  return computed<T>(() => store.getters[obj])
}

export function PPI(): number {
  // 获取屏幕分辨率
  const screenWidthPx = window.screen.width
  const screenHeightPx = window.screen.height

  // 获取屏幕物理尺寸（对于大多数设备，使用默认值为7英寸）
  const screenWidthInches = 7
  const screenHeightInches = 5

  // 计算PPI
  const screenPpiWidth = screenWidthPx / screenWidthInches
  const screenPpiHeight = screenHeightPx / screenHeightInches

  // 取宽高平均值作为估算的PPI
  const screenPpi = (screenPpiWidth + screenPpiHeight) / 2

  return Number(screenPpi.toFixed(2))
}

export function calculatePageNumber(
  height: number,
  pageHeight: number,
): number {
  // 如果高度正好是 1090 的倍数，返回 1
  if (height % pageHeight === 0) {
    return height / pageHeight
  }

  // 否则，返回 (高度 / 1090) 向上取整的结果
  return Math.ceil(height / pageHeight)
}

export function saveForm(url: string, data: any) {
  axios.put(url, data).then((response) => {
    if (response.data.code !== 200) {
      ElMessage({
        message: response.data.message,
        offset: 55,
        grouping: true,
        type: 'error',
      })
      return
    }
    ElMessage({
      message: response.data.message,
      offset: 55,
      grouping: true,
      type: 'success',
    })
  })
}
