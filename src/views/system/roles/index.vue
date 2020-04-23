<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="filter-item-btn">
        <el-button class="filter-item pan-btn green-btn" type="" icon="el-icon-plus" @click="handleAdd" v-show="checkPermission('addRole')">
          添加
        </el-button>
        <el-button class="filter-item pan-btn light-blue-btn" type="primary" icon="el-icon-search" @click="handleFilter" v-show="checkPermission('getRolesList')">
          查询
        </el-button>
      </div>
      <el-input v-model="listQuery.name" placeholder="请输入角色名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.status" style="width: 140px" class="filter-item" @change="handleFilter" placeholder="状态" clearable>
        <el-option v-for="item in statusOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"

      fit
      highlight-current-row
      style="width: 100%;"
      @row-click="handleClick"
      ref="listTable"
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
            @change="handleModifyState(scope.$index,scope.row)"
            active-value="1" inactive-value="2"
          />
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" min-width="130" class-name="small-padding fixed-width" prop="operate">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="bottom-end" v-show="checkPermission('updateRole')">
            <el-button size="mini"  icon="el-icon-edit" @click="handleUpdate(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="bottom-end" v-show="checkPermission('delRole')">
            <el-button icon="el-icon-delete" size="mini" type="danger" @click="handleDelete(scope.row.id)">
            </el-button>
          </el-tooltip>
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

    <el-dialog 
      :close-on-click-modal="false" 
      :title="textMap[dialogStatus]" 
      :visible="dialogFormVisible" 
      @close="dialogFormVisible = false"
      width="650px" 
    >
      <el-form
        ref="dialogForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="110px"
        class="dialog-form-cls"
      >
        <el-form-item label="角色名称：" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>

        <el-form-item label="状态：" prop="state">
          <el-switch v-model="temp.status" active-color="#13ce66" active-value="1" inactive-value="2"/>
        </el-form-item>
        <el-form-item label="描述：" prop="desc">
          <el-input v-model="temp.desc" type="textarea" />
        </el-form-item>
        <hr class="el-divider">
        <el-form-item label="拥有权限：" prop="permission">

          <el-form-item v-for="(permission,idx) of permissionList" :key="idx" label-width="0px">
            <el-checkbox
              v-model="permission.checkedAll"
              :indeterminate="permission.indeterminate"
              @change="onChangeCheckAll($event, permission)"
              style="margin-right: 30px;"
            >{{ permission.name }}</el-checkbox>
            <div class="permission-items">
              <el-checkbox-group v-model="permission.selected" style="display: inline-block">
                <el-checkbox
                  v-for="per of permission.actionsOptions"
                  :key="per.id"
                  :label="per.id"
                  name="type"
                  @change="onChangeCheck(permission)"
                >
                  {{ per.name }}
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </el-form-item>

        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false">取消</el-button>
        <el-button 
          type="primary" 
          size="small" 
          @click="dialogStatus==='create'?submit():updateData()"
          :loading="btnLoding"
        >确认</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { checkPermission } from '@/utils/index'
