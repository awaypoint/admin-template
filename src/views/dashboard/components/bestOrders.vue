<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>今日超1000元订单</span>
    </div>
    <el-table :data="list" v-loading="listLoading" max-height="500">
      <el-table-column label="订单编号" min-width="200" align="center" prop="order_id">
        <template slot-scope="scope">
          <a class="item-no-cls" @click="handleOrderView(scope.row)">{{ scope.row.order_id }}</a>
        </template>
      </el-table-column>
      <el-table-column label="金额" width="195" align="center" prop="total_amount">
      </el-table-column>
    </el-table>
    <modifyOrderDialog ref="modifyOrderDialog" :row="orderRow" @handleFilter="handleFilter" @handleStock="handleStock"></modifyOrderDialog>
    <modifyStockDialog ref="modifyStockOutDialogRef" :row="stockoutRow" @handleFilter="handleFilter"></modifyStockDialog>
  </el-card>
</template>

<script>
import { getOverOrders } from '@/api/report'
import modifyOrderDialog from '@/views/order/components/modify';
import modifyStockDialog from '@/views/stockout/components/modify';

export default {
  name: 'bestOrders',
  components: { modifyOrderDialog, modifyStockDialog },
  data() {
    return {
      listLoading: false,
      listQuery: {

      },
      list: [],
      orderRow: {},
      stockoutRow: {}
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getOverOrders(this.listQuery).then(res => {
        this.list = res.response
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000);
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleOrderView(row) {
      this.orderRow = row
      this.$refs.modifyOrderDialog.showDialog('view')
    },
    handleFilter() {
      return
    },
    handleStock(orderId) {
      this.stockoutRow.order_id = orderId
      this.stockoutRow.api_type = 'order'
      setTimeout(() => {
        this.$refs.modifyStockOutDialogRef.showDialog('create')
      }, 0.5 * 1000);
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/.el-card__body {
  padding: 0px;
}
</style>
