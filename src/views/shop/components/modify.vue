<template>
  <div class="modify-container">
    <el-dialog 
      :close-on-click-modal="false" 
      :title="textMap[dialogStatus]" 
      :visible.sync="dialogShow" 
      width="550px" 
      ref="childForm"
      @close="closeDialog"
    >
      <el-form
        ref="dialogForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="90px"
        class="dialog-form-cls"
      >
        <el-form-item label="店铺名称" prop="name">
          <el-input v-model="temp.name"/>
        </el-form-item>
        <el-form-item label="店铺类型" prop="role_id">
          <el-select v-model="temp.type" placeholder="请选择" clearable style="width:100%">
            <el-option v-for="item in typeList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
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
          @click="dialogStatus==='create'?submit($event):updateData()"
          :loading="btnLoding"
        >确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addShop, updateShop } from '@/api/shop'

export default {
  name: 'modifyShop',
  data() {
    return {
      textMap: {
        update: '编辑门店',
        create: '添加门店'
      },
      dialogShow: false,
      dialogStatus: 'create',
      btnLoding: false,
      temp: {},
      defaultTemp: {
        id: undefined,
        name: '',
        type: '1',
        desc: ''
      },
      rules: {
        name: [
          { required: true, trigger: 'blur', message: '请填写店铺名称' }
        ]
      }
    }
  },
  computed: {
    typeList() {
      return this.$store.state.shop.typeList
    },
    typeMap() {
      return this.$store.state.shop.typeMap
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
        this.temp = this.$store.state.shop.row
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
          addShop(this.temp).then((res) => {
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
          updateShop(this.temp).then((res) => {
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
