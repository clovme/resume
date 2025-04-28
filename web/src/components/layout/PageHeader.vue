<script setup lang="ts">
import { ref, h, reactive, watch } from 'vue'
import ResumeList from '@/components/utils/ResumeList.vue'
import axios from '@/utils/axios.ts'
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus'
import { IResumes } from '@/store/interface/resume.ts'
import form from '@/utils/form.ts'
import { elemRect, getStore, saveForm } from '@/utils'
import { ISlogan } from '@/store/interface/slogan.ts'
import { ISetting } from '@/store/interface/setting.ts'

const params = new URLSearchParams(window.location.search)
let rid = params.get('rid')
let isInit = true
let isInit1 = true
const name = ref('')
const drawer = ref(!rid)
const title = ref('新增简历')
const isResume = ref(false)
const newResume = ref(false)
const drawerData = ref<IResumes[]>([])
const isHeaderTitle = ref(false)

const slogan = getStore<ISlogan>('getSlogan')
const setting = getStore<ISetting>('getSetting')
const data = ref<ISlogan>({} as ISlogan)
const dataSetting = ref<ISetting>({ lines: 0 } as ISetting)
const resume = reactive({ id: '', name: '' })

const tempTemp = setTimeout(function () {
  if (!setting.value) return
  dataSetting.value.id = setting.value.id
  dataSetting.value.fontFamily = setting.value.fontFamily
  dataSetting.value.fontSize = setting.value.fontSize
  dataSetting.value.module = setting.value.module
  dataSetting.value.lines = setting.value.lines
  dataSetting.value.page = setting.value.page
  clearTimeout(tempTemp)
  const temp = setTimeout(function () {
    isInit = false
    clearTimeout(temp)
  }, 3000)
}, 300)

const tempTemp1 = setTimeout(function () {
  if (!slogan.value) return
  data.value.id = slogan.value.id
  data.value.title = slogan.value.title
  data.value.slogan = slogan.value.slogan
  clearTimeout(tempTemp1)
  const temp = setTimeout(function () {
    isInit1 = false
    clearTimeout(temp)
  }, 3000)
}, 300)

let timer = 0
let timerSetting = 0
watch(data.value, (newValue) => {
  if (isInit) return
  slogan.value.id = newValue.id
  slogan.value.title = newValue.title
  slogan.value.slogan = newValue.slogan

  clearTimeout(timer)
  timer = setTimeout(function () {
    saveForm('/slogan', [newValue])
    clearTimeout(timer)
  }, 1000)
})

watch(dataSetting.value, (newValue) => {
  if (isInit1) return
  setting.value.id = newValue.id
  setting.value.fontFamily = newValue.fontFamily
  setting.value.fontSize = newValue.fontSize
  setting.value.module = newValue.module
  setting.value.lines = newValue.lines
  setting.value.page = newValue.page

  clearTimeout(timerSetting)
  timerSetting = setTimeout(function () {
    saveForm('/setting', [newValue])
    clearTimeout(timerSetting)
  }, 1000)
})

// 获取简历列表
function handleOk() {
  axios.get('/resumes').then((res) => {
    if (res.data.data.length > 0) {
      drawerData.value = res.data.data
    }
    drawer.value = true
  })
}

// 显示添加简历
function onShowNewResume() {
  newResume.value = true
  isResume.value = false
}

// 添加简历
function onNewResume() {
  title.value = '新增简历'
  if (name.value.trim().length <= 0) {
    return ElMessage.error({ message: '简历名称不能为空', offset: 55 })
  }

  axios.get(`/resumes/check?name=${name.value}`).then((res) => {
    if (res.data.code !== 200) {
      return ElMessage.error({ message: res.data.message, offset: 55 })
    }
    if (isResume.value) {
      resume.name = name.value
      axios.put('/resumes', resume).then((res) => {
        if (res.data.code !== 200) {
          return ElMessage.error({ message: res.data.message, offset: 55 })
        }
        newResume.value = false
        drawerData.value = res.data.data
      })
      return
    }
    axios.post('/resumes', { name: name.value }).then((res) => {
      if (res.data.code !== 200) {
        return ElMessage.error({ message: res.data.message, offset: 55 })
      }
      ElMessage.success({ message: res.data.message, offset: 55 })
      drawer.value = false
      newResume.value = false
      localStorage.removeItem('activeName')
      setTimeout(function () {
        location.href = `?rid=${res.data.data.id}`
      }, 1000)
    })
  })
}

