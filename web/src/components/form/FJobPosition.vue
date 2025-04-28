<script setup lang="ts">
import form from '@/utils/form.ts'
import { getStore } from '@/utils'
import { IBasicInfo } from '@/store/interface/basicinfo.ts'

const data = getStore<IBasicInfo>('getBasicInfo')
</script>

<template>
  <div>
    <el-row class="split-row-2">
      <el-col :span="6">
        <div class="split-2">
          <label>求职岗位</label>
          <el-input
            v-model="data.desiredPosition"
            placeholder="请输入岗位名称"
            clearable
          />
        </div>
      </el-col>
      <el-col :span="6">
        <div class="split-2">
          <label>意向城市</label>
          <el-input
            v-model="data.desiredCity"
            placeholder="请输入城市名称"
            clearable
          />
        </div>
      </el-col>
      <el-col :span="6">
        <div class="split-2">
          <label>期望薪资</label>
          <el-input
            v-model="data.desiredSalary"
            placeholder="请输入期望薪资"
            clearable
          />
        </div>
      </el-col>
      <el-col :span="6">
        <div class="split-2">
          <label>入职时间</label>
          <el-select-v2
            v-model="data.startDate"
            :options="form.startDate"
            placeholder="请选择入职时间"
          />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss"></style>
