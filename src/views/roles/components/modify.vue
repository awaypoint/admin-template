<template>
  <div class="modify-container">
    <el-dialog
      :close-on-click-modal="false"
      :title="textMap[dialogStatus]"
      :visible="dialogShow"
      width="650px"
      @close="closeDialog"
    >
      <el-form
        ref="dialogForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="110px"
        class="dialog-form-cls"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>

        <el-form-item label="状态" prop="state">
          <el-switch v-model="temp.status" active-color="#13ce66" active-value="1" inactive-value="2" />
        </el-form-item>
        <!-- <el-form-item label="厂家" prop="factory">
          <factorySelect ref="factorySelectRef" @selectFactory="selectFactory"></factorySelect>
          <span style="color:red;">注:选择了厂家的角色只能看到该厂家的数据</span>
        </el-form-item> -->
        <el-form-item label="描述" prop="desc">
          <el-input v-model="temp.desc" type="textarea" />
        </el-form-item>
        <hr class="el-divider">
        <el-form-item label="拥有权限" prop="permission" class="permission-form-cls">
          <el-form-item v-for="(permission,idx) of permissionList" :key="idx" label-width="0px">
            <el-checkbox
              v-model="permission.checkedAll"
              :indeterminate="permission.indeterminate"
              style="margin-right: 30px;"
              @change="onChangeCheckAll($event, permission)"
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
        <el-button size="small" @click="closeDialog">取消</el-button>
        <el-button
          type="primary"
          size="small"
          :loading="btnLoding"
          @click="dialogStatus==='create'?submit():updateData()"
        >确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addRole, updateRole, getAllMenus, getRolePermission } from '@/api/system'
import factorySelect from '@/components/factorySelect';

export default {
  name: 'modifyRole',
  props: {
    row: {
      type: Object,
      required: true
    }
  },
  components: { factorySelect },
  data() {
    return {
      textMap: {
        update: '编辑角色',
        create: '添加角色'
      },
      dialogShow: false,
      dialogStatus: 'create',
      btnLoding: false,
      temp: {},
      defaultTemp: {
        id: '',
        name: '',
        desc: '',
        status: '1',
        factory: '0',
        permissions: []
      },
      rules: {
        name: [
          { required: true, trigger: 'blur', message: '角色名称不能为空' }]
      }
    }
  },
  computed: {
    permissionList() {
      return this.$store.state.role.permissionList
    }
  },
  watch: {
    row: {
      deep: true,
      handler(val) {}
    }
  },
  methods: {
    showDialog(status) {
      this.dialogStatus = status
      this.dialogShow = true

      this.$nextTick(() => {
        if (status === 'create') {
            this.resetForm('dialogForm')
        } else {
          this.temp = Object.assign({}, this.row)
          if (this.temp.permissions.length === 0) {
            getRolePermission({ 'id': this.temp.id }).then(res => {
              this.permissions2Menus(res.response)
            }).catch(() => {})
          } else {
            this.permissions2Menus(this.temp.permissions)
          }
          // this.$refs.factorySelectRef.setValue(this.temp.factory)
        }
      })
    },
    closeDialog() {
      this.dialogShow = false
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
      if (this.$refs.factorySelectRef !== undefined) {
        this.$refs.factorySelectRef.setValue('')
      }
      this.$refs[formName].resetFields()
      this.temp = Object.assign({}, this.defaultTemp)
    },
    handleFilter() {
      this.$emit('handleFilter')
    },
    submit(event) {
      this.$refs['dialogForm'].validate((valid) => {
        if (valid) {
          this.btnLoding = true
          this.createPermissions()
          addRole(this.temp).then((res) => {
            this.$message({ message: res.codemsg || '操作成功', type: 'success', showClose: true })
            this.dialogShow = false
            this.btnLoding = false
            this.handleFilter()
          }).catch(() => {
            this.btnLoding = false
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
            this.$message({ message: res.codemsg || '操作成功', type: 'success', showClose: true })
            this.dialogShow = false
            this.btnLoding = false
            this.handleFilter()
          }).catch(() => {
            this.btnLoding = false
          })
        }
      })
    },
    onChangeCheck(permission) {
      permission.indeterminate = !!permission.selected.length && (permission.selected.length < permission.actionsOptions.length)
      permission.checkedAll = permission.selected.length === permission.actionsOptions.length
    },
    onChangeCheckAll(checked, permission) {
      const allPerIds = []
      permission.actionsOptions.forEach(value => {
        allPerIds.push(value.id)
      })
      Object.assign(permission, {
        selected: checked ? allPerIds : [],
        indeterminate: false,
        checkedAll: checked
      })
    },
    createPermissions() {
      this.temp.permissions = []
      this.permissionList.forEach(items => {
        const currentSelected = items.selected
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
          const currentSelected = []
          for (const i in items.actionsOptions) {
            if (rolePermissions.indexOf(items.actionsOptions[i].id) > -1) {
              currentSelected.push(items.actionsOptions[i].id)
            }
          }
          this.permissionList[key].selected = currentSelected
          if (currentSelected.length === items.actionsOptions.length) {
            this.permissionList[key].checkedAll = true
            this.permissionList[key].indeterminate = false
          }
        }
      })
    },
    selectFactory(value) {
      this.temp.factory = value
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ .el-dialog {
  margin-top: 10vh !important;
}
.permission-items {
  margin-left: 20px;
}
.permission-form-cls {
  max-height: 60vh;
  overflow: scroll;
  overflow-y: auto;
  margin-bottom: 0px;
}
/deep/.el-dialog__body {
  padding-bottom: 0px;
}
/deep/.el-form-item__content {
  line-height: 26px;
}
</style>
