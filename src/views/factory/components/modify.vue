<template>
  <div class="modify-container">
    <el-dialog
      :close-on-click-modal="false"
      :title="textMap[dialogStatus]"
      :visible.sync="dialogShow"
      width="550px"
      ref="childForm"
    >
      <el-form
        ref="dialogForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="90px"
        class="dialog-form-cls"
      >
        <el-form-item label="厂家名称" prop="name">
          <el-input v-model="temp.name"/>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="temp.status" active-color="#13ce66" active-value="1" inactive-value="2"/>
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input v-model="temp.desc" type="textarea"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog">取消</el-button>
        <el-button 
          type="primary" 
          size="small" 
          :loading="btnLoding"
          @click="dialogStatus==='create'?submit($event):updateData()"
        >确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { updateFactory, addFactory } from '@/api/factory'

export default {
  name: 'modifyFactory',
  data() {
    return {
      textMap: {
        update: '编辑厂家',
        create: '添加厂家'
      },
      dialogShow: false,
      dialogStatus: 'create',
      btnLoding: false,
      temp: {},
      defaultTemp: {
        id: undefined,
        name: '',
        status: '1',
        desc: ''
      },
      rules: {
        name: [
          { required: true, trigger: 'blur', message: '请填写厂家名称' }
        ]
      }
    }
  },
  methods: {
    showDialog(status) {
      this.dialogStatus = status
      this.dialogShow = true
      if (status === 'create') {
        this.$nextTick(() => {
          this.resetForm('dialogForm')
        })
      } else {
        this.temp = this.$store.state.factory.row
      }
    },
    closeDialog() {
      this.dialogShow = false
    },
    resetForm(formName) {
      if (this.$refs[formName] === undefined) {
        return false
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
          addFactory(this.temp).then((res) => {
            this.$message({
              message: res.codemsg || '操作成功',
              type: 'success',
              showClose: true
            })
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
          updateFactory(this.temp).then((res) => {
            this.$message({
              message: res.codemsg || '操作成功',
              type: 'success',
              showClose: true
            })
            this.dialogShow = false
            this.btnLoding = false
            this.handleFilter()
          }).catch(() => {
            this.btnLoding = false
          })
        }
      })
    }
  }
}
</script>
