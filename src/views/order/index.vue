<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="filter-item-btn">
        <el-button class="filter-item pan-btn green-btn" type="primary" icon="el-icon-printer" v-show="checkPermission('printOrder')" @click="handlePrinte">
          打印
        </el-button>
        <el-button class="filter-item pan-btn light-blue-btn" type="primary" icon="el-icon-search" v-show="checkPermission('getOrderList')" @click="handleFilter">
          查询
        </el-button>
      </div>
      <el-input v-model="listQuery.order_id" placeholder="请输入订单号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.shipping_no" placeholder="请输入快递单号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.status" style="width: 160px" class="filter-item" @change="handleFilter" placeholder="状态" clearable>
        <el-option v-for="item in statusOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.type" style="width: 140px" class="filter-item" @change="handleFilter" placeholder="类型" clearable>
        <el-option v-for="item in typeOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-input v-model="listQuery.to_full_name" placeholder="请输入买家" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.is_printed" style="width: 140px" class="filter-item" @change="handleFilter" placeholder="是否打印" clearable>
        <el-option v-for="item in boolOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.is_stock" style="width: 140px" class="filter-item" @change="handleFilter" placeholder="是否出库" clearable>
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
      <el-select v-model="listQuery.is_exception" style="width: 140px" class="filter-item" @change="handleFilter" placeholder="是否异常" clearable>
        <el-option v-for="item in boolOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      ref="orderTableRef"
      :data="list"
      border
      fit
      highlight-current-row
      show-summary
      :summary-method="getSummaries"
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column type="selection" width="50px" align="center"></el-table-column>
      <el-table-column label="订单号" min-width="180px">
        <template slot-scope="scope">
          <el-tag :type="scope.row.type == 2 ? 'info' : 'success'">{{ typeMap[scope.row.type] }}</el-tag>
          <span>{{ scope.row.order_id }}</span>
          <el-tag v-if="scope.row.is_printed === '1'" type='info'>印</el-tag>
          <el-tag v-if="scope.row.is_exception === '1'" type='danger'>异</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="产品数量" min-width="80px" align="center" prop="product_num">
      </el-table-column>
      <el-table-column label="总金额" min-width="120px" align="center" prop="total_amount">
      </el-table-column>
      <el-table-column label="买家" min-width="160px" align="center">
        <template slot-scope="scope">
          <el-tag type="">{{ scope.row.to_full_name }}</el-tag>
          <a class="item-no-cls" @click="clickBuyer(scope.row)">{{ scope.row.buyer_login_id }}</a>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="150px" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ statusMap[scope.row.status] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="下单时间" width="160px" align="center" sortable="custom" prop="order_created_at">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.order_created_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="130" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" icon="el-icon-view" v-show="checkPermission('getOrderDetail')" @click="handleUpdate(scope.row)">查看</el-button>
          <el-button icon="el-icon-brush" size="mini" type="danger" v-show="checkPermission('brushOrder')" @click="handleBrush(scope.row.id)">{{ scope.row.type === '1' ? '刷单' : '取消刷单' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.page_size"
      @pagination="getList"
    />
    <modifyOrderDialog ref="modifyOrderDialog" :row="orderRow" @handleFilter="handleFilter" @handleStock="handleStock"></modifyOrderDialog>
    <modifyStockDialog ref="modifyStockOutDialogRef" :row="stockoutRow" @handleFilter="handleFilter"></modifyStockDialog>
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
        order_by: 'created_at',
        sort_by: 'desc',
        is_printed: undefined,
        is_stock: undefined,
        is_exception: undefined,
        times: undefined
      },
      orderRow: {},
      stockoutRow: {}
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
      return this.$store.state.const.query
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
      const query = this.query
      this.listQuery = Object.assign(this.listQuery, query)
    }
    this.getList()
    this.$store.dispatch('const/clearQuery');
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
    },
    clickBuyer(row) {
      this.listQuery.to_full_name = row.to_full_name
      this.getList()
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
