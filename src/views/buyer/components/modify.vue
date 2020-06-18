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
        <el-form-item label="买家名称" prop="buyer_login_id">
          <el-input v-model="temp.buyer_login_id" :readonly="dialogStatus==='update' && temp.type === '1'"/>
        </el-form-item>
        <el-form-item label="买家类型" prop="type">
          <el-select v-model="temp.type" disabled>
            <el-option v-for="item in typeOptions" :key="item.key" :label="item.label" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio v-model="temp.sex" label="1">男</el-radio>
          <el-radio v-model="temp.sex" label="2">女</el-radio>
          <el-radio v-model="temp.sex" label="3">未知</el-radio>
        </el-form-item>
        <el-form-item label="QQ" prop="qq">
          <el-input v-model="temp.qq"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="temp.address" type="textarea"></el-input>
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
import { addBuyer, updateBuyer } from '@/api/buyer'

export default {
  name: 'modifyBuyer',
  props: {
    row: {
      type: Object,
      required: true
    }
  },
  computed: {
    typeOptions() {
      return this.$store.state.const.buyerTypeList
    },
    typeMap() {
      return this.$store.state.const.buyerTypeMap
    }
  },
  data() {
    return {
      textMap: {
        update: '编辑买家',
        create: '添加买家'
      },
      dialogShow: false,
      dialogStatus: 'create',
      btnLoding: false,
      temp: {},
      defaultTemp: {
        id: undefined,
        buyer_login_id: '',
        type: '2',
        sex: '3',
        desc: ''
      },
      rules: {
        buyer_login_id: [
          { required: true, trigger: 'blur', message: '请填写买家名称' }
        ]
      }
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
        }
      })
    },
    resetForm(formName) {
      if (this.$refs[formName] === undefined) {
        return false
      }
      this.$refs[formName].resetFields()
      this.temp = Object.assign({}, this.defaultTemp)
    },
    closeDialog() {
      this.dialogShow = false
    },
    handleFilter() {
      this.$emit('handleFilter')
    },
    submit(event) {
      this.$refs['dialogForm'].validate((valid) => {
        if (valid) {
          this.btnLoding = true
          addBuyer(this.temp).then((res) => {
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
          updateBuyer(this.temp).then((res) => {
            this.$message({ message: res.codemsg || '操作成功', type: 'success', showClose: true })
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
