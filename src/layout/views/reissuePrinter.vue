<template>
  <div class="printer" v-loading="listLoading">
    <el-backtop v-if="!printing"></el-backtop>
    <sticky :z-index="10" class-name="sub-navbar" v-if="!printing">
      <div class="printer-btns">
        <el-button type="danger" size="mini" @click="print">打印全部</el-button>
      </div>
    </sticky>
    <div id="printContainerId" ref="print">
      <div class="printer-container" v-for="(item, index) in list" :key="index">
        <div class="printer-container-header">
          <h2>{{ item.name }}补发单</h2>
          <el-row :gutter="10">
            <el-col :span="3">
              <div class="printer-container-header-label">订单号:</div>
            </el-col>
            <el-col :span="21">
              <div class="printer-container-header-value">{{ item.item_no }}</div>
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
              <div class="printer-container-header-value">{{ item.created_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</div>
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
          <el-row :gutter="10">
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
          </el-table>
        </div>
        <div class="printer-container-footer">
          <el-row :gutter="20">
            <el-col :span="3" :offset="16">
              <div class="printer-container-header-label">货品总量:</div>
            </el-col>
            <el-col :span="5">
              <div class="printer-container-header-value">{{ item.product_num }}</div>
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
import { getPrintOutOrders } from '@/api/stockout'
import Sticky from '@/components/Sticky'

export default {
  name: 'ReissuePrinter',
  components: { Sticky },
  computed: {
    selectOrderIds() {
      return JSON.parse(localStorage.getItem('selectStockoutIds'))
    }
  },
  created() {
    this.getOrders()
  },
  data() {
    return {
      printing: false,
      listLoading: false,
      list: []
    }
  },
  methods: {
    getOrders() {
      this.listLoading = true
      getPrintOutOrders({ 'ids' : this.selectOrderIds }).then(res => {
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
