<template>
  <el-select v-model="value" placeholder="请选择厂家" clearable filterable @change="change" :style="styleStr"
  :disabled="disabled">
    <el-option
      v-for="item in options"
      :key="item.id"
      :label="item.name"
      :value="item.id">
    </el-option>
  </el-select>
</template>

<script>
import { getFactoryCombo } from '@/api/factory'
export default {
  name: 'factorySelect',
  props: {
    disabled: {
      default: false
    },
    isQuery: {
      default: false
    }
  },
  created() {
    this.getList()
    if (this.isQuery) {
      this.styleStr = 'display: inline-block;vertical-align: middle;margin-bottom: 10px;width:150px;'
    }
  },
  data() {
    return {
      options: [],
      value: '',
      styleStr: ''
    }
  },
  methods: {
    getList() {
      getFactoryCombo().then(res => {
        this.options = res.response
      }).catch(() => {})
    },
    change(value) {
      this.$emit('selectFactory', value)
    },
    setValue(value) {
      if (value === '0') {
        value = ''
      }
      this.value = value
    }
  }
}
</script>
