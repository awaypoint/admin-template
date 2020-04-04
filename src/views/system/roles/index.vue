<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="filter-item-btn">
        <el-button class="filter-item" type="success" icon="el-icon-edit" @click="handleAdd"
        v-show="parsePermission('addRole', permissions)">
          添加角色
        </el-button>
      </div>
      <div :model="listQuery" :inline="true">
        <el-input
          v-model="listQuery.phone"
          placeholder="手机号"
          style="width: 200px;"
          class="filter-item"
          clearable=""
          @keyup.enter.native="handleFilter"
        />
        <el-button v-waves class="filter-item pan-btn light-blue-btn" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      </div>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"

      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column type="expand">
        <template slot-scope="props">

          <el-row>
            <el-col v-for="(permission,idx) of props.row.permissions" :key="idx" :span="11" :offset="1">

              <div style="margin-bottom:10px;">
                <span> {{ permission.name }}：</span>
                <el-tag v-for="val of permission.selected" :key="val" type="success" style="margin:0 5px">
                  {{ permissionOption[val] }}
                </el-tag>
              </div>

            </el-col>

          </el-row>

        </template>
      </el-table-column>

      <el-table-column label="唯一识别码" align="center" width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.code }}</span>
        </template>
      </el-table-column>

      <el-table-column label="角色名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" prop="desc" align="center" />
      <el-table-column label="状态" width="200px" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.state"
            active-color="#13ce66"
            @change="handleModifyState(scope.$index,scope.row)"
          />

        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="success" icon="el-icon-edit" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button
            v-if="scope.row.status!='deleted'"
            icon="el-icon-delete"
            size="mini"
            type="danger"
            :disabled="scope.row.username === 'admin'"
            @click="handleDelete(scope.row,'deleted')"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page_no"
      :limit.sync="listQuery.page_size"
      @pagination="getList"
    />

    <RoleDialog 
      :dialogShow.sync="dialogFormVisible" 
      @closeDialog="dialogFormVisible = false"
    />

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getRole, addRole, updateRole, removeRole, getPermission } from '@/api/system'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import RoleDialog from './dialog';
import parsePermission from '../../../functions'

export default {
  name: 'Role',
  components: { Pagination, RoleDialog },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  computed: {
    ...mapGetters([
      'permissions'
    ])
  },
  data() {
    return {
      permissionOption: this.$store.getters.buttons,
      tableKey: 0,
      list: [],
      permissionList: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page_no: 1,
        page_size: 10
      },
      temp: {
        code: '',
        name: '',
        desc: '',
        state: true,
        permissions: [

        ]
      },
      tempCopy: null,
      dialogFormVisible: false,
      dialogStatus: '',
      rules: {
        code: [
          { required: true, trigger: 'blur', message: '识别码不能为空' }
        ],
        name: [
          { required: true, trigger: 'blur', message: '角色名称不能为空' }]

      }
    }
  },
  created() {
    this.tempCopy = Object.assign({}, this.temp)
    this.getList()
    // this.getPermission()
  },
  methods: {
    parsePermission,
    backShow(val) {
      this.dialogFormVisible = val
    },
    async getPermission() {
      const res = await getPermission({
        page_no: 1,
        page_size: 50
      })
      const result = res.data.items.map(item => {
        return {
          checkedAll: false,
          selected: [],
          indeterminate: false,
          code: item.code,
          name: item.name,
          state: item.state,
          actionsOptions: item.permission
        }
      }).filter(item => item.state)

      this.permissionList = JSON.parse(JSON.stringify(result))
      this.$set(this.temp, 'permissions', result)
    },
    handleAdd() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      console.log(this.dialogFormVisible)
    },
    onChangeCheck(permission) {
      permission.indeterminate = !!permission.selected.length && (permission.selected.length < permission.actionsOptions.length)
      permission.checkedAll = permission.selected.length === permission.actionsOptions.length
    },
    onChangeCheckAll(checked, permission) {
      Object.assign(permission, {
        selected: checked ? permission.actionsOptions : [],
        indeterminate: false,
        checkedAll: checked
      })
    },
    getList() {
      this.listLoading = true
      getRole(this.listQuery).then(res => {
        this.list = res.response
        this.total = 2
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page_no = 1
      this.getList()
    },
    handleModifyState(index, row) {
      updateRole({
        '_id': row._id,
        'state': row.state
      }).then((res) => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
      })
    },
    resetForm(formName) {
      if (this.$refs[formName] === undefined) {
        return false
      }
      this.$refs[formName].resetFields()
      this.temp = Object.assign({}, this.tempCopy)
      this.$set(this.temp, 'permissions', this.permissionList)
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeRole({ '_id': row._id }).then(() => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          const index = this.list.indexOf(row)
          this.list.splice(index, 1)
        })
      })
    }

  }
}
</script>
