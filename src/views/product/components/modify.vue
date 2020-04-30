<template>
  <div class="modify-container">
    <el-dialog
      :close-on-click-modal="false"
      title="添加商品"
      :visible.sync="dialogShow"
    >
      <div class="step-container">
        <el-steps :space="200" :active="stepActive" finish-status="success">
          <el-step title="已完成"></el-step>
          <el-step title="进行中"></el-step>
          <el-step title="步骤 3"></el-step>
        </el-steps>
      </div>
      <div class="form-container">
        <el-form>

        </el-form>
      </div>
      <div class="btn-container">
        <el-button @click="nextStep">下一步</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getProductList, addProduct, getProductDetail, delProduct } from '@/api/product'

export default {
  name: 'modifyProduct',
  components: {},
  data() {
    return {
      dialogShow: false,
      dialogStatus: 'create',
      stepActive: 0,
      textMap: {

      },
      temp: {},
      tempCopy: null,
      rules: {
        name: [
          { required: true, trigger: 'blur', message: '请填写厂家名称' }
        ]
      },
      btnLoding: false
    }
  },
  created() {
    this.tempCopy = Object.assign({}, this.temp)
  },
  methods: {
    showDialog(status) {
      this.dialogStatus = status
      this.dialogShow = true
    },
    closeDialog() {
      this.dialogShow = false
    },
    nextStep() {
      if (this.stepActive++ > 2) {
        this.stepActive = 0;
      }
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleAdd() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.resetForm('dialogForm')
      })
    },
    handleUpdate(row) {
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.temp = {}
      getProductDetail({ id: row.id }).then( res => {
        this.temp = res.response
        this.priceColNum = Math.min(4, this.temp.price.length)
      }).catch(() => {})
    },
    resetForm(formName) {
      if (this.$refs[formName] === undefined) {
        return false
      }
      this.$refs[formName].resetFields()
      this.temp = Object.assign({}, this.tempCopy)
    },
    submit(event) {
      this.$refs['dialogForm'].validate((valid) => {
        if (valid) {
          this.btnLoding = true
          add(this.temp).then((res) => {
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
    getSummaries(params) {
      const { columns, data } = params
      const sums = [ '总计', 333, 222 ]
      return sums
    }
  }
}
</script>
