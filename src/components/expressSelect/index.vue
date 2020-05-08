<template>
  <el-select v-model="value" clearable filterable placeholder="请选择" @change="change">
    <el-option
      v-for="item in options"
      :key="item.id"
      :label="item.name"
      :value="item.id">
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: 'expressSelect',
  data() {
    return {
      options: [
        {
          id: '1',
          name: '顺丰'
        }, {
          id: '2',
          name: '申通'
        }, {
          id: '3',
          name: '优速'
        }
      ],
      value: ''
    }
  },
  methods: {
    change(value) {
      this.$emit('selectExpress', value)
    },
    setValue(value) {
      this.value = value
    }
  }
}
</script>
