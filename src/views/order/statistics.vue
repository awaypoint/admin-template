<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="filter-item-btn">
        <el-button class="filter-item pan-btn light-blue-btn" type="primary" icon="el-icon-search" v-show="checkPermission('getOrderList')" @click="handleFilter">
          查询
        </el-button>
      </div>
      <el-select v-model="listQuery.status" style="width: 160px" class="filter-item" @change="handleFilter" placeholder="状态" clearable>
        <el-option v-for="item in statusOptions" :key="item.key" :label="item.label" :value="item.key" />
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
import { getOrderList, brushOrder } from '@/api/order'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { checkPermission } from '@/utils/index'
import modifyOrderDialog from './components/modify';
import modifyStockDialog from '../stockout/components/modify';

export default {
  name: 'Order',
  components: { Pagination, modifyOrderDialog, modifyStockDialog },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: 0,
      sum: {},
      listLoading: true,
      listQuery: {
        page: 1,
        page_size: 10,
        order_id: undefined,
        shipping_no: undefined,
        status: undefined,
        to_full_name: '',
        buyer_login_id: '',
        order_by: undefined,
        sort_by: undefined,
        is_printed: undefined,
        is_stock: undefined,
        times: undefined
      }
    }
  },
  computed: {
    ...mapGetters([
      'permissions'
    ]),
    typeOptions() {
      return this.$store.state.order.orderTypeOptions
    },
    typeMap() {
      return this.$store.state.order.orderTypeMap
    },
    query() {
      return this.$store.state.order.query
    },
    statusOptions() {
      return this.$store.state.order.orderStatusOptions
    },
    statusMap() {
      return this.$store.state.order.orderStatusMap
    },
    boolOptions() {
      return this.$store.state.const.boolOptions
    },
    pickerOptions() {
      return this.$store.state.const.pickerOptions
    }
  },
  created() {
    if (this.query) {
      this.listQuery = Object.assign(this.listQuery, this.query)
      this.$store.dispatch('const/setQuery', {})
    }
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
    handleUpdate(row) {
      this.orderRow = row
      this.$refs.modifyOrderDialog.showDialog('view')
    },
    sortChange(column) {
      this.listQuery.order_by = column.prop
      this.listQuery.sort_by = column.order === "descending" ? 'DESC' : 'ASC'
      this.handleFilter()
    },
    getList() {
      this.listLoading = true
      getOrderList(this.listQuery).then(res => {
        this.list = res.response.rows
        this.total = res.response.total
        this.sum = res.response.sum
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      }).catch(() => {
        this.listLoading = false
      })
    },
    getSummaries(params) {
      return ['', '总计', this.sum.product_num, this.sum.total_amount]
    },
    handlePrinte() {
      const selection = this.$refs.orderTableRef.selection
      const list = selection.map(s => {
        return s.id
      })
      if (list.length <= 0) {
        this.$message({ message: '请先选择需要打印的订单', type: 'warning', showClose: true })
        return
      }
      this.$store.dispatch('order/setSelectOrders', list)
      const routeData = this.$router.resolve({ path: '/printe' });
      window.open(routeData.href, '_blank');
    },
    handleBrush(id) {
      brushOrder({ id: id }).then( res => {
        this.$message({ message: res.codemsg || '操作成功', type: 'success', showClose: true })
        this.handleFilter()
      }).catch(() => {})
    },
    handleStock(orderId) {
      this.stockoutRow.order_id = orderId
      this.stockoutRow.api_type = 'order'
      setTimeout(() => {
        this.$refs.modifyStockOutDialogRef.showDialog('create')
      }, 0.5 * 1000);
    }
  }
}
</script>
<style lang="scss" scoped>
.wangwang-cls {
  vertical-align: middle;
  margin-right: 5px;
}
</style>
