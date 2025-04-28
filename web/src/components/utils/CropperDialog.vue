<script setup lang="ts">
import { ref, watch } from 'vue'
import 'vue-cropper/dist/index.css'
import { VueCropper } from 'vue-cropper'
import { UploadFile } from 'element-plus'

// 定义 Cropper 的接口
interface CropperInstance {
  getCropData(callback: (data: string) => void): void // 假设 getCropData 接受一个回调函数
}

const props = defineProps<{
  imgUrl?: string
  modelValue?: boolean
}>()

// 指定 cropperRef 的类型
const cropperRef = ref<CropperInstance | null>(null) // 初始为 null
const option = ref({
  img: props.imgUrl,
  modelValue: props.modelValue,
})

watch(props, (newValue) => {
  option.value.img = newValue.imgUrl
  option.value.modelValue = newValue.modelValue
})

const emit = defineEmits(['closed', 'save'])

function onGetCropData() {
  if (cropperRef.value) {
    // 确保 cropperRef.value 不为 null
    cropperRef.value.getCropData((data: string) => {
      emit('save', data)
    })
  }
}

function onDefaultPhoto() {
  emit('save', null)
}

function closed() {
  emit('closed')
}

function elUploadFile(file: UploadFile) {
  if (!file || !file.raw) return // 检查文件对象是否存在

  const reader = new FileReader() // 创建 FileReader 实例

  reader.onload = (e) => {
    if (e.target === null || typeof e.target.result != 'string') {
      return
    }
    option.value.img = e.target.result
  }

  reader.readAsDataURL(file.raw) // 读取文件为 Data URL (Base64)
}
</script>

<template>
  <el-dialog
    v-model="option.modelValue"
    @closed="closed"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    title="照片裁剪"
    width="400"
    align-center
  >
    <vueCropper
      ref="cropperRef"
      :img="option.img"
      :fixed="true"
      :fixedBox="true"
      :autoCrop="true"
      :centerBox="true"
      :canMoveBox="false"
      :autoCropWidth="100"
      :autoCropHeight="142"
      :fixedNumber="[7, 10]"
      outputType="webp"
    ></vueCropper>
    <template #footer>
      <div class="dialog-footer">
        <div style="display:flex;gap: 10px">
          <el-button @click="onDefaultPhoto" type="primary">&nbsp;&nbsp;默认&nbsp;&nbsp;</el-button>
          <el-upload v-model="option.img" accept="image/png,image/jpeg" :show-file-list="false" :auto-upload="false" @change="elUploadFile">
            <el-button type="danger">&nbsp;&nbsp;上传&nbsp;&nbsp;</el-button>
          </el-upload>
        </div>
        <div style="display:flex;gap: 10px">
          <el-button @click="option.modelValue = false">&nbsp;&nbsp;取消&nbsp;&nbsp;</el-button>
          <el-button style="margin-left: unset" type="success" @click="onGetCropData">&nbsp;&nbsp;保存&nbsp;&nbsp;</el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.vue-cropper {
  height: 300px;
}
.dialog-footer {
  display: flex;
  justify-content: space-between;
}
</style>
