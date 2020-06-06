<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="filter-item-btn">
        <el-button class="filter-item pan-btn green-btn" type="" v-show="checkPermission('addRole')" icon="el-icon-plus" @click="handleAdd">
          添加
        </el-button>
        <el-button class="filter-item pan-btn light-blue-btn" type="primary" v-show="checkPermission('getRolesList')" icon="el-icon-search" @click="handleFilter()">
          查询
        </el-button>
      </div>
      <el-input v-model="listQuery.name" placeholder="请输入角色名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.status" style="width: 140px" class="filter-item" placeholder="状态" clearable @change="handleFilter">
        <el-option v-for="item in statusOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      fit
      highlight-current-row
      ref="listTable"
      style="width: 100%;"
      @row-click="handleClick"
      @expand-change="expandChange"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-row v-loading="props.row.expandLoading">
            <el-col v-for="(permission,idx) of props.row.permissionsList" :key="idx" :span="11" :offset="1">
              <div style="margin-bottom:10px;">
                <span> {{ permission.name }}：</span>
                <el-tag v-for="val of permission.childs" :key="val.id" type="success" style="margin:0 5px">
                  {{ val.name }}
                </el-tag>
              </div>
            </el-col>
          </el-row>
        </template>
      </el-table-column>

      <el-table-column label="角色名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" prop="desc" align="center" min-width="300px">
        <template slot-scope="scope">
          <span>{{ scope.row.desc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="200px" align="center" prop="status">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-color="#13ce66"
            active-value="1"
            inactive-value="2"
            @change="handleModifyState(scope.$index,scope.row)"
          />
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" min-width="130" class-name="small-padding fixed-width" prop="operate">
        <template slot-scope="scope">
          <el-button size="mini" icon="el-icon-edit" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button icon="el-icon-delete" size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
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
    <modifyRoleDialog ref="modifyRoleDialog" :row="roleRow" @handleFilter="handleFilter"></modifyRoleDialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { checkPermission } from '@/utils/index'
import { getRoles, getAllMenus, removeRole, getRolePermission, updateRole } from '@/api/system'
import Pagination from '@/components/Pagination'
import modifyRoleDialog from './components/modify';

export default {
  name: 'Role',
  components: { Pagination, modifyRoleDialog },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        page_size: 10,
        name: '',
        status: ''
      },
      roleRow: {}
    }
  },
  computed: {
    ...mapGetters([
      'permissions'
    ]),
    statusOptions() {
      return this.$store.state.role.statusOptions
    },
    permissionList() {
      return this.$store.state.role.permissionList
    }
  },
  created() {
    this.getList()
    this.getAllMenus()
  },
  methods: {
    checkPermission(check) {
      return checkPermission(this.permissions, check)
    },
    handleClick(row, index, e) {
      if (index.property !== 'status' && index.property !== 'operate') {
        this.$refs.listTable.toggleRowExpansion(row)
      }
    },
    expandChange(row, expandedRows) {
      row.expandLoading = true
      if (expandedRows.indexOf(row) > -1) {
        getRolePermission({ 'id': row.id }).then(res => {
          row.permissions = res.response
          this.setRowPermissions(res.response, row)
          setTimeout(() => {
            row.expandLoading = false
          }, 500)
        }).catch(() => {})
      }
    },
    handleAdd() {
      this.$refs.modifyRoleDialog.showDialog('create')
    },
    getList() {
      this.listLoading = true
      getRoles(this.listQuery).then(res => {
        this.list = res.response.rows
        this.total = 2
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyState(index, row) {
      updateRole({ 'id': row.id, 'status': row.status }).then((res) => {
        this.$message({ message: res.codemsg || '操作成功', type: 'success', showClose: true })
        this.handleFilter()
      }).catch(() => {
        this.handleFilter()
      })
    },
    handleDelete(id) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeRole({ 'id': id }).then((res) => {
          this.$message({ message: res.codemsg || '操作成功', type: 'success', showClose: true })
          this.handleFilter()
        }).catch(() => {})
      })
    },
    handleUpdate(row) {
      this.roleRow = row
      this.$refs.modifyRoleDialog.showDialog('update')
    },
    setRowPermissions(rolePermissions, row) {
      row.permissionsList = []
      if (rolePermissions.length > 0) {
        this.permissionList.forEach((items, key) => {
          if (rolePermissions.indexOf(items.id) > -1) {
            const tmp = {
              id: items.id,
              name: items.name,
              childs: []
            }
            for (const i in items.actionsOptions) {
              if (rolePermissions.indexOf(items.actionsOptions[i].id) > -1) {
                const childTmp = {
                  id: items.actionsOptions[i].id,
                  name: items.actionsOptions[i].name
                }
                tmp.childs.push(childTmp)
              }
            }
            row.permissionsList.push(tmp)
          }
        })
      }
    },
    async getAllMenus() {
      const res = await getAllMenus()
      const result = res.response.map(item => {
        return {
          id: item.id,
          checkedAll: false,
          selected: [],
          indeterminate: false,
          name: item.name,
          actionsOptions: item.childs
        }
      })
      this.$store.dispatch('role/setAllMenus', result)
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/.el-table th {
  padding: 11px 0;
}
</style>
