<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="filter-item-btn">
        <el-button class="filter-item pan-btn green-btn" type="" icon="el-icon-plus" v-show="checkPermission('addStockOut')" @click="handleAdd">
          添加
        </el-button>
        <el-button class="filter-item pan-btn light-blue-btn" type="primary" icon="el-icon-search" v-show="checkPermission('getStockOutList')" @click="handleFilter">
          查询
        </el-button>
      </div>
      <el-input v-model="listQuery.item_no" placeholder="请输入出库单号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.to_full_name" placeholder="请输入买家" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.shipping_no" placeholder="请输入快递单号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
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

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="出库单号" width="200px" align="center" prop="item_no">
        <template slot-scope="scope">
          <a class="item-no-cls" @click="handleView(scope.row)">{{ scope.row.item_no }}</a>
        </template>
      </el-table-column>
      <el-table-column label="买家" min-width="150px" align="center" prop="buyer_login_id">
        <template slot-scope="scope">
          <img v-show="scope.row.to_full_name" src="http://amos.alicdn.com/realonline.aw?v=2&uid=etindar&site=cntaobao&s=2&charset=utf-8" class="wangwang-cls">
          <el-tag type="" v-show="scope.row.to_full_name">{{ scope.row.to_full_name }}</el-tag>
          <span>{{ scope.row.buyer_login_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出库数量" width="120px" align="center" prop="quantity">
      </el-table-column>
      <el-table-column label="出库金额" width="150px" align="center" prop="amount">
      </el-table-column>
      <el-table-column label="运费" width="100px" align="center" prop="shipping_fee">
      </el-table-column>
      <el-table-column label="缺货" width="100px" align="center" prop="lack_quantity">
      </el-table-column>
      <el-table-column label="出库时间" width="160px" align="center" sortable="custom" prop="created_at">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.created_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="300px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" icon="el-icon-view" v-show="checkPermission('getStockOutDetail')" @click="handleView(scope.row)">查看</el-button>
          <el-button size="mini" icon="el-icon-s-order" v-show="checkPermission('getOrderList') && scope.row.order_id" @click="handleViewOrder(scope.row)">查看订单</el-button>
          <el-button icon="el-icon-delete" size="mini" type="danger" v-show="checkPermission('cancelStockOut')" @click="handleDelete(scope.row.id)">撤销
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
    <modifyStockOut ref="modifyStockOutDialog" :row="stockoutRow" @handleFilter="handleFilter"></modifyStockOut>
    <modifyOrderDialog ref="modifyOrderDialog" :row="orderRow" @handleFilter="handleFilter"></modifyOrderDialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getStockOutList, cancelStockOut } from '@/api/stockout'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { checkPermission, deepClone } from '@/utils/index'
import modifyStockOut from './components/modify'
import buyerSelect from '@/components/buyerSelect'
import modifyOrderDialog from '@/views/order/components/modify';

export default {
  name: 'StockOut',
  components: { Pagination, modifyStockOut, buyerSelect, modifyOrderDialog },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true,
      btnLoding: false,
      listQuery: {
        page: 1,
        page_size: 10,
        item_no: undefined,
        shipping_no: undefined,
        order_by: undefined,
        sort_by: undefined,
        to_full_name: undefined
      },
      stockoutRow: {},
      styleStr: 'display: inline-block;vertical-align: middle;margin-bottom: 10px;width:150px;',
      orderRow: {}
    }
  },
  computed: {
    ...mapGetters([
      'permissions'
    ]),
    pickerOptions() {
      return this.$store.state.const.pickerOptions
    },
    query() {
      return this.$store.state.const.query
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
    handleAdd() {
      this.$refs.modifyStockOutDialog.showDialog('create')
    },
    handleView(row) {
      this.stockoutRow = row
      this.$refs.modifyStockOutDialog.showDialog('view')
    },
    sortChange(column) {
      this.listQuery.order_by = column.prop
      this.listQuery.sort_by = column.order === "descending" ? 'DESC' : 'ASC'
      this.handleFilter()
    },
    getList() {
      this.listLoading = true
      getStockOutList(this.listQuery).then(res => {
        this.list = res.response.rows
        this.total = res.response.total
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleDelete(id) {
      this.$confirm('此操作将永久删除该出库单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        cancelStockOut({ 'id': id }).then((res) => {
          this.$message({ message: res.codemsg || '操作成功', type: 'success', showClose: true })
          this.handleFilter()
        }).catch(() => {})
      }).catch(() => {})
    },
    selectBuyer(value) {
      this.listQuery.buyer_member_id = value
      this.handleFilter()
    },
    handleViewOrder(row) {
      this.orderRow = deepClone(row)
      this.orderRow.id = this.orderRow.order_id
      this.orderRow.api_type = 'stockoutview'
      this.$refs.modifyOrderDialog.showDialog('view')
    }
  }
}
</script>
