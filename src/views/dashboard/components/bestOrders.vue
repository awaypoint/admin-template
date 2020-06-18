<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>今日超1000元订单</span>
    </div>
    <el-table :data="list" v-loading="listLoading" max-height="500">
      <el-table-column label="订单编号" min-width="200" align="center" prop="order_id">
      </el-table-column>
      <el-table-column label="金额" width="195" align="center" prop="total_amount">
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
import { getOverOrders } from '@/api/report'

export default {
  name: 'bestOrders',
  data() {
    return {
      listLoading: false,
      listQuery: {

      },
      list: []
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
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/.el-card__body {
  padding: 0px;
}
</style>