// 删除简历
function onDeleteResume(data: IResumes) {
  ElMessageBox({
    title: '删除提示',
    message: h('div', { style: 'font-size: 14px' }, [
      h('span', null, '是否删除简历'),
      h('b', { style: 'color: teal' }, `（${data.name}）？`),
    ]),
    showCancelButton: true,
    center: true,
    confirmButtonClass: 'el-button el-button--danger',
  }).then(() => {
    axios.delete(`/resumes?rid=${data.id}`).then((res) => {
      if (res.data.code !== 200) {
        return ElMessage.error({ message: res.data.message, offset: 55 })
      }
      for (let i = 0; i < drawerData.value.length; i++) {
        if (drawerData.value[i].id === data.id) {
          drawerData.value.splice(i, 1)
        }
      }
      const params = new URLSearchParams(location.search)
      if (drawerData.value.length <= 0 || params.get('rid') === data.id) {
        location.href = `/`
      }
    })
  })
}

// 编辑简历
function onEditResume(data: IResumes) {
  title.value = `修改简历（${data.name}）名称`
  newResume.value = true
  isResume.value = true
  name.value = data.name
  resume.id = data.id
  resume.name = data.name
}

async function signOut() {
  const response = await axios.delete('/logout')
  if (response.data.code === 200) {
    localStorage.removeItem('token')
    localStorage.removeItem('expires')
    ElMessage.success({ message: response.data.message, offset: 55 })
    let timer = setTimeout(() => {
      window.location.reload()
      clearTimeout(timer)
    }, 1000)
  } else {
    return ElMessage.error({ message: response.data.message, offset: 55 })
  }
}

function onMouseenter(e: Event) {
  const classList = (
    (e.target as HTMLElement).querySelector(
      '.header-box-content',
    ) as HTMLElement
  ).classList
  if (!classList.contains('header-box-content-active')) {
    classList.add('header-box-content-active')
  }
}

function onMouseleave(e: Event) {
  const classList = (
    (e.target as HTMLElement).querySelector(
      '.header-box-content',
    ) as HTMLElement
  ).classList
  if (classList.contains('header-box-content-active')) {
    classList.remove('header-box-content-active')
  }
}

function onHeaderTitle() {
  const top = elemRect('.resume-head').top + window.scrollY - 60
  window.scrollTo({ top: top, left: 0, behavior: 'smooth' })
  isHeaderTitle.value = true
}

async function exportPDF() {
  const loadingInstance = ElLoading.service({
    fullscreen: true,
    lock: true,
    text: '正在导出PDF文件，请稍等...',
  })
  const element = (
    document.querySelector('.resume-box-content') as HTMLElement
  ).cloneNode(true) as HTMLElement
  ;(element.querySelector('.page-line') as HTMLElement).remove()

  let response = await axios.post('/pdf', { htmlContent: element.outerHTML })
  if (response.data.code && response.data.code !== 200) {
    loadingInstance.close()
    return ElMessage.error({ message: response.data.message, offset: 55 })
  }

  const link = document.createElement('a')
  link.setAttribute('download', response.data.message)

  fetch(
    `${import.meta.env.VITE_API_URL}${response.data.data}`.replace('/api', ''),
  )
    .then((response) => response.blob())
    .then(async (blob) => {
      const url = window.URL.createObjectURL(blob)
      link.href = url
      link.click()
      window.URL.revokeObjectURL(url) // 释放内存

      response = await axios.delete('/pdf/delete')
      if (response.data.code && response.data.code !== 200) {
        loadingInstance.close()
        return ElMessage.error({ message: response.data.message, offset: 55 })
      }
      loadingInstance.close()
    })
}

function linesText(lines: number) {
  if (!lines) return '0.00'
  return lines.toFixed(2)
}

async function onCopyResume(data: IResumes) {
  let response = await axios.post('/resumes/copy', data)
  if (response.data.code !== 200) {
    return ElMessage.error({ message: response.data.message, offset: 55 })
  }
  ElMessage.success({ message: response.data.message, offset: 55 })
  drawerData.value = response.data.data
  drawer.value = false
  newResume.value = false
  localStorage.removeItem('activeName')
  setTimeout(function () {
    location.href = `?rid=${response.data.data.id}`
  }, 1000)
}

