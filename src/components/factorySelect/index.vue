<template>
  <el-select v-model="value" placeholder="请选择厂家" clearable filterable @change="change">
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
  created() {
    this.getList()
  },
  data() {
    return {
      options: [],
      value: ''
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
