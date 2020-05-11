<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="filter-item-btn">
        <el-button class="filter-item pan-btn green-btn" type="" icon="el-icon-plus" v-show="checkPermission('addStockIn')" @click="handleAdd">
          添加
        </el-button>
        <el-button class="filter-item pan-btn light-blue-btn" type="primary" icon="el-icon-search" v-show="checkPermission('getStockInList')" @click="handleFilter">
          查询
        </el-button>
      </div>
      <el-input v-model="listQuery.item_no" placeholder="请输入入库单号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.status" style="width: 140px" class="filter-item" @change="handleFilter" placeholder="状态" clearable>
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
      <el-table-column label="入库单号" min-width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.item_no }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入库数量" min-width="160px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.quantity }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入库金额" min-width="160px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.amount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="运费" min-width="160px" align="center" sortable prop="shipping">
        <template slot-scope="scope">
          <span>{{ scope.row.shipping }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="160px" align="center">
        <template slot-scope="scope">
          <span>{{ statusMap[scope.row.status] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入库时间" width="160px" align="center" sortable prop="created_at">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.created_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="130" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="查看" placement="bottom-end" v-show="checkPermission('updateStockIn')">
            <el-button size="mini" icon="el-icon-edit" @click="handleUpdate(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="bottom-end" v-show="checkPermission('delStockIn')">
            <el-button icon="el-icon-delete" size="mini" type="danger" @click="handleDelete(scope.row.id)">
            </el-button>
          </el-tooltip>
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
    <modifyStockIn ref="modifyStockInDialog" :row="stockinRow" @handleFilter="handleFilter"></modifyStockIn>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getStockInList, delStockIn } from '@/api/stockin'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { checkPermission } from '@/utils/index'
import modifyStockIn from './components/modify';

export default {
  name: 'StockIn',
  components: { Pagination, modifyStockIn },
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
        status: undefined,
        times: undefined,
        order_by: undefined,
        sort_by: undefined
      },
      stockinRow: {}
    }
  },
  computed: {
    ...mapGetters([
      'permissions'
    ]),
    statusOptions() {
      return this.$store.state.const.stockInStatusOptions
    },
    statusMap() {
      return this.$store.state.const.stockInStatusMap
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
    handleAdd() {
      this.$refs.modifyStockInDialog.showDialog('create')
    },
    handleUpdate(row) {
      this.stockinRow = row
      this.$refs.modifyStockInDialog.showDialog('update')
    },
    sortChange(column) {
      this.listQuery.order_by = column.prop
      this.listQuery.sort_by = column.order === "descending" ? 'DESC' : 'ASC'
      this.handleFilter()
    },
    getList() {
      this.listLoading = true
      getStockInList(this.listQuery).then(res => {
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
      this.$confirm('此操作将永久删除该厂家, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        del({ 'id': id }).then((res) => {
          this.$message({
            message: res.codemsg || '操作成功',
            type: 'success',
            showClose: true
          })
          this.handleFilter()
        })
      }).catch(() => {})
    }
  }
}
</script>
