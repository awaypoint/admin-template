<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="filter-item-btn">
        <el-button class="filter-item pan-btn green-btn" type="" icon="el-icon-plus" v-show="checkPermission('addProduct')" @click="handleModify('create')">
          添加
        </el-button>
        <el-button class="filter-item pan-btn light-blue-btn" type="primary" icon="el-icon-search" v-show="checkPermission('getProductList')" @click="handleFilter">
          查询
        </el-button>
      </div>
      <el-input v-model="listQuery.subject" placeholder="请输入产品名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.product_cargo_number" placeholder="请输入货号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
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
      show-summary
      :summary-method="getSummaries"
      @sort-change="sortChange"
    >
      <el-table-column label="产品名称" min-width="250px" align="left">
        <template slot-scope="scope">
          <productPopover :data="scope.row" :reference="scope.row.subject"></productPopover>
        </template>
      </el-table-column>
      <el-table-column label="货号" min-width="160px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.product_cargo_number }}</span>
        </template>
      </el-table-column>
      <el-table-column label="销售价" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.consign_price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="平台价" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.consign_price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上架时间" width="160px" align="center" sortable prop="created_at">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.product_created_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="130" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="查看" placement="bottom-end" v-show="checkPermission('updateFactory')">
            <el-button size="mini" icon="el-icon-view" @click="handleView(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="编辑" placement="bottom-end" v-show="checkPermission('updateFactory')">
            <el-button size="mini" icon="el-icon-edit" @click="handleModify(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="bottom-end" v-show="checkPermission('delFactroy')">
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
    <viewProductDialog ref="viewProductDialog" :row="productRow"></viewProductDialog>
    <modifyProductDialog ref="modifyProductDialog"></modifyProductDialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getProductList, delProduct } from '@/api/product'
import Pagination from '@/components/Pagination'
import { checkPermission } from '@/utils/index'
import modifyProductDialog from './components/modify';
import viewProductDialog from './components/view';
import productPopover from '@/components/productPopover';

export default {
  name: 'Product',
  components: { Pagination, modifyProductDialog, viewProductDialog, productPopover },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        page_size: 10,
        subject: undefined,
        product_cargo_number: undefined,
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
    pickerOptions() {
      return this.$store.state.app.pickerOptions
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
    handleModify(status) {
      this.$refs.modifyProductDialog.showDialog(status)
    },
    handleView(row) {
      this.productRow = row
      this.$refs.viewProductDialog.showDialog('view')
    },
    sortChange(column) {
      this.listQuery.order_by = column.prop
      this.listQuery.sort_by = column.order === "descending" ? 'DESC' : 'ASC'
      this.handleFilter()
    },
    getList() {
      this.listLoading = true
      getProductList(this.listQuery).then(res => {
        this.list = res.response.rows
        this.total = res.response.total
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      }).catch(() => {
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
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
    },
    getSummaries(params) {
      const { columns, data } = params
      const sums = [ '总计', 333, 222 ]
      return sums
    }
  }
}
</script>
