<script setup lang="ts">
import { reactive, ref } from 'vue'
import CustomTabsLabel from '@/components/CustomTabsLabel.vue'
import { $, elemRect, getStore, swapArray } from '@/utils'
import { ElNotification, TabPaneName, TabsPaneContext } from 'element-plus'
import { IMenus } from '@/store/interface/menus.ts'
import axios from '@/utils/axios.ts'

const closeIcon = ['icon-up', 'icon-down']

const form = reactive({
  id: '',
  title: '',
})
const title = ref('')
const isDialog = ref(false)
const isClose = ref(false)
const switchActiveName = ref('')
const closeStyle = ref({ display: 'none' })
const activeName = ref(localStorage.getItem('activeName'))

const menus = getStore<IMenus[]>('getMenus')

// 执行初始选择标签
const timer = setTimeout(() => {
  if (activeName.value) {
    for (const item of menus.value) {
      if (item.name === activeName.value && !item.isChecked) {
        setInitActiveName()
        break
      }
    }
  } else {
    setInitActiveName()
  }
  closeStyle.value.display = 'block'
}, 100)

// 检测默认选中状态
function setInitActiveName() {
  for (const item of menus.value) {
    if (item.isActivate) {
      activeName.value = item.name
      localStorage.setItem('activeName', item.name)
      clearTimeout(timer)
      break
    }
  }
}

// 切换标签，存储当前激活标签标志
function handleTabChange(paneName: TabPaneName) {
  if (switchActiveName.value.length > 0) {
    const timer = setTimeout(function () {
      activeName.value = switchActiveName.value
      localStorage.setItem('activeName', switchActiveName.value)
      switchActiveName.value = ''
      clearTimeout(timer)
    }, 10)
  } else if (paneName && typeof paneName === 'string') {
    localStorage.setItem('activeName', paneName)
  }
}

function onTabClick(pane: TabsPaneContext) {
  let elem = document.querySelector(`#${pane.paneName}`) as HTMLElement
  if (!elem) {
    elem = document.querySelector(`#BasicInfo`) as HTMLElement
  }
  const top = elem.getBoundingClientRect().top + window.scrollY - 60
  window.scrollTo({ top: top, left: 0, behavior: 'smooth' })
}

function minMaxHeight(winHeight: number) {
  const content = $('.el-tabs__content')[0]
  const hb = elemRect('.header-box')
  const hbh = elemRect('.el-tabs__header')
  const close = elemRect('.close')

  winHeight = winHeight - hb.height - hbh.height - close.height - 15
  content.style.maxHeight = `${winHeight}px`
  if (winHeight <= 300) {
    content.style.minHeight = content.style.maxHeight
  } else {
    content.style.minHeight = '300px'
  }
}

// 展示tab表单
function handleClose(active: boolean) {
  const content = $('.el-tabs__content')[0]
  const et = elemRect('.el-tabs__nav')

  content.style.transition = '0.3s'
  if (isClose.value && active) {
    content.style.height = '0'
    content.style.minHeight = '0'
    content.style.maxHeight = '0'
    content.style.padding = '0'
    content.style.overflowY = 'hide'
    isClose.value = !isClose.value
  } else if (!isClose.value) {
    content.style.height = 'auto'
    content.style.maxWidth = `${et.width}px`
    content.style.padding = '12px 0 40px'
    content.style.overflowY = 'auto'
    minMaxHeight(window.innerHeight)
    isClose.value = !isClose.value
  }
}

/**
 * 菜单排序，向前或者向后排序
 * @param idx1 当前索引
 * @param flag 向前(t)或者向后(f)
 */
function menuSore(idx1: number, flag: boolean) {
  const idx2 = flag ? idx1 - 1 : idx1 + 1
  swapArray(menus.value, idx1, idx2)
  let dataId = []
  for (let i = 0; i < menus.value.length; i++) {
    dataId.push(menus.value[i].id)
  }
  axios.put('/menus/sort', dataId)
  switchActiveName.value = menus.value[idx2].name
}

