<template>
  <div class="printer" v-loading="listLoading">
    <el-backtop v-if="!printing"></el-backtop>
    <sticky :z-index="10" class-name="sub-navbar" v-if="!printing">
      <div class="printer-btns">
        <el-button size="mini" v-if="stockoutBtn" @click="multStockOut">一键出库</el-button>
        <el-button type="danger" size="mini" @click="print">打印全部</el-button>
      </div>
    </sticky>
    <div id="printContainerId" ref="print">
      <div class="printer-container" v-for="(item, index) in list" :key="index">
        <div class="printer-container-header">
          <h2>{{ item.name }}发货单</h2>
          <el-row :gutter="10">
            <el-col :span="3">
              <div class="printer-container-header-label">订单号:</div>
            </el-col>
            <el-col :span="21">
              <div class="printer-container-header-value">{{ item.order_id }}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="3">
              <div class="printer-container-header-label">买家:</div>
            </el-col>
            <el-col :span="9">
              <div class="printer-container-header-value">{{ item.buyer_login_id }}</div>
            </el-col>
            <el-col :span="3">
              <div class="printer-container-header-label">下单日期:</div>
            </el-col>
            <el-col :span="9">
              <div class="printer-container-header-value">{{ item.order_created_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</div>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="3">
              <div class="printer-container-header-label">收货信息:</div>
            </el-col>
            <el-col :span="21">
              <div class="printer-container-header-value">{{ item.to_area }}</div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="3">
              <div class="printer-container-header-label">买家留言:</div>
            </el-col>
            <el-col :span="21">
              <div class="printer-container-header-value">{{ item.buyer_feed_back }}</div>
            </el-col>
          </el-row>
        </div>
        <div class="printer-container-table">
          <el-table
            :key="1"
            :data="item.goods"
            border
            fit
            style="width: 100%;"
          >
            <el-table-column label="序号" width="50px" align="center" type="index"></el-table-column>
            <el-table-column label="图片" width="80px" align="center" prop="image">
              <template  slot-scope="scope">
                <img :src="scope.row.image" style="height:64px;width:64px;">
              </template>
            </el-table-column>
            <el-table-column label="库号" min-width="120px" align="center" prop="cargo_number"></el-table-column>
            <el-table-column label="货号" width="100px" align="center" prop="cargo_number"></el-table-column>
            <el-table-column label="规格" min-width="120px" align="center" prop="sku"></el-table-column>
            <el-table-column label="数量" width="80px" align="center" prop="quantity"></el-table-column>
            <el-table-column label="单价" width="80px" align="center" prop="price"></el-table-column>
            <el-table-column label="优惠(元)" width="90px" align="center" prop="discount"></el-table-column>
            <el-table-column label="金额(元)" width="90px" align="center" prop="amount"></el-table-column>
          </el-table>
        </div>
        <div class="printer-container-footer">
          <el-row :gutter="20">
            <el-col :span="3">
              <div class="printer-container-header-label">货品合计:</div>
            </el-col>
            <el-col :span="5">
              <div class="printer-container-header-value">{{ item.sum_product_payment }}</div>
            </el-col>
            <el-col :span="3">
              <div class="printer-container-header-label">运费:</div>
            </el-col>
            <el-col :span="5">
              <div class="printer-container-header-value">{{ item.shipping_fee }}</div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="3">
              <div class="printer-container-header-label">货品总量:</div>
            </el-col>
            <el-col :span="5">
              <div class="printer-container-header-value">{{ item.product_num }}</div>
            </el-col>
            <el-col :span="3">
              <div class="printer-container-header-label">优惠:</div>
            </el-col>
            <el-col :span="5">
              <div class="printer-container-header-value">{{ item.discount }}</div>
            </el-col>
            <el-col :span="3">
              <div class="printer-container-header-label">应收金额:</div>
            </el-col>
            <el-col :span="5">
              <div class="printer-container-header-value">{{ item.total_amount }}</div>
            </el-col>
          </el-row>
        </div>
        <el-divider></el-divider>
        <div class="printer-contaier-end">
          <el-row :gutter="20">
            <el-col :span="3" :offset="10">
              <div class="printer-container-header-label">发货人:</div>
            </el-col>
            <el-col :span="3">
              <div class="printer-container-header-value"></div>
            </el-col>
            <el-col :span="3">
              <div class="printer-container-header-label">核对人:</div>
            </el-col>
            <el-col :span="5">
              <div class="printer-container-header-value"></div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getPrinterOrders, multStockOut } from '@/api/order'
import Sticky from '@/components/Sticky'

export default {
  name: 'OrderPrinter',
  components: { Sticky },
  computed: {
    selectOrderIds() {
      return JSON.parse(localStorage.getItem('selectOrderIds'))
    }
  },
  created() {
    this.getOrders()
  },
  data() {
    return {
      printing: false,
      listLoading: false,
      list: [],
      stockoutBtn: true
    }
  },
  methods: {
    getOrders() {
      this.listLoading = true
      getPrinterOrders({ 'orders' : this.selectOrderIds }).then(res => {
        this.list = res.response
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      }).catch(() => {
        this.listLoading = false
      })
    },
    print() {
      this.printing = true
      this.$nextTick(() => {
        window.print()
        this.printing = false
      })
    },
    multStockOut() {
      multStockOut({ 'orders': this.selectOrderIds }).then(res => {
        this.$message({ message: '出库成功', type: 'success', showClose: true })
        this.stockoutBtn = false
      }).catch(() => {
        this.$message({ message: '出库失败', type: 'success', showClose: true })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/.el-divider--horizontal {
  width: 95%;
  margin: 12px auto;
}
/deep/.el-table th, /deep/.el-table td {
    padding: 6px 0;
}
/deep/.el-table .cell {
  white-space: pre-line;
}
.printer {
  width: 900px;
  margin: 0 auto;
  padding: 20px 15px;
}
.printer-btns {
  text-align: right;
}
.printer-container {
  border: 1px solid #606266;
  margin-top: 10px;
}
.printer-container-header h2 {
  text-align: center;
}
.printer-container-header-label {
  text-align: right;
  font-weight: bold;
  padding: 5px 0 3px 20px;
}
.printer-container-header-value {
  padding: 5px 0 3px 0;
}
.printer-container-table {
  margin: 10px 0;
}
.printer-contaier-end {
  // float: right;
  margin-bottom: 20px;
}
</style>
