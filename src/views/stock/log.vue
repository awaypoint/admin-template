<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="filter-item-btn">
        <el-button class="filter-item pan-btn light-blue-btn" type="primary" icon="el-icon-search" v-show="checkPermission('getStockList')" @click="handleFilter">
          查询
        </el-button>
      </div>
      <el-input v-model="listQuery.subject" placeholder="请输入产品名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.cargo_number" placeholder="请输入产品货号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.relation_item_no" placeholder="请输入订单号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.type" style="width: 140px" class="filter-item" @change="handleFilter" placeholder="类型" clearable>
        <el-option v-for="item in logTypeOptions" :key="item.key" :label="item.label" :value="item.key" />
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

    <el-table
      row-key="id"
      ref="listTable"
      v-loading="listLoading"
      :data="list"
      fit
      style="width: 100%;"
      show-summary
      :summary-method="getSummaries"
      @sort-change="sortChange"
    >
      <el-table-column label="产品名称" min-width="150px" align="left" prop="subject" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <productPopover :data="scope.row" :reference="scope.row.subject" @click="handleUpdate"></productPopover>
        </template>
      </el-table-column>
      <el-table-column label="货号" min-width="100px" align="center" prop="cargo_number">
      </el-table-column>
      <el-table-column label="出/入库价格" width="100px" align="center" prop="price">
      </el-table-column>
      <el-table-column label="尺码" width="80px" align="center" prop="size">
      </el-table-column>
      <el-table-column label="数量" width="80px" align="center" prop="quantity">
      </el-table-column>
      <el-table-column label="时间" width="160px" align="center" sortable="custom" prop="created_at">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.created_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="来源" min-width="120px" align="center" prop="relation_item_no">
        <template slot-scope="scope">
          <el-tag type="warning">{{ logTypeMap[scope.row.type] }}</el-tag>
          {{ scope.row.relation_item_no }}
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getStockLogList } from '@/api/stock'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { checkPermission } from '@/utils/index'
import productPopover from '@/components/productPopover'

export default {
  name: 'Stock',
  components: { Pagination, productPopover },
  data() {
    return {
      tableKey: 0,
      expands: [],
      list: [],
      total: 0,
      quantity_out: 0,
      quantity_in: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        page_size: 10,
        subject: undefined,
        cargo_number: undefined,
        relation_item_no: undefined,
        type: undefined,
        times: undefined,
        order_by: undefined,
        sort_by: undefined
      },
      productRow: {}
    }
  },
  computed: {
    ...mapGetters([
      'permissions'
    ]),
    logTypeOptions() {
      return this.$store.state.const.logTypeOptions
    },
    logTypeMap() {
      return this.$store.state.const.logTypeMap
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
    handleUpdate(row) {
      this.productRow.id = row.p_id
      this.$refs.modifyProductDialog.showDialog('update')
    },
    sortChange(column) {
      this.listQuery.order_by = column.prop
      this.listQuery.sort_by = column.order === "descending" ? 'DESC' : 'ASC'
      this.handleFilter()
    },
    getList() {
      this.listLoading = true
      getStockLogList(this.listQuery).then(res => {
        this.list = res.response.rows
        this.total = res.response.total
        this.quantity_in = res.response.quantity_in
        this.quantity_out = res.response.quantity_out
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      }).catch(() => {
        this.listLoading = false
      })
    },
    getSummaries() {
      return ['合计', '入库数量:' + this.quantity_in, '出库数量:' + this.quantity_out]
    }
  }
}
</script>
<style lang='scss' scoped>
/deep/.el-table .warning-row {
  background: oldlace;
}

/deep/.el-table .success-row {
  background: #f0f9eb;
}
</style>
