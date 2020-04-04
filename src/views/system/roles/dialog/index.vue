<template>
    <el-dialog :close-on-click-modal="false" :title="textMap[dialogStatus]" :visible="dialogShow" @close="handleClose">

      <el-form
        ref="userForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="110px"
      >
        <el-form-item label="唯一识别码：" prop="code">
          <el-input v-model="temp.code" :disabled="dialogStatus!=='create'" />
        </el-form-item>
        <el-form-item label="角色名称：" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>

        <el-form-item label="状态：" prop="state">
          <el-switch v-model="temp.state" active-color="#13ce66" />
        </el-form-item>
        <el-form-item label="描述：" prop="desc">
          <el-input v-model="temp.desc" type="textarea" />
        </el-form-item>
        <hr class="el-divider">
        <el-form-item label="拥有权限：" prop="permission">

          <el-form-item v-for="(permission,idx) of temp.permissions" :key="idx" :label="permission.name+'：'">
            <el-checkbox
              v-model="permission.checkedAll"
              :indeterminate="permission.indeterminate"
              @change="onChangeCheckAll($event, permission)"
            >全选</el-checkbox>
            <el-checkbox-group v-model="permission.selected" style="display: inline-block">
              <el-checkbox
                v-for="val of permission.actionsOptions"
                :key="val"
                :label="val"
                name="type"
                @change="onChangeCheck(permission)"
              >
                {{ permissionOption[val] }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>

        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleClose">取消</el-button>
        <el-button type="danger" size="small" @click="dialogStatus==='create'?submit():updateData()">确认</el-button>
      </div>
    </el-dialog>
</template>

<script>
export default {
    name: 'RoleDialog',
    data() {
        return {
            temp: {
                code: '',
                name: '',
                desc: '',
                state: true,
                permissions: []
            },
            textMap: {
                update: '编辑',
                create: '添加'
            },
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
    props: ['dialogShow'],
    methods: {
        submit() {
            this.$refs['userForm'].validate((valid) => {
                if (valid) {
                // const tempData = Object.assign({}, this.temp)
                addRole(this.temp).then((res) => {
                    this.list.push(res.data)
                    this.dialogFormVisible = false
                    this.$notify({
                    title: '成功',
                    message: '创建成功',
                    type: 'success',
                    duration: 2000
                    })
                })
                }
            })
        },
        handleUpdate(row) {
            this.dialogStatus = 'update'
            this.temp = Object.assign({}, row) // copy obj
            const rowPer = this.permissionList.map(item => {
                const result = JSON.parse(JSON.stringify(item))
                const hasPer = row.permissions.find(v => v.code === item.code)
                if (hasPer) {
                result.selected = hasPer.selected
                }
                result.indeterminate = !!result.selected.length && (result.selected.length < result.actionsOptions.length)
                result.checkedAll = result.selected.length === result.actionsOptions.length

                return result
            })
            this.$set(this.temp, 'permissions', rowPer)
            this.dialogFormVisible = true
            this.$nextTick(() => {
                this.$refs['userForm'].clearValidate()
            })
        },
        updateData() {
            this.$refs['userForm'].validate((valid) => {
                if (valid) {
                updateRole(this.temp).then(() => {
                    for (const v of this.list) {
                    if (v._id === this.temp._id) {
                        const index = this.list.indexOf(v)
                        this.list.splice(index, 1, this.temp)
                        break
                    }
                    }
                    this.dialogFormVisible = false
                    this.$notify({
                    title: '成功',
                    message: '更新成功',
                    type: 'success',
                    duration: 2000
                    })
                })
                }
            })
        },
        handleClose() {
            this.$emit('closeDialog',false);
        }
    }
}
</script>