function openSource() {
  open('https://github.com/clovme/resume-api.git', '_blank')
}

if (!rid) {
  handleOk()
}
</script>

<template>
  <el-header v-if="rid" class="header-box">
    <div class="header-toolbar-box">
      <ul class="header-toolbar">
        <li><h1>编辑个人简历</h1></li>
        <li
          class="header-toolbar-item"
          @mouseenter="onMouseenter"
          @mouseleave="onMouseleave"
        >
          <i class="icon-page"></i><b>间距设置</b>
          <div class="header-box-content">
            <div class="header-box-content-box">
              <div class="header-box-content-box-item">
                <div class="header-box-content-box-item-option">
                  <div style="flex: 1">模块上下间距：{{ setting.module }}</div>
                  <div class="header-box-content-box-item-default">
                    <el-button
                      @click="
                        () => {
                          dataSetting.module = 18
                        }
                      "
                      v-if="setting.module != 18"
                      size="small"
                      >默认</el-button
                    >
                  </div>
                </div>
                <el-slider
                  v-model="dataSetting.module"
                  :min="5"
                  :max="50"
                  size="small"
                />
              </div>
              <div class="header-box-content-box-item">
                <div class="header-box-content-box-item-option">
                  <div style="flex: 1">
                    行间距：{{ linesText(dataSetting.lines) }}
                  </div>
                  <div class="header-box-content-box-item-default">
                    <el-button
                      @click="
                        () => {
                          dataSetting.lines = 0.87
                        }
                      "
                      v-if="setting.lines != 0.87"
                      size="small"
                      >默认</el-button
                    >
                  </div>
                </div>
                <el-slider
                  v-model="dataSetting.lines"
                  :min="0.61"
                  :max="1.5"
                  :step="0.01"
                  size="small"
                />
              </div>
              <div class="header-box-content-box-item">
                <div class="header-box-content-box-item-option">
                  <div style="flex: 1">页面边距：{{ dataSetting.page }}</div>
                  <div class="header-box-content-box-item-default">
                    <el-button
                      @click="
                        () => {
                          dataSetting.page = 34
                        }
                      "
                      v-if="setting.page != 34"
                      size="small"
                      >默认</el-button
                    >
                  </div>
                </div>
                <el-slider
                  v-model="dataSetting.page"
                  :min="10"
                  :max="60"
                  size="small"
                />
              </div>
            </div>
          </div>
        </li>
        <li
          class="header-toolbar-item"
          @mouseenter="onMouseenter"
          @mouseleave="onMouseleave"
        >
          <i class="icon-font"></i><b>字体设置</b>
          <div
            class="header-box-content"
            style="
              width: 460px;
              padding: 10px;
              align-items: flex-start;
              gap: 10px;
              flex-direction: column;
            "
          >
            <div class="header-box-content-font-size">
              <span>文字大小</span>
              <el-segmented
                block
                v-model="dataSetting.fontSize"
                :options="form.FontSize"
                size="large"
              />
            </div>
            <div class="header-box-content-font-size">
              <span>字体</span>
              <el-segmented
                block
                v-model="dataSetting.fontFamily"
                :options="form.FontFamily"
                size="large"
              />
            </div>
          </div>
        </li>
        <li class="header-toolbar-item" @click="onHeaderTitle">
          <i class="icon-title"></i><b>标题设置</b>
        </li>
        <li class="header-toolbar-item" @click="exportPDF">
          <i class="icon-pdf"></i><b>下载PDF</b>
        </li>
        <li class="header-toolbar-item" @click="handleOk">
          <i class="icon-gerenjianli" /><b>简历列表</b>
        </li>
      </ul>
      <ul class="header-toolbar">
        <li class="header-toolbar-item" @click="openSource">
          <i class="icon-github" /><b>GitHub</b>
        </li>
        <li class="header-toolbar-item" @click="signOut">
          <i class="icon-sign-out" /><b>退出</b>
        </li>
      </ul>
    </div>
  </el-header>
  <el-drawer
    class="resume-list-box"
    v-model="drawer"
    direction="ttb"
    :lock-scroll="true"
    :show-close="false"
    size="100%"
  >
    <template #header="{ close, titleId, titleClass }">
      <div class="resume-list-header">
        <h4 :id="titleId" :class="titleClass">简历列表</h4>
        <div style="display: flex; gap: 5px">
          <el-tooltip content="注销">
            <button class="el-drawer__close-btn" @click="signOut">
              <i class="icon-sign-out-alt" />
            </button>
          </el-tooltip>
          <el-tooltip v-if="rid" content="关闭">
            <button class="el-drawer__close-btn" @click="close">
              <i class="icon-cha" />
            </button>
          </el-tooltip>
        </div>
      </div>
    </template>
    <ResumeList
      @copy="onCopyResume"
      @edit="onEditResume"
      @remove="onDeleteResume"
      @new-resume="onShowNewResume"
      :data="drawerData"
    />
  </el-drawer>

  <el-dialog
    v-model="newResume"
    :title="title"
    width="400"
    @closed="name = ''"
    :lock-scroll="false"
  >
    <el-form label-width="auto">
      <el-form-item>
        <el-input v-model="name" placeholder="请输入简历名称" clearable />
      </el-form-item>
      <el-form-item style="margin-bottom: 0">
        <div style="display: flex; flex: 1; justify-content: flex-end">
          <div style="width: 200px; display: flex">
            <el-button
              style="flex: 1"
              :disabled="name.trim().length <= 0"
              type="primary"
              @click="onNewResume"
              >确定</el-button
            >
            <el-button style="flex: 1" @click="newResume = false"
              >取消</el-button
            >
          </div>
        </div>
      </el-form-item>
    </el-form>
  </el-dialog>

  <el-dialog
    v-model="isHeaderTitle"
    title="简历标题/Slogan设置"
    width="550"
    align-center
  >
    <el-form label-position="top">
      <el-form-item label="简历标题">
        <el-input v-model="data.title" placeholder="简历标题" />
      </el-form-item>
      <el-form-item label="简历 Slogan">
        <el-input
          v-model="data.slogan"
          type="textarea"
          resize="none"
          placeholder="我们的口号是：好好当牛做马"
          rows="4"
        />
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<style scoped lang="scss">
.resume-list-header {
  max-width: 820px;
  display: flex;
  margin: 0 auto;
}

