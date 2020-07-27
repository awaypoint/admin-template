<template>
  <el-select v-model="value" placeholder="请选择门店" clearable filterable :style="styleStr" @change="change">
    <el-option
      v-for="item in options"
      :key="item.id"
      :label="item.name"
      :value="item.id">
    </el-option>
  </el-select>
</template>

<script>
import { getShopGroupCombo } from '@/api/shop'
export default {
  name: 'shopSelect',
  props: {
    isQuery: {
      default: false
    }
  },
  created() {
    this.getList()
    if (this.isQuery) {
      this.styleStr = 'display: inline-block;vertical-align: middle;margin-bottom: 10px;width:180px;'
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
      getShopGroupCombo().then(res => {
        this.options = res.response
      }).catch(() => {})
    },
    change(value) {
      this.$emit('selectShop', value)
    },
    setValue(value) {
      this.value = value
    }
  }
}
</script>
