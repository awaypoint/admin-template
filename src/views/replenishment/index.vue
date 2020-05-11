<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="filter-item-btn">
        <el-button class="filter-item pan-btn green-btn" type="" icon="el-icon-plus" v-show="checkPermission('addRep')" @click="handleAdd">
          添加
        </el-button>
        <el-button class="filter-item pan-btn light-blue-btn" type="primary" icon="el-icon-search" v-show="checkPermission('getRepList')" @click="handleFilter">
          查询
        </el-button>
      </div>
      <el-input v-model="listQuery.name" placeholder="请输入厂家名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
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
      <el-table-column label="补货单号" width="200px" align="center" prop="item_no">
      </el-table-column>
      <el-table-column label="补货数量" min-width="160px" align="center" prop="expected_num">
      </el-table-column>
      <el-table-column label="紧急程度" min-width="160px" align="center">
        <template slot-scope="scope">
          <span>{{ urgencyMap[scope.row.urgency] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否到货" min-width="160px" align="center" prop="is_reached">
        <template slot-scope="scope">
          <span>{{ reachecMap[scope.row.is_reached] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="补货时间" width="160px" align="center" sortable prop="created_at">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.created_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预计到货时间" width="160px" align="center" sortable prop="created_at">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.expected_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="130" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="查看" placement="bottom-end" v-show="checkPermission('updateRep')">
            <el-button size="mini" icon="el-icon-edit" @click="handleUpdate(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="bottom-end" v-show="checkPermission('delRep')">
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
    <modifyReplenishment ref="modifyRepDialog" :row="repRow" @handleFilter="handleFilter"></modifyReplenishment>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getRepList } from '@/api/replenishment'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { checkPermission } from '@/utils/index'
import modifyReplenishment from './components/modify';

export default {
  name: 'Replenishment',
  components: { Pagination, modifyReplenishment },
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
        name: undefined,
        status: undefined,
        order_by: undefined,
        sort_by: undefined
      },
      repRow: {}
    }
  },
  computed: {
    ...mapGetters([
      'permissions'
    ]),
    urgencyMap() {
      return this.$store.state.const.replenishmentUrgencyMap
    },
    reachecMap() {
      return this.$store.state.const.boolMap
    }
  },
  created() {
    this.getList()
  },
  methods: {
    checkPermission(check) {
      return true
      return checkPermission(this.permissions, check)
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleAdd() {
      this.$refs.modifyRepDialog.showDialog('create')
    },
    handleUpdate(row) {
      this.repRow = row
      this.$refs.modifyRepDialog.showDialog('update')
    },
    sortChange(column) {
      this.listQuery.order_by = column.prop
      this.listQuery.sort_by = column.order === "descending" ? 'DESC' : 'ASC'
      this.handleFilter()
    },
    getList() {
      this.listLoading = true
      getRepList(this.listQuery).then(res => {
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
      this.$confirm('此操作将永久删除该补货单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        del({ 'id': id }).then((res) => {
          this.$message({ message: res.codemsg || '操作成功', type: 'success', showClose: true })
          this.handleFilter()
        })
      }).catch(() => {})
    }
  }
}
</script>
