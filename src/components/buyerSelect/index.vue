<template>
  <el-select v-model="value" placeholder="请选择买家" clearable filterable :disabled="disabled" @change="change" :style="styleStr">
    <el-option
      v-for="item in options"
      :key="item.buyer_member_id"
      :label="item.buyer_login_id"
      :value="item.buyer_member_id">
    </el-option>
  </el-select>
</template>

<script>
import { getBuyerCombo } from '@/api/buyer'
export default {
  name: 'buyerSelect',
  props: {
    type: {
      type: Number,
      default: 0
    },
    disabled: {
      type: Boolean,
      default: false
    },
    styleStr: {
      type: String,
      default: ''
    }
  },
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
      getBuyerCombo({ type: this.type }).then(res => {
        this.options = res.response
      }).catch(() => {})
    },
    change(value) {
      this.$emit('selectBuyer', value)
    },
    setValue(value) {
      if (value == 0) {
        value = ''
      }
      this.value = value
    }
  }
}
</script>
