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
        :model="temp"
        label-position="right"
        label-width="90px"
        class="dialog-form-cls"
      >
        <el-form-item label="买家名称" prop="buyer_login_id">
          <el-input v-model="temp.buyer_login_id" readonly/>
        </el-form-item>
        <el-form-item label="买家id" prop="buyer_member_id">
          <el-input v-model="temp.buyer_member_id" readonly/>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio v-model="temp.sex" label="1">男</el-radio>
          <el-radio v-model="temp.sex" label="2">女</el-radio>
          <el-radio v-model="temp.sex" label="3">未知</el-radio>
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
          @click="updateData"
          :loading="btnLoding"
        >确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { updateBuyer } from '@/api/buyer'

export default {
  name: 'modifyBuyer',
  data() {
    return {
      textMap: {
        update: '编辑买家',
        create: '添加买家'
      },
      dialogShow: false,
      dialogStatus: 'create',
      btnLoding: false,
      temp: {}
    }
  },
  computed: {
    typeList() {
      return this.$store.state.buyer.typeList
    },
    typeMap() {
      return this.$store.state.buyer.typeMap
    }
  },
  methods: {
    showDialog(status) {
      this.dialogStatus = status
      this.dialogShow = true
      this.temp = this.$store.state.buyer.row
    },
    closeDialog() {
      this.dialogShow = false
    },
    handleFilter() {
      this.$emit('handleFilter')
    },
    updateData() {
      this.$refs['dialogForm'].validate((valid) => {
        if (valid) {
          this.btnLoding = true
          updateBuyer(this.temp).then((res) => {
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