.header-box {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 50px;
  z-index: 6;
  background-color: #fff !important;
  box-shadow: 0 0 12px rgba(57, 57, 77, 0.66);
  display: flex;
  justify-content: center;
  user-select: none;

  .header-toolbar-box {
    display: flex;
    min-width: 820px;
    justify-content: space-between;

    .header-toolbar {
      list-style: none;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: 10px;

      h1 {
        font-size: 30px;
        color: #136e58;
        cursor: pointer;
        margin-right: 20px;
      }

      .header-toolbar-item {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        cursor: pointer;
        position: relative;

        .header-box-content {
          position: absolute;
          top: 50px;
          width: 300px;
          border-radius: 5px;
          background-color: #fff;
          align-items: center;
          justify-content: center;
          display: none;
          transition: all 0.3s;
          box-shadow: 0 0 12px rgba(57, 57, 77, 0.66);

          .header-box-content-font-size {
            display: flex;
            flex-direction: column;
            gap: 10px;
            width: calc(100% - 22px);
            border: 1px solid #dcdfe6;
            padding: 10px;
            border-radius: 5px;

            span {
              font-size: 15px;
              font-weight: bold;
            }
          }

          .header-box-content-box {
            width: 100%;
            margin: 10px;
            gap: 5px;
            display: flex;
            flex-direction: column;

            .header-box-content-box-item {
              padding: 5px 15px;
              font-size: 13px;
              text-align: center;
              border-radius: 3px;
              border: 1px solid #dcdfe6;

              .header-box-content-box-item-option {
                display: flex;
                height: 26px;
                align-items: center;

                .header-box-content-box-item-default {
                  width: 50px;
                  height: 24px;
                }
              }
            }
          }
        }

        .header-box-content-active {
          display: flex;
        }

        i {
          cursor: pointer;
          font-size: 30px;
          color: #13a783;
        }

        b {
          font-size: 14px;
          color: #136e58;
        }

        &:hover {
          i,
          b {
            color: #13d8a7;
            transition: color 0.3s;
          }
        }
      }
    }
  }
}
</style>
