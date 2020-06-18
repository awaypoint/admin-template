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
              <el-tag type="danger">{{ statusMap[temp.status] }}</el-tag>
              <el-tag type="info" v-show="temp.type === '2'">{{ typeMap[temp.type] }}</el-tag>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="3">
              <div class="order-aside-label">收件人:</div>
            </el-col>
            <el-col :span="21">
              <el-tag :span="2">{{ temp.to_full_name }}</el-tag>
              <span class="order-aside-span">{{ temp.buyer_login_id }}</span>
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
              <div class="order-aside-label">快递单号:</div>
            </el-col>
            <el-col :span="21">
              <span class="order-aside-span">{{ temp.shipping_company }}</span>
              <el-tag>{{ temp.shipping_no }}</el-tag>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="3">
              <div class="order-aside-label">运费:</div>
            </el-col>
            <el-col :span="9">
              <span class="order-aside-span">{{ temp.shipping_fee }}</span>
            </el-col>
            <el-col :span="3">
              <div class="order-aside-label">总金额:</div>
            </el-col>
            <el-col :span="9">
              <el-tag type="danger" effect="dark"> ￥{{ temp.total_amount }} </el-tag>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="3">
              <div class="order-aside-label">下单时间:</div>
            </el-col>
            <el-col :span="9">
              <span class="order-aside-span">{{ temp.order_created_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </el-col>
            <el-col :span="3">
              <div class="order-aside-label">付款时间:</div>
            </el-col>
            <el-col :span="9">
              <span class="order-aside-span">{{ temp.order_paid_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="3">
              <div class="order-aside-label">修改时间:</div>
            </el-col>
            <el-col :span="9">
              <span class="order-aside-span">{{ temp.order_modified_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </el-col>
            <el-col :span="3">
              <div class="order-aside-label">同步时间:</div>
            </el-col>
            <el-col :span="9">
              <span class="order-aside-span">{{ temp.updated_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="3">
              <div class="order-aside-label">买家留言:</div>
            </el-col>
            <el-col :span="21">
              <span class="order-aside-span">{{ temp.buyer_feed_back }}</span>
            </el-col>
          </el-row>
        </aside>
      </div>
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
        <el-table-column type="index" align="center" label="序号" width="50px">
        </el-table-column>
        <el-table-column label="货号" width="100px" align="center" sortable prop='cargo_number'>
          <template slot-scope="scope">
            <productPopover :data="scope.row" :reference="scope.row.cargo_number"></productPopover>
          </template>
        </el-table-column>
        <el-table-column label="sku" min-width="120px" align="center" prop="quantity">
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
        </el-table-column>
        <el-table-column label="价格" min-width="140px" align="center" prop="price">
        </el-table-column>
        <el-table-column label="折扣" width="100px" align="center" prop="discount">
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog">取消</el-button>
        <el-button type="success" size="small" @click="handlePrinte">打印</el-button>
        <el-button v-if="temp.is_stock === '2'" type="primary" size="small" @click="handleStock">出库</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getOrderDetail } from '@/api/order'
import addProduct from '@/components/addProduct';
import { checkPermission } from '@/utils/index'
import productPopover from '@/components/productPopover';

export default {
  name: 'modifyOrder',
  components: { addProduct, productPopover },
  props: {
    row: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      textMap: {
        update: '编辑订单',
        create: '添加订单',
        view: '查看订单',
      },
      dialogShow: false,
      dialogStatus: '',
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
        is_stock: '2',
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
  watch: {
    row: {
      deep: true,
      handler(val) {}
    }
  },
  computed: {
    ...mapGetters([
      'permissions'
    ]),
    typeMap() {
      return this.$store.state.order.orderTypeMap
    },
    resourceOptions() {
      return this.$store.state.order.orderResourceOptions
    },
    statusMap() {
      return this.$store.state.order.orderStatusMap
    }
  },
  methods: {
    checkPermission(check) {
      return checkPermission(this.permissions, check)
    },
    showDialog(dialogStatus) {
      this.dialogShow = true
      this.$nextTick(() => {
        this.dialogStatus = dialogStatus
        if (dialogStatus === 'create') {
          this.resetForm('dialogForm')
        } else {
          getOrderDetail({ id: this.row.id }).then( res => {
            this.temp = res.response
          }).catch(() => {})
        }
      })
    },
    closeDialog() {
      // this.$refs.addProduct.close()
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
    getSummaries(params) {
      return [ '', '总计', '', this.temp.product_num, this.temp.sum_product_payment ]
    },
    handlePrinte() {
      const list = [this.row.id]
      this.$store.dispatch('order/setSelectOrders', list)
      const routeData = this.$router.resolve({ path: '/printe' });
      window.open(routeData.href, '_blank');
    },
    handleStock() {
      this.closeDialog()
      this.$emit('handleStock', this.temp.order_id)
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
