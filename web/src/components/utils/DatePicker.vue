<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  modelValue?: string
  placeholder?: string
}>()

const value = ref(props.modelValue)
const emit = defineEmits(['update:modelValue'])

function updateValue() {
  emit('update:modelValue', value)
}
</script>

<template>
  <el-date-picker
    @change="updateValue"
    v-model="value"
    value-format="YYYY-MM"
    :clearable="false"
    :editable="false"
    type="month"
    :placeholder="props.placeholder"
  />
</template>

<style scoped lang="scss"></style>
