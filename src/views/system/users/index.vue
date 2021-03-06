<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="filter-item-btn">
        <el-button class="filter-item pan-btn green-btn" type="" icon="el-icon-plus" @click="handleAdd" v-show="checkPermission('addUser')">
          添加
        </el-button>
        <el-button class="filter-item pan-btn light-blue-btn" type="primary" icon="el-icon-search" @click="handleFilter" v-show="checkPermission('getUsersList')">
          查询
        </el-button>
      </div>
      <el-input v-model="listQuery.username" placeholder="请输入用户名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.mobile" placeholder="请输入手机号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.role_id" placeholder="角色" clearable class="filter-item" style="width: 150px" @change="handleFilter" filterable>
        <el-option v-for="item in rolesList" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
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
    >
      <el-table-column label="用户名" min-width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="昵称" width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.mobile }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" width="150px" align="center">
        <template slot-scope="scope">
          <el-tag style="margin:0 5px;" v-show="scope.row.role_id > 0"> {{ rolesMap[scope.row.role_id] }} </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="150px" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-color="#13ce66"
            @change="handleModifyState(scope.row)"
            active-value="1" inactive-value="2"
          />

        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="160px" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.created_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="130" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="bottom-end" v-show="checkPermission('modifyUser')">
            <el-button size="mini"  icon="el-icon-edit" @click="handleUpdate(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="bottom-end" v-show="checkPermission('delUser')">
            <el-button icon="el-icon-delete" size="mini" type="danger" @click="handleDelete(scope.row.id)">
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="重置密码" placement="bottom-end" v-show="checkPermission('resetPwd')">
            <el-button icon="el-icon-s-help" size="mini" type="primary" @click="resetPwd(scope.row, $event)">
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
      :visible.sync="dialogFormVisible" 
      width="550px" 
      ref="childForm"
    >
      <el-form
        ref="userForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="90px"
        class="userFormCls"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="temp.username" :disabled="dialogStatus==='update'"/>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="temp.mobile" />
        </el-form-item>
        <el-form-item label="角色" prop="role_id">
          <el-select v-model="temp.role_id" placeholder="请选择" clearable style="width:100%">
            <el-option v-for="item in rolesList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态：" prop="state">
          <el-switch v-model="temp.status" active-color="#13ce66" active-value="1" inactive-value="2"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false">取消</el-button>
        <el-button 
          type="primary" 
          size="small" 
          @click="dialogStatus==='create'?submit($event):updateData()"
          :loading="btnLoding"
        >确认</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getRolesCombo } from '@/api/system'
import { getUserList, addUser, modifyUser, removeUser, resetPwd } from '@/api/user'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import clip from '@/utils/clipboard' // use clipboard directly
import { randomStr, checkPermission } from '@/utils/index'
import { validMobile } from '@/utils/validate'

