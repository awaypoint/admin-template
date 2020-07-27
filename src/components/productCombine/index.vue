<template>
  <div class="product-combine">
    <el-row :gutter="10">
      <el-col :span="16">
        <el-autocomplete
          v-model="query.search"
          :fetch-suggestions="querySearchAsync"
          placeholder="请输入产品名称\货号"
          clearable
          @select="handleSelect"
        ></el-autocomplete>
      </el-col>
      <el-col :span="8">
      <el-select v-model="emitQuery.cargo_number" placeholder="请选择货号" clearable filterable :style="styleStr" @change="change">
        <el-option
          v-for="item in options"
          :key="item.cargo_number"
          :label="item.cargo_number"
          :value="item.cargo_number">
        </el-option>
      </el-select>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getProductCombo, getProductSkuCombo } from '@/api/product'
export default {
  name: 'productCombine',
  data() {
    return {
      products: [],
      options: [],
      styleStr: '',
      query: {
        search: ''
      },
      emitQuery: {
        product_id: '',
        cargo_number: ''
      },
      timeout: null
    }
  },
  methods: {
    handleSelect(item) {
      this.emitQuery.product_id = item.product_id
      this.query.search = item.subject
      this.getProductSku()
      this.$emit('select', this.emitQuery)
    },
    async getProducts() {
      const res = await getProductCombo(this.query)
      this.products = res.response
    },
    change() {
      this.$emit('select', this.emitQuery)
    },
    async querySearchAsync(queryString, cb) {
      if (!queryString) {
        this.emitQuery.product_id = ''
        this.emitQuery.cargo_number = '';
        this.options = []
        this.$emit('select', this.emitQuery)
      }
      await this.getProducts()
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(this.products);
      }, 500);
    },
    getProductSku() {
      getProductSkuCombo(this.emitQuery).then(res => {
        this.options = res.response
      }).catch(() => {}) 
    },
    setValue(obj) {
      this.query.search = obj.subject
      this.emitQuery.product_id = obj.product_id
      this.emitQuery.cargo_number = obj.cargo_number
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/.el-autocomplete {
  width: 100%;
}
.product-combine {
  display: inline-block;
  vertical-align: middle;
  margin-bottom: 10px;
  width: 500px;
}
</style>
