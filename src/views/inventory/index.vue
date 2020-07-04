<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="filter-item-btn">
        <el-button class="filter-item pan-btn green-btn" type="" icon="el-icon-plus" v-show="checkPermission('addInventory')" @click="handleAdd">
          添加
        </el-button>
        <el-button class="filter-item pan-btn light-blue-btn" type="primary" icon="el-icon-search" v-show="checkPermission('getInventoryList')" @click="handleFilter">
          查询
        </el-button>
      </div>
      <el-input v-model="listQuery.item_no" placeholder="请输入盘点单号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
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
      :summary-method="getSummaries"
      show-summary
      @sort-change="sortChange"
    >
      <el-table-column label="盘点单号" min-width="200px" align="center" prop="item_no">
        <template slot-scope="scope">
          <a class="item-no-cls" @click="handleView(scope.row)">{{ scope.row.item_no }}</a>
        </template>
      </el-table-column>
      <el-table-column label="盘点数量" min-width="160px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.quantity }}</span>
        </template>
      </el-table-column>
      <el-table-column label="盘点时间" width="160px" align="center" sortable prop="created_at">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.created_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="130" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button icon="el-icon-view" size="mini" type="" v-show="checkPermission('getInventoryDetail')" @click="handleView(scope.row)">查看
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
    <modifyInventory ref="modifyInventoryDialog" :row="inventoryRow" @handleFilter="handleFilter"></modifyInventory>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getInventoryList } from '@/api/inventory'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { checkPermission } from '@/utils/index'
import modifyInventory from './components/modify';

export default {
  name: 'Inventory',
  components: { Pagination, modifyInventory },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: 0,
      quantitySum: 0,
      amountSum: 0.00,
      shippingSum: 0.00,
      listLoading: true,
      btnLoding: false,
      listQuery: {
        page: 1,
        page_size: 10,
        item_no: undefined,
        times: undefined,
        order_by: undefined,
        sort_by: undefined
      },
      inventoryRow: {}
    }
  },
  computed: {
    ...mapGetters([
      'permissions'
    ]),
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
    handleAdd() {
      this.$refs.modifyInventoryDialog.showDialog('create')
    },
    handleView(row) {
      this.inventoryRow = row
      this.$refs.modifyInventoryDialog.showDialog('view')
    },
    sortChange(column) {
      this.listQuery.order_by = column.prop
      this.listQuery.sort_by = column.order === "descending" ? 'DESC' : 'ASC'
      this.handleFilter()
    },
    getList() {
      this.listLoading = true
      getInventoryList(this.listQuery).then(res => {
        this.list = res.response.rows
        this.total = res.response.total
        this.quantitySum = res.response.quantity
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      }).catch(() => {
        this.listLoading = false
      })
    },
    getSummaries() {
      return ['合计', this.quantitySum]
    }
  }
}
</script>
