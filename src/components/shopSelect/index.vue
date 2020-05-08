<template>
  <el-select v-model="value" placeholder="请选择" clearable filterable @change="change">
    <el-option-group
      v-for="group in options"
      :key="group.label"
      :label="group.label">
      <el-option
        v-for="item in group.items"
        :key="item.id"
        :label="item.name"
        :value="item.id">
      </el-option>
    </el-option-group>
  </el-select>
</template>

<script>
import { getShopGroupCombo } from '@/api/shop'
export default {
  name: 'shopSelect',
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