import { getRoles, addRole, updateRole, removeRole, getAllMenus, getRolePermission } from '@/api/system'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'Role',
  components: { Pagination },
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
      btnLoding: false,
      list: [],
      permissionList: [],
      permissionSelected: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page_no: 1,
        page_size: 10,
        name: '',
        status: ''
      },
      temp: {
        id: '',
        name: '',
        desc: '',
        status: "1",
        permissions: []
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
      },
      textMap: {
        update: '编辑角色',
        create: '添加角色'
      },
      statusOptions: [
        {key:1,label:'启用'},
        {key:2,label:'禁用'}
      ]
    }
  },
  created() {
    this.tempCopy = Object.assign({}, this.temp)
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
        getRolePermission({'id': row.id}).then(res => {
          row.permissions = res.response
          this.setRowPermissions(res.response, row)
          setTimeout(() => {
            row.expandLoading = false
          }, 500);
        }).catch(() => {})
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

      this.permissionList = result
    },
    handleAdd() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.resetForm('dialogForm')
    },
    onChangeCheck(permission) {
      permission.indeterminate = !!permission.selected.length && (permission.selected.length < permission.actionsOptions.length)
      permission.checkedAll = permission.selected.length === permission.actionsOptions.length
    },
    onChangeCheckAll(checked, permission) {
      const allPerIds = []
      permission.actionsOptions.forEach(value => {
        allPerIds.push(value.id)
      });
      Object.assign(permission, {
        selected: checked ? allPerIds : [],
        indeterminate: false,
        checkedAll: checked
      })
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
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page_no = 1
      this.getList()
    },
    handleModifyState(index, row) {
      const upData = {
        'id': row.id,
        'status': row.status
      }
      this.modifyRole(upData, false)
    },
    resetForm(formName) {
      this.btnLoding = false
      if (this.$refs[formName] === undefined) {
        return false
      }
      this.permissionList.forEach((items, key) => {
        this.permissionList[key].selected = []
        this.permissionList[key].checkedAll = false
        this.permissionList[key].indeterminate = false
      })
      this.$refs[formName].resetFields()
      this.temp = Object.assign({}, this.tempCopy)
    },
    handleDelete(id) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeRole({ 'id': id }).then((res) => {
          this.$message({
            message: res.codemsg || '操作成功',
            type: 'success',
            showClose: true
          })
          this.handleFilter()
        }).catch(() => {})
      })
    },
    handleUpdate(row) {
      this.dialogStatus = 'update'
      for(let field in this.temp) {
        this.temp[field] = row[field]
      }
      if (row.permissions.length === 0) {
        getRolePermission({'id': row.id}).then(res => {
          this.permissions2Menus(res.response)
        }).catch(() => {})
      } else {
        this.permissions2Menus(row.permissions)
      }
      this.dialogFormVisible = true
    },
    submit() {
      this.$refs['dialogForm'].validate((valid) => {
        if (valid) {
          this.btnLoding = true
          this.createPermissions()
          addRole(this.temp).then((res) => {
            this.$message({
              message: res.codemsg || '操作成功',
              type: 'success',
              showClose: true
            })
            setTimeout(() => {
              this.dialogFormVisible = false
              this.btnLoding = false
              this.handleFilter()
            }, 0.5 * 1000)
          }).catch(() => {
            setTimeout(() => {
              this.btnLoding = false
            }, 0.5 * 1000)
          })
        }
      })
    },
    updateData() {
      this.$refs['dialogForm'].validate((valid) => {
        if (valid) {
          this.btnLoding = true
          this.createPermissions()
          updateRole(this.temp).then((res) => {
            this.$message({
              message: res.codemsg || '操作成功',
              type: 'success',
              showClose: true
            })
            setTimeout(() => {
              this.dialogFormVisible = false
              this.btnLoding = false
              this.handleFilter()
            }, 0.5 * 1000)
          }).catch(() => {
            setTimeout(() => {
              this.btnLoding = false
            }, 0.5 * 1000)
          })
        }
      })
    },
    createPermissions() {
      this.temp.permissions = []
      this.permissionList.forEach(items => {
        let currentSelected = items.selected
        if (items.checkedAll || items.indeterminate) {
          currentSelected.unshift(items.id)
        }
        this.temp.permissions = this.temp.permissions.concat(currentSelected)
      })
    },
    permissions2Menus(rolePermissions) {
      this.permissionList.forEach((items, key) => {
        this.permissionList[key].selected = []
        this.permissionList[key].checkedAll = false
        this.permissionList[key].indeterminate = false
        if (rolePermissions.indexOf(items.id) > -1) {
          this.permissionList[key].indeterminate = true
          let currentSelected = []
          for(let i in items.actionsOptions) {
            if(rolePermissions.indexOf(items.actionsOptions[i].id) > -1) {
              currentSelected.push(items.actionsOptions[i].id)
            }
          }
          this.permissionList[key].selected = currentSelected
          if(currentSelected.length === items.actionsOptions.length) {
            this.permissionList[key].checkedAll = true
            this.permissionList[key].indeterminate = false
          }
        }
      })
    },
    setRowPermissions(rolePermissions, row) {
      if (rolePermissions.length > 0) {
        this.permissionList.forEach((items, key) => {
          if (rolePermissions.indexOf(items.id) > -1) {
            let tmp = {
              id: items.id,
              name: items.name,
              childs: []
            }
            for(let i in items.actionsOptions) {
              if(rolePermissions.indexOf(items.actionsOptions[i].id) > -1) {
                let childTmp = {
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
    modifyRole(data) {
      updateRole(data).then(res => {
        this.handleFilter()
      }).catch(()=>{
        this.handleFilter()
      })
    }
  }
}
</script>
<style scoped>
.permission-items {
  margin-left: 20px;
}
</style>
