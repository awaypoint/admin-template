<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="filter-item-btn">
        <el-button class="filter-item pan-btn light-blue-btn" type="primary" icon="el-icon-search" v-show="checkPermission('getStockInList')" @click="handleFilter">
          查询
        </el-button>
      </div>
      <el-input v-model="listQuery.item_no" placeholder="请选择产品" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.type" style="width: 140px" class="filter-item" @change="handleFilter" placeholder="是否已结" clearable>
        <el-option v-for="item in boolOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-date-picker class="filter-item"
        v-model="listQuery.times"
        type="datetimerange"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"
        @change="handleFilter"
      >
      </el-date-picker>
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getStockInList, cancelStockIn } from '@/api/stockin'
import { checkPermission } from '@/utils/index'

export default {
  name: 'StockIn',
  data() {
    return {
      list: [],
      listLoading: true,
      listQuery: {
        page: 1,
        page_size: 10,
        item_no: undefined,
        status: undefined,
        type: undefined,
        times: undefined,
        order_by: undefined,
        sort_by: undefined
      }
    }
  },
  computed: {
    ...mapGetters([
      'permissions'
    ]),
    boolOptions() {
      return this.$store.state.const.boolOptions
    },
    pickerOptions() {
      return this.$store.state.const.pickerOptions
    }
  },
  created() {
    this.getList()
  },
  methods: {
    checkPermission(check) {
      return checkPermission(this.permissions, check)
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    getList() {
      this.listLoading = true
      getStockInList(this.listQuery).then(res => {
        this.list = res.response.rows
        this.total = res.response.total
        this.quantitySum = res.response.quantity
        this.amountSum = res.response.amount
        this.shippingSum = res.response.shipping
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      }).catch(() => {
        this.listLoading = false
      })
    }
  }
}
</script>
