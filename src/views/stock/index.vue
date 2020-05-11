<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="filter-item-btn">
        <el-button class="filter-item pan-btn light-blue-btn" type="primary" icon="el-icon-search" v-show="checkPermission('getStockList')" @click="handleFilter">
          查询
        </el-button>
      </div>
      <el-input v-model="listQuery.name" placeholder="请输入厂家名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
    </div>

    <el-table
      row-key="id"
      v-loading="listLoading"
      :data="list"
      fit
      style="width: 100%;"
      default-expand-all
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      :row-class-name="tableRowClassName"
      @sort-change="sortChange"
    >
      <el-table-column label="产品名称" min-width="200px" align="center" prop="subject">
      </el-table-column>
      <el-table-column label="货号" min-width="160px" align="center" prop="cargo_number">
      </el-table-column>
      <el-table-column label="价格" width="150px" align="center" prop="price">
      </el-table-column>
      <el-table-column label="库存" width="150px" align="center" prop="quantity">
      </el-table-column>
      <!-- <el-table-column label="创建时间" width="160px" align="center" sortable prop="created_at">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.created_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="操作" align="center" min-width="130" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="bottom-end" v-show="checkPermission('updateStock')">
            <el-button size="mini" icon="el-icon-edit" @click="handleUpdate(scope.row)"></el-button>
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getStockList } from '@/api/stock'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { checkPermission } from '@/utils/index'

export default {
  name: 'Stock',
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        page_size: 10,
        name: undefined,
        status: undefined,
        order_by: undefined,
        sort_by: undefined
      }
    }
  },
  computed: {
    ...mapGetters([
      'permissions'
    ])
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
      this.dialogStatus = 'update'
      for(let field in this.temp) {
        this.temp[field] = row[field]
      }
      this.dialogFormVisible = true
    },
    sortChange(column) {
      this.listQuery.order_by = column.prop
      this.listQuery.sort_by = column.order === "descending" ? 'DESC' : 'ASC'
      this.handleFilter()
    },
    handleModifyState(row) {
      const upData = {
        'id': row.id,
        'status': row.status
      }
      this.modifyFactory(upData, false)
    },
    getList() {
      this.listLoading = true
      getStockList(this.listQuery).then(res => {
        this.list = res.response.rows
        this.total = res.response.total
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      }).catch(() => {
        this.listLoading = false
      })
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.level === 1) {
        return 'warning-row';
      } else if (row.level === 2) {
        return 'success-row';
      }
      return '';
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
