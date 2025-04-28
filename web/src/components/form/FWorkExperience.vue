<script setup lang="ts">
import { getStore, saveForm, swapArray } from '@/utils'
import { ref, watch } from 'vue'
import RichText from '@/components/utils/RichText.vue'
import plus from '@/components/icon/plus.vue'
import { IWorksExperience } from '@/store/interface/works.ts'
import axios from '@/utils/axios.ts'
import { ElMessage } from 'element-plus'

let timer = 0
const isNewWorkItem = ref<boolean>(false)
const datas = getStore<IWorksExperience[]>('getWorks')

watch(datas.value, (newValue) => {
  clearTimeout(timer)

  if (isNewWorkItem.value) {
    isNewWorkItem.value = false
    return
  }

  timer = setTimeout(function () {
    saveForm('/works', newValue)
    clearTimeout(timer)
  }, 1000)
})

function onPlusWork() {
  for (const data of datas.value) {
    if (data.title || data.name || data.content) {
      if (data.title.trim().length <= 0) {
        ElMessage({
          message: '请先填写完表单关键信息！',
          offset: 55,
          grouping: true,
          type: 'error',
        })
        return
      } else if (data.name.trim().length <= 0) {
        ElMessage({
          message: '请先填写完表单关键信息！',
          offset: 55,
          grouping: true,
          type: 'error',
        })
        return
      } else if (data.content.trim().length <= 0) {
        ElMessage({
          message: '请先填写完表单关键信息！',
          offset: 55,
          grouping: true,
          type: 'error',
        })
        return
      }
    }
  }

  axios.post('/works').then((response) => {
    if (response.data.code !== 200) {
      ElMessage({
        message: response.data.message,
        offset: 55,
        grouping: true,
        type: 'error',
      })
      return
    }
    datas.value.push(response.data.data)
    isNewWorkItem.value = true
  })
}

function onRemoveWorkItem(id: string) {
  axios.delete(`/works?id=${id}`).then((response) => {
    if (response.data.code !== 200) {
      ElMessage({
        message: response.data.message,
        offset: 55,
        grouping: true,
        type: 'error',
      })
      return
    }
    for (let i = 0; i < datas.value.length; i++) {
      if (datas.value[i].id === id) {
        isNewWorkItem.value = true
        datas.value.splice(i, 1)
      }
    }
  })
}

function onUpDownMove(index: number, flag: boolean) {
  const index2 = flag ? index - 1 : index + 1
  swapArray(datas.value, index, index2)
  isNewWorkItem.value = true

  let dataId = []
  for (let i = 0; i < datas.value.length; i++) {
    isNewWorkItem.value = true
    dataId.push(datas.value[i].id)
  }
  axios.put('/works/sort', dataId).then((res) => {
    ElMessage({
      message: res.data.message,
      offset: 55,
      grouping: true,
      type: 'success',
    })
  })
}
</script>

<template>
  <div>
    <div class="split-row-module" v-for="(data, index) in datas" :key="index">
      <el-row class="split-row-1">
        <el-col :span="6">
          <div class="split-1">
            <label>公司名称</label>
            <el-input
              v-model="data.name"
              placeholder="请输入公司名称"
              clearable
            />
          </div>
        </el-col>
        <el-col :span="5">
          <div class="split-1">
            <label>职位</label>
            <el-input
              v-model="data.title"
              placeholder="请输入职位名称"
              clearable
            />
          </div>
        </el-col>
        <el-col :span="8">
          <div class="split-1">
            <label>在职时间</label>
            <el-date-picker
              :clearable="false"
              v-model="data.startAt"
              style="width: 130px"
              type="month"
              placeholder="开始时间"
              value-format="YYYY-MM"
            />
            -
            <el-date-picker
              :clearable="false"
              v-model="data.endAt"
              style="width: 130px"
              type="month"
              placeholder="结束时间"
              value-format="YYYY-MM"
              v-if="!data.toNow"
            />
            <el-checkbox v-model="data.toNow" label="至今" />
          </div>
        </el-col>
        <el-col :span="5">
          <div class="split-1" style="justify-content: flex-end">
            <el-button
              @click="onUpDownMove(index, true)"
              class="el-c-button"
              type="success"
              round
              >上移</el-button
            >
            <el-button
              @click="onUpDownMove(index, false)"
              class="el-c-button"
              type="success"
              round
              >下移</el-button
            >
            <el-button
              @click="onRemoveWorkItem(data.id)"
              class="el-c-button"
              type="danger"
              round
              >删除</el-button
            >
          </div>
        </el-col>
      </el-row>
      <el-row class="split-row-1">
        <el-col>
          <div class="split-1">
            <RichText
              v-model="data.content"
              placeholder="详细描述你的职责范围、工作任务及取得的成绩，描述尽量具体简洁，工作经验的描述尽量与目标岗位的招聘要求匹配。"
            />
          </div>
        </el-col>
        <el-col>
          <el-divider
            border-style="dashed"
            style="border-color: #ffc69f"
          ></el-divider>
        </el-col>
      </el-row>
    </div>
    <el-row>
      <el-col>
        <el-button
          @click="onPlusWork"
          type="success"
          size="large"
          :icon="plus"
          round
          >新增一条工作经历</el-button
        >
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss"></style>
