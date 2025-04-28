<script setup lang="ts">
import { getStore, saveForm } from '@/utils'
import plus from '@/components/icon/plus.vue'
import {
  IApplicationInfo,
  ICourseGrade,
} from '@/store/interface/applicationinfo.ts'
import { reactive, ref, watch } from 'vue'
import { ElMessage, ElNotification } from 'element-plus'
import axios from '@/utils/axios.ts'

const form = reactive({ name: '', score: '' })

let timerData = 0
let timerGrade = 0
const isNewDataItem = ref<boolean>(false)
const isNewGradeItem = ref<boolean>(false)
const data = getStore<IApplicationInfo>('getApplicationInfo')
const courseGrade = getStore<ICourseGrade[]>('getCourseGrade')

watch(data.value, (newValue) => {
  clearTimeout(timerData)
  if (isNewDataItem.value) {
    isNewDataItem.value = false
  }

  timerData = setTimeout(function () {
    saveForm('/applicationinfo', [newValue])
    clearTimeout(timerData)
  }, 1000)
})

watch(courseGrade.value, (newValue) => {
  clearTimeout(timerGrade)
  if (isNewGradeItem.value) {
    isNewGradeItem.value = false
  }

  timerGrade = setTimeout(function () {
    saveForm('/applicationinfo/grade', newValue)
    clearTimeout(timerGrade)
  }, 1000)
})

function addCourseGrade() {
  if (!form.name || form.name.trim().length <= 0) {
    ElNotification({
      title: '提示信息',
      message: '专业课名称不能为空。',
      type: 'warning',
    })
    return
  }
  if (!form.score || form.score.trim().length <= 0) {
    ElNotification({
      title: '提示信息',
      message: '专业课成绩不能为空。',
      type: 'warning',
    })
    return
  }
  axios.post('/applicationinfo/grade', form).then((response) => {
    if (response.data.code !== 200) {
      ElMessage({
        message: response.data.message,
        offset: 55,
        grouping: true,
        type: 'error',
      })
      return
    }
    isNewDataItem.value = true
    isNewGradeItem.value = true
    courseGrade.value.push(response.data.data)
    form.name = ''
    form.score = ''
  })
}

function removeCourseGrade(id: string) {
  axios.delete(`/applicationinfo/grade?id=${id}`).then((response) => {
    if (response.data.code !== 200) {
      ElMessage({
        message: response.data.message,
        offset: 55,
        grouping: true,
        type: 'error',
      })
      return
    }
    for (let i = 0; i < courseGrade.value.length; i++) {
      if (courseGrade.value[i].id === id) {
        isNewDataItem.value = true
        isNewGradeItem.value = true
        courseGrade.value.splice(i, 1)
      }
    }
  })
}
</script>

<template>
  <div>
    <div class="split-row-module">
      <el-row class="split-row-1" style="margin-bottom: 15px">
        <el-col :span="5">
          <div class="split-1">
            <label>报考院校</label>
            <el-input
              v-model="data.name"
              placeholder="请输入报考院校"
              clearable
            />
          </div>
        </el-col>
        <el-col :span="5">
          <div class="split-1">
            <label>报考专业</label>
            <el-input
              v-model="data.major"
              placeholder="请输入专业名称"
              clearable
            />
          </div>
        </el-col>
        <el-col :span="14"></el-col>
      </el-row>
      <el-row class="split-row-1">
        <el-col style="margin-bottom: 15px" v-if="courseGrade.length > 0">
          <div class="split-1">
            <el-row>
              <el-col :span="24">
                <table class="baokao-table">
                  <tr>
                    <td rowspan="2">
                      <input type="text" v-model="data.cname" />
                    </td>
                    <td v-for="item in courseGrade">
                      <input type="text" v-model="item.name" />
                    </td>
                  </tr>
                  <tr>
                    <td v-for="item in courseGrade">
                      <input type="text" v-model="item.score" />
                    </td>
                  </tr>
                  <tr>
                    <td>删除</td>
                    <td v-for="item in courseGrade">
                      <i
                        @click="removeCourseGrade(item.id)"
                        class="icon-circle-with-minus"
                      />
                    </td>
                  </tr>
                </table>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col style="margin-bottom: 15px">
          <el-divider border-style="dashed" style="border-color: #ffc69f"
            ><b>表格数据可任意编辑</b></el-divider
          >
        </el-col>
        <el-col :span="11">
          <div class="split-1">
            <el-input
              v-model="form.name"
              placeholder="专业课名称，例如：英语"
              clearable
            />:
            <el-input
              v-model="form.score"
              placeholder="专业课成绩，例如：80"
              clearable
            />
            <el-button
              @click="addCourseGrade"
              class="el-c-button"
              :icon="plus"
              plain
              >添加专业课成绩</el-button
            >
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style scoped lang="scss">
table.baokao-table {
  border-collapse: collapse;

  td {
    border: 1px solid #aaa;
    text-align: center;
    font-weight: 400;
    width: 80px;
    height: 27px;
    white-space: nowrap;

    input {
      width: 100%;
      height: 100%;
      text-align: center;
      min-width: auto;
      max-width: unset;
    }

    input[type='text' i] {
      padding-block: 0;
      padding-inline: 0;
    }

    input,
    input:active,
    input:hover,
    input:focus,
    input:focus-visible,
    input:focus-visible {
      border: none;
      outline: none;
    }
  }

  tr:last-child {
    td {
      padding: 2px;

      i.icon-circle-with-minus {
        color: red;
        opacity: 0.6;
        font-size: 22px;
        transition: 0.3s;
        cursor: pointer;

        &:hover {
          opacity: 1;
        }
      }
    }
  }
}
</style>