export default {
  name: 'User',
  components: { Pagination },
  computed: {
    ...mapGetters([
      'permissions',
    ])
  },
  data() {
    var validTelephone = (rule, value, callback) => {
      if (value && !validMobile(value)) {
        callback(new Error('请输入正确的手机号'))
      }
      callback()
    }

    return {
      tableKey: 0,
      list: [],
      rolesList: [],
      rolesMap: {},
      total: 0,
      listLoading: true,
      listQuery: {
        page_no: 1,
        page_size: 10,
        mobile: undefined,
        username: undefined,
        role_id: undefined,
        status: undefined
      },
      temp: {
        id: undefined,
        username: '',
        role_id: '',
        nickname: '',
        mobile: '',
        status: "1",
        password: ''
      },
      tempCopy: null,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑用户',
        create: '添加用户'
      },
      rules: {
        username: [
          { required: true, trigger: 'blur', message: '请填写用户名' }
        ],
        role_id: [
          { required: true, trigger: 'blur', message: '请设置角色' }
        ],
        mobile: [
          { validator: validTelephone, trigger: 'blur', message: '请输入正确的手机号' }
        ]
      },
      statusOptions: [
        {key:1,label:'启用'},
        {key:2,label:'禁用'}
      ],
      btnLoding: false
    }
  },
  created() {
    this.tempCopy = Object.assign({}, this.temp)
    this.getList()
    this.getRolesCombo()
  },
  methods: {
    checkPermission(check) {
      return checkPermission(this.permissions, check)
    },
    handleModifyState(row) {
      const upData = {
        'id': row.id,
        'status': row.status
      }
      this.modifyUser(upData, false)
    },
    async getRolesCombo() {
      const res = await getRolesCombo()
      this.rolesList = res.response
      this.rolesList.forEach(item => {
        this.$set(this.rolesMap, item.id, item.name)
      })
    },
    getList() {
      this.listLoading = true
      getUserList(this.listQuery).then(res => {
        this.list = res.response.rows
        this.total = res.response.total
      })
      setTimeout(() => {
        this.listLoading = false
      }, 0.5 * 1000)
    },
    handleFilter() {
      this.listQuery.page_no = 1
      this.getList()
    },
    resetForm(formName) {
      if (this.$refs[formName] === undefined) {
        return false
      }
      this.$refs[formName].resetFields()
      this.temp = Object.assign({}, this.tempCopy)
    },
    submit(event) {
      this.$refs['userForm'].validate((valid) => {
        if (valid) {
          this.btnLoding = true
          this.temp.password = randomStr()
          addUser(this.temp).then((res) => {
            this.$alert('密码: 『' + this.temp.password + '』已复制到剪贴板', '用户『' + this.temp.username + '』创建成功', {
              confirmButtonText: '确定',
              callback: action => {
                this.handleFilter()
              }
            })
            setTimeout(() => {
              this.dialogFormVisible = false
              this.btnLoding = false
            }, 0.5 * 1000)
          }).catch(() => {
            setTimeout(() => {
              this.btnLoding = false
            }, 0.5 * 1000)
          })
          //复制到剪切板
          const text = '用户名:' + this.temp.username + "\n" + '密码:' + this.temp.password
          clip(text, event)
        }
      })
    },
    handleAdd() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.resetForm('userForm')
      })
    },
    handleUpdate(row) {
      this.dialogStatus = 'update'
      for(let field in this.temp) {
        this.temp[field] = row[field]
      }
      this.dialogFormVisible = true
    },
    updateData() {
      this.$refs['userForm'].validate((valid) => {
        if (valid) {
          this.btnLoding = true
          this.modifyUser(this.temp, true)
        }
      })
    },
    handleDelete(id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeUser({ 'id': id }).then((res) => {
          this.$message({
            message: res.codemsg || '操作成功',
            type: 'success',
            showClose: true
          })
          this.handleFilter()
        })
      }).catch(() => {})
    },
    modifyUser(upData, isDialog) {
      modifyUser(upData).then((res) => {
        this.$message({
          message: res.codemsg || '操作成功',
          type: 'success',
          showClose: true
        })
        if (isDialog) {
          this.dialogFormVisible = false
          this.btnLoding = false
        }
        this.handleFilter()
      }).catch(() => {
        if (!isDialog) {
          this.handleFilter()
        } else {
          this.btnLoding = false
        }
      })
    },
    resetPwd(row, event) {
      const newPassword = randomStr()
      this.$confirm('此操作将重置用户密码, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        resetPwd({ 'id': row.id, 'new_password': newPassword }).then((res) => {
          this.$alert('密码: 『' + newPassword + '』已复制到剪贴板', '用户『' + row.username + '』密码重置成功', {
            confirmButtonText: '确定',
            callback: action => {
              this.handleFilter()
            }
          })
        })
      }).catch(() => {})
      clip(newPassword, event)
    }
  }
}
</script>
<style scoped>
.userFormCls {
  padding-right: 20px;
}
</style>
