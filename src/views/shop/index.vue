<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="filter-item-btn">
        <el-button class="filter-item pan-btn green-btn" type="" icon="el-icon-plus" @click="handleAdd" v-show="checkPermission('addShop')">
          添加
        </el-button>
        <el-button class="filter-item pan-btn light-blue-btn" type="primary" icon="el-icon-search" @click="handleFilter" v-show="checkPermission('getShopList')">
          查询
        </el-button>
      </div>
      <el-input v-model="listQuery.name" placeholder="请输入店铺名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
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
      <el-table-column label="店铺名称" min-width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品数量" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.product_num }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单数量" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.order_num }}</span>
        </template>
      </el-table-column>
      <el-table-column label="授权到期时间" width="160px" align="center" sortable prop="refresh_toke_expire_at">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.refresh_toke_expire_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="160px" align="center" sortable prop="created_at">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.created_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="130" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini"  icon="el-icon-edit" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button icon="el-icon-delete" size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
          <el-button icon="el-icon-connection" size="mini" type="primary" @click="gotoAuth(scope.row.auth_url)">授权</el-button>
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
    <modifyShopDialog ref="modifyShopDialog" :row="shopRow" @handleFilter="handleFilter"></modifyShopDialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getShopList, delShop } from '@/api/shop'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { checkPermission } from '@/utils/index'
import modifyShopDialog from './components/modify';

export default {
  name: 'Shop',
  components: { Pagination, modifyShopDialog },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        page_size: 10,
        name: undefined,
        type: undefined,
        order_by: undefined,
        sort_by: undefined
      },
      shopRow: {}
    }
  },
  computed: {
    ...mapGetters([
      'permissions',
    ])
  },
  created() {
    this.getList()
  },
  methods: {
    checkPermission(check) {
      return checkPermission(this.permissions, check)
    },
    checkAuth(row) {
      if (!this.checkPermission('authShop')) {
        return false
      }
      if (!row.auth_url) {
        return false
      }
      return true
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleAdd() {
      this.$refs.modifyShopDialog.showDialog('create')
    },
    handleUpdate(row) {
      this.shopRow = row
      this.$refs.modifyShopDialog.showDialog('update')
    },
    sortChange(column) {
      this.listQuery.order_by = column.prop
      this.listQuery.sort_by = column.order === "descending" ? 'DESC' : 'ASC'
      this.handleFilter()
    },
    getList() {
      this.listLoading = true
      getShopList(this.listQuery).then(res => {
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
      this.$confirm('此操作将永久删除该店铺, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delShop({ 'id': id }).then((res) => {
          this.$message({
            message: res.codemsg || '操作成功',
            type: 'success',
            showClose: true
          })
          this.handleFilter()
        })
      }).catch(() => {})
    },
    gotoAuth(url) {
      window.open(url, '_blank')
    }
  }
}
</script>