/**
 * 编辑模块名称初始化
 * @param name 标题
 * @param id id
 */
function onEditModuleItem(name: string, id: string) {
  form.id = id
  form.title = name
  title.value = `修改模块（${name}）名称`
  isDialog.value = true
}

// 编辑模块名称
function onEditModuleName() {
  if (form.title.trim().length >= 5) {
    ElNotification({
      title: '修改提示',
      message: `名称（${form.title}）不能超过5个字！`,
      type: 'warning',
    })
    return
  }
  axios.put('/menus/edit/name', form).then((res) => {
    if (res.data.code !== 200) {
      ElNotification({
        title: '修改提示',
        message: res.data.message,
        type: 'warning',
      })
      return
    }
    for (const menu of menus.value) {
      if (menu.id === form.id) {
        menu.title = form.title
        isDialog.value = false
        break
      }
    }
  })
}

window.onresize = function (e: Event) {
  if (isClose.value) {
    minMaxHeight((e.target as Window).innerHeight)
  }
}
window.onload = function () {
  if (isClose.value) {
    minMaxHeight(window.innerHeight)
  }
}
</script>

<template>
  <div class="footer-box">
    <div class="footer-box-container">
      <div class="close" @click="handleClose(true)" :style="closeStyle">
        <i :class="[closeIcon[Number(isClose)]]"></i>
      </div>
      <el-tabs
        v-model="activeName"
        @tab-change="handleTabChange"
        @tab-click="onTabClick"
      >
        <el-tab-pane
          :name="menu.name"
          v-for="(menu, index) in menus"
          :disabled="!menu.isChecked"
        >
          <template #label>
            <CustomTabsLabel
              @edit="onEditModuleItem"
              :id="menu.id"
              @tab-sore="menuSore"
              @tab-click="handleClose(false)"
              v-model="menu.isChecked"
              :option="menu.isOption"
              :title="menu.title"
              :index="index"
            />
          </template>
          <component
            v-show="menu.isChecked"
            :is="menu.form"
            class="pane-form-item"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
  <el-dialog v-model="isDialog" :title="title" width="400" :lock-scroll="false">
    <el-form label-width="auto">
      <el-form-item>
        <el-input v-model="form.title" placeholder="请输入新名称" clearable />
      </el-form-item>
      <el-form-item style="margin-bottom: 0">
        <div style="display: flex; flex: 1; justify-content: flex-end">
          <div style="width: 200px; display: flex">
            <el-button
              style="flex: 1"
              @click="onEditModuleName"
              :disabled="title.trim().length <= 0"
              type="primary"
            >
              确定
            </el-button>
            <el-button style="flex: 1" @click="isDialog = false"
              >取消</el-button
            >
          </div>
        </div>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<style scoped lang="scss">
@mixin item-block() {
  .tabs-label-switch {
    opacity: 1;

    .tabs-label-edit i {
      display: block;
    }

    .tabs-label-switch-lr i {
      display: block;
    }

    .el-switch--small {
      width: 36px;

      .el-switch__core {
        min-width: 36px;

        .el-switch__action {
          background-color: #fff;
        }
      }
    }
  }
  .tabs-label-edit i {
    display: block;
  }
}

@-webkit-keyframes btn-show-edit-data {
  56%,
  66%,
  74%,
  80%,
  to {
    transform: translateY(0);
  }
  61% {
    transform: translateY(-12px);
  }
  70% {
    transform: translateY(-6px);
  }
  77% {
    transform: translateY(-3px);
  }
}

@keyframes btn-show-edit-data {
  56%,
  66%,
  74%,
  80%,
  to {
    transform: translateY(0);
  }
  61% {
    transform: translateY(-12px);
  }
  70% {
    transform: translateY(-6px);
  }
  77% {
    transform: translateY(-3px);
  }
}

