<template>
  <div class="modify-container">
    <el-dialog
      :close-on-click-modal="false"
      :title="textMap[dialogStatus]"
      :visible.sync="dialogShow"
      width="1050px"
      ref="childForm"
      :before-close="closeDialog"
    >
      <div>
        <aside class="aside">
          <el-row :gutter="20">
            <el-col :span="3" style="text-align: rigth">
              <div class="order-aside-label">订单编号:</div>
            </el-col>
            <el-col :span="21">
              <span class="order-aside-span">{{ temp.order_id }}</span>
              <el-tag type="danger">{{ temp.status_name }}</el-tag>
              <el-tag type="info" v-show="temp.type === '2'">{{ typeMap[temp.type] }}</el-tag>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="3">
              <div class="order-aside-label">收件人:</div>
            </el-col>
            <el-col :span="21">
              <span class="order-aside-span">{{ temp.to_full_name }}</span>
              <el-tag :span="2">{{ temp.buyer_login_id }}</el-tag>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="3">
              <div class="order-aside-label">地址:</div>
            </el-col>
            <el-col :span="21">
              <span class="order-aside-span">{{ temp.to_area }}</span>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="3">
              <div class="order-aside-label">电话:</div>
            </el-col>
            <el-col :span="21">
              <span class="order-aside-span">{{ temp.to_mobile }}</span>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="3">
              <div class="order-aside-label">邮编:</div>
            </el-col>
            <el-col :span="21">
              <span class="order-aside-span">{{ temp.to_post }}</span>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="3">
              <div class="order-aside-label">下单时间:</div>
            </el-col>
            <el-col :span="6">
              <span class="order-aside-span">{{ temp.order_created_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </el-col>
            <el-col :span="3">
              <div class="order-aside-label">付款时间:</div>
            </el-col>
            <el-col :span="6">
              <span class="order-aside-span">{{ temp.order_paid_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="3">
              <div class="order-aside-label">修改时间:</div>
            </el-col>
            <el-col :span="6">
              <span class="order-aside-span">{{ temp.order_modified_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </el-col>
            <el-col :span="3">
              <div class="order-aside-label">同步时间:</div>
            </el-col>
            <el-col :span="6">
              <span class="order-aside-span">{{ temp.updated_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </el-col>
          </el-row>
          <div class="aside-amount">
            <svg-icon icon-class="white-money" class="asidt-amount-svg"/>
            <div class="aside-amount-number">{{ temp.sum_pay_ment }}</div>
          </div>
        </aside>
      </div>
      <el-form
        ref="dialogForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="120px"
        class="dialog-form-cls"
      >
        <el-row :gutter="30">
          <el-col :span="12">
            <el-form-item label="线上\线下单" prop="role_id">
              <el-select v-model="temp.resource" placeholder="请选择" style="width:100%">
                <el-option v-for="item in resourceOptions" :key="item.key" :label="item.label" :value="item.key" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="线下单运费" prop="resource">
              <el-input v-model="temp.resource"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="30">
          <el-col :span="12" style="text-align: rigth">
            <el-form-item label="实际运费" prop="type">
              <el-input v-model="temp.resource"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="补差金额" prop="resource">
              <el-input v-model="temp.resource"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注" prop="desc">
          <el-input v-model="temp.desc" type="textarea"/>
        </el-form-item>
      </el-form>
      <el-divider></el-divider>
      <el-table
        row-key="id"
        :data="temp.products"
        border
        highlight-current-row
        show-summary
        :summary-method="getSummaries"
        style="width: 100%;"
        ref="dialogTable"
      >
        <el-table-column type="index" :index="indexMethod" align="center">
        </el-table-column>
        <el-table-column label="货号" width="100px" align="center" sortable prop='cargo_number'>
          <template slot-scope="scope">
            <el-popover
              placement="top-start"
              width="100%"
              trigger="hover">
              <el-image
                :src="scope.row.image"
                fit="contain"
              >
              </el-image>
              <el-tag slot="reference" effect="dark">{{ scope.row.cargo_number }}</el-tag>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="sku" min-width="100px" align="center" prop="quantity">
          <template slot-scope="scope" >
            <el-tag 
              v-for="(sku, index) in scope.row.sku_info"
              :key="sku.name"
              effect="dark"
              :type="tagTypeArr[index % 5]"
              style="margin-right: 5px;"
            >
            {{ sku.value }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="产品数量" min-width="100px" align="center" prop="quantity">
          <template slot-scope="scope" >
            <el-input 
              v-model="scope.row.quantity"
              v-if="scope.row.editable"
              class="edit-input" size="small"
            />
            <span v-else>{{ scope.row.quantity }}</span>
          </template>
        </el-table-column>
        <el-table-column label="价格" min-width="140px" align="center">
          <template slot-scope="scope">
            <el-input 
              v-model="scope.row.price"
              v-if="scope.row.editable"
              class="edit-input" size="small"
            />
            <span v-else>{{ scope.row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column label="折扣" min-width="140px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.discount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="130" class-name="small-padding fixed-width">
          <template slot="header">
            <addProduct ref="addProduct"></addProduct>
          </template>
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="bottom-end">
              <el-button 
                size="mini"
                :type="scope.row.editable ? 'success' : ''"
                :icon="scope.row.editable ? 'el-icon-finished' : 'el-icon-edit'"
                @click="handleEditRow(scope.row)"
              >
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="打印订单" placement="bottom-end" v-show="checkPermission('printOrder')">
              <el-button icon="el-icon-delete" size="mini" type="danger" @click="handleDelete(scope.row.id)">
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog">取消</el-button>
        <el-button 
          type="primary" 
          size="small" 
          :loading="btnLoding"
          @click="closeDialog"
        >确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getOrderDetail } from '@/api/order'
import addProduct from '@/components/addProduct';
import { checkPermission } from '@/utils/index'

export default {
  name: 'modifyOrder',
  components: { addProduct },
  data() {
    return {
      textMap: {
        update: '编辑订单',
        create: '添加厂家'
      },
      dialogShow: false,
      dialogStatus: 'update',
      btnLoding: false,
      temp: {},
      defaultTemp: {
        id: undefined,
        order_id: '',
        resource: '',
        to_full_name: '',
        buyer_login_id: '',
        name: '',
        status: '1',
        desc: '',
        products: []
      },
      rules: {
        name: [
          { required: true, trigger: 'blur', message: '请填写厂家名称' }
        ]
      },
      tagTypeArr: ['info', 'warning', '', 'success',  'danger']
    }
  },
  computed: {
    ...mapGetters([
      'permissions'
    ]),
    typeMap() {
      return this.$store.state.order.typeMap
    },
    resourceOptions() {
      return this.$store.state.order.resourceOptions
    }
  },
  methods: {
    checkPermission(check) {
      return checkPermission(this.permissions, check)
    },
    showDialog(status) {
      this.dialogStatus = status
      this.dialogShow = true
      if (status === 'create') {
        this.$nextTick(() => {
          this.resetForm('dialogForm')
        })
      } else {
        const row = this.$store.state.order.row
        getOrderDetail({ id: row.id }).then( res => {
          this.temp = res.response
        }).catch(() => {})
      }
    },
    closeDialog() {
      this.$refs.addProduct.close()
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
    },
    handleEditRow(row) {
      row.editable = !row.editable
    },
    indexMethod(index) {
      return index + 1
    },
    getSummaries(params) {
      const { columns, data } = params
      const sums = [ '总计', 333, 222 ]
      return sums
    }
  }
}
</script>
<style lang="scss" scoped>

/deep/.el-dialog {
  margin-top: 3vh !important;
  margin-bottom: 5vh;
}
/deep/.el-dialog__body {
  padding-top: 0px;
}
.order-aside-label {
  text-align: right;
  font-weight: 700;
  color: #2c3e50;
}
.aside {
  position: relative;
}
.aside-amount {
  background-color: #F56C6C;
  border-radius: 5%;
  position: absolute;
  bottom: 15px;
  right: 20px;
  line-height: 50px;
  padding: 0 10px;
  font-size: 20px;
  color: white;
}
.aside-amount-svg {
  display: inline;
}
.aside-amount-number {
  display: inline;
}
</style>
