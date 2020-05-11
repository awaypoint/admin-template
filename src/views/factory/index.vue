<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="filter-item-btn">
        <el-button class="filter-item pan-btn green-btn" type="" icon="el-icon-plus" v-show="checkPermission('addFactory')" @click="handleAdd">
          添加
        </el-button>
        <el-button class="filter-item pan-btn light-blue-btn" type="primary" icon="el-icon-search" v-show="checkPermission('getFactoryList')" @click="handleFilter">
          查询
        </el-button>
      </div>
      <el-input v-model="listQuery.name" placeholder="请输入厂家名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.status" style="width: 140px" class="filter-item" @change="handleFilter" placeholder="状态" clearable>
        <el-option v-for="item in statusOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
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
      <el-table-column label="厂家名称" min-width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" min-width="160px" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.desc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="150px" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-color="#13ce66"
            active-value="1" inactive-value="2"
            @change="handleModifyState(scope.row)"
          />

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
          <el-tooltip class="item" effect="dark" content="编辑" placement="bottom-end" v-show="checkPermission('updateFactory')">
            <el-button size="mini" icon="el-icon-edit" @click="handleUpdate(scope.row)"></el-button>
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
    <modifyFactory ref="modifyFactoryDialog" :row="factoryRow" @handleFilter="handleFilter"></modifyFactory>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getFactoryList, updateFactory, delFactory } from '@/api/factory'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { checkPermission } from '@/utils/index'
import modifyFactory from './components/modify';

export default {
  name: 'Factory',
  components: { Pagination, modifyFactory },
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
        status: undefined,
        order_by: undefined,
        sort_by: undefined
      },
      factoryRow: {}
    }
  },
  computed: {
    ...mapGetters([
      'permissions'
    ]),
    statusOptions() {
      return this.$store.state.const.statusOptions
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
      this.$refs.modifyFactoryDialog.showDialog('create')
    },
    handleUpdate(row) {
      this.factoryRow = row
      this.$refs.modifyFactoryDialog.showDialog('update')
    },
    sortChange(column) {
      this.listQuery.order_by = column.prop
      this.listQuery.sort_by = column.order === "descending" ? 'DESC' : 'ASC'
      this.handleFilter()
    },
    handleModifyState(row) {
      updateFactory({ 'id': row.id, 'status': row.status }).then((res) => {
        this.$message({
          message: res.codemsg || '操作成功',
          type: 'success',
          showClose: true
        })
        this.handleFilter()
      }).catch(() => {
        this.handleFilter()
      })
    },
    getList() {
      this.listLoading = true
      getFactoryList(this.listQuery).then(res => {
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
        delFactory({ 'id': id }).then((res) => {
          this.$message({
            message: res.codemsg || '操作成功',
            type: 'success',
            showClose: true
          })
          this.handleFilter()
        }).catch(() => {})
      }).catch(() => {})
    }
  }
}
</script>