.footer-box {
  position: fixed;
  width: 100%;
  bottom: 0;
  left: 0;
  user-select: none;
  background-color: #fff;
  display: flex;
  justify-content: center;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);

  .footer-box-container {
    position: relative;

    :deep(.el-tabs__content) {
      transition: all 0.3s ease 0s;
      height: 0;
      min-height: 0;
      max-height: 0;

      .el-tab-pane > .pane-form-item {
        padding: 0 10px;
        font-size: 12px;

        label {
          width: 65px;
          text-align: right;
        }

        .el-checkbox,
        .el-c-button,
        .el-select,
        .el-input {
          height: 28px;
          line-height: 28px;
        }

        .el-date-editor {
          width: unset;
        }

        .el-select > .el-select__wrapper {
          line-height: 24px;
          min-height: 28px;
          padding: 4px 10px;
          font-size: 12px;
        }

        .el-upload-list {
          margin: 0;
        }

        .split-row-module {
          .split-row-1 {
            margin-bottom: 5px;

            .el-col {
              display: flex;
              align-items: center;

              .el-divider {
                margin: 10px 0;
              }

              .split-1 {
                display: flex;
                align-items: center;
                flex: 1;
                gap: 3px;
                padding: 0 5px;

                label {
                  width: 67px;
                }
              }
            }

            &:last-child {
              margin-bottom: 0;
            }
          }
        }

        .split-row-2 {
          display: flex;
          gap: 5px 0;
          margin-left: -22px;
          margin-right: -20px;

          .el-col {
            display: flex;
            align-items: center;
            gap: 5px;

            .split-2 {
              display: flex;
              align-items: center;
              flex: 1;
              gap: 5px;
              padding: 0 25px;

              i.icon-circle-with-minus {
                color: red;
                opacity: 0.6;
                font-size: 18px;
                transition: 0.3s;
                cursor: pointer;

                &:hover {
                  opacity: 1;
                }
              }
            }
          }
        }
      }
    }

    // label 样式
    :deep(.el-tabs__header) {
      margin-bottom: 0;
      background-color: #fff;

      .el-tabs__nav-wrap {
        margin-bottom: 0;

        .el-tabs__nav-scroll {
          display: flex;
          justify-content: center;

          .el-tabs__nav {
            gap: 1px;
            height: 55px;

            .el-tabs__item:nth-child(3) {
              .icon-sliderleft {
                display: none !important;
              }
            }

            .el-tabs__item:last-child {
              .icon-sliderright {
                display: none !important;
              }
            }

            .el-tabs__active-bar {
              background-color: #f60 !important;
            }

            .is-active {
              color: #f60 !important;
              @include item-block();
            }

            .is-disabled {
              cursor: pointer;

              .el-switch__core,
              .el-switch__action {
                border-color: rgb(187, 187, 187);
                background-color: rgb(187, 187, 187);
              }
            }

            .el-tabs__item:not(.is-disabled):hover {
              color: #f60 !important;
              @include item-block();
            }

            .el-tabs__item.is-disabled:hover {
              color: #a8abb2 !important;
              @include item-block();
            }

            .el-tabs__item {
              height: 55px;
              padding: 0;
              width: 92px;
              transition: color 0.3s;

              &.is-disabled {
                .tabs-label-switch-lr {
                  width: 34px;
                }
              }
            }
          }
        }
      }
    }

    .close {
      color: #13d8a7;
      width: 80px;
      height: 80px;
      border-radius: 50%;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
      position: absolute;
      left: calc(50% - 40px);
      top: -35px;
      background-color: #fff;
      cursor: pointer;
      text-align: center;
      line-height: 35px;
      font-size: 20px;
      transition: all 0.2s ease-out 0s;
      animation: btn-show-edit-data 4s linear 0s normal none infinite;

      &:hover {
        top: -45px;
        line-height: 45px;
      }
    }
  }
}
</style>
