<script setup lang="ts">
import { IResumes } from '@/store/interface/resume.ts'

const props = defineProps<{
  data: IResumes[]
}>()

// 事件发射器
const emit = defineEmits(['NewResume', 'selectItem', 'edit', 'remove', 'copy'])

function onNewResume(e: Event) {
  emit('NewResume', e)
}

function onClickEdit(data: IResumes) {
  emit('edit', data)
}

function onClickRemove(data: IResumes) {
  emit('remove', data)
}

function href(uri: string) {
  location.href = `?rid=${uri}`
}

function onClickCopy(data: IResumes) {
  emit('copy', data)
}
</script>

<template>
  <el-row class="resume-list-body">
    <el-col :span="4" v-for="item in props.data">
      <div class="resume-list-item">
        <div class="resume-list-item-option">
          <i class="icon-edit" @click="onClickEdit(item)" />
          <i class="icon-fuzhi" @click="onClickCopy(item)" />
          <i class="icon-delete" @click="onClickRemove(item)" />
        </div>
        <a @click.prevent="href(item.id)" :href="`?rid=${item.id}`">
          <div
            class="resume-list-item-icon"
            style="background-image: url(/assets/1004.png)"
          ></div>
          <div class="resume-list-item-option-name" v-text="item.name"></div>
        </a>
      </div>
    </el-col>
    <el-col :span="3">
      <div class="resume-list-item" @click="onNewResume">
        <div class="resume-list-item-icon"><i class="icon-plus" /></div>
        <span>新建简历</span>
      </div>
    </el-col>
  </el-row>
</template>

<style scoped lang="scss">
.resume-list-body {
  max-width: 820px;
  display: flex;
  margin: 0 auto;

  .el-col {
    .resume-list-item {
      position: relative;
      cursor: pointer;
      user-select: none;
      height: 160px;
      width: 130px;
      color: #13a783;
      margin: 0 5px 5px 0;
      border-radius: 2px;
      border: 1px solid #dcdfe6;
      transition: all 0.3s;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      a {
        color: #13a783;
        text-decoration: none;
        display: flex;
        flex-direction: column;
        align-items: center;
        transition: all 0.3s;

        &:hover {
          color: #409eff;
        }
      }

      &:hover {
        color: #409eff;

        .resume-list-item-option {
          opacity: 1;
        }
      }

      .resume-list-item-option {
        display: flex;
        width: 120px;
        position: absolute;
        top: 0;
        justify-content: flex-end;
        opacity: 0;
        gap: 10px;
        transition: all 0.3s;
        border-bottom: 1px solid #ecedf1;
        padding: 3px 5px;
        background-color: #fff;

        i {
          font-size: 20px;
        }

        i:first-child {
          opacity: 0.7;
          color: #13a783;
        }

        i:last-child {
          color: #f56c6c;
          opacity: 0.7;
        }

        i:first-child:hover,
        i:last-child:hover {
          opacity: 1;
        }
      }

      .resume-list-item-option-name {
        display: flex;
        width: 120px;
        transition: all 0.3s;
        border-bottom: 1px solid #ecedf1;
        padding: 3px 5px;
        font-size: 13px;
        justify-content: center;
        opacity: 1;
        border-bottom: unset;
        height: 18px;
        background-color: #fff;
      }

      .resume-list-item-icon {
        height: 130px;
        width: 130px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-size: cover;

        i {
          font-size: 100px;
        }
      }

      span {
        font-size: 14px;
      }
    }
  }
}
</style>
