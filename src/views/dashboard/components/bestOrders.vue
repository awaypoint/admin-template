<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>超1000元订单</span>
    </div>
    <el-table :data="list">
      <el-table-column label="订单编号" min-width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.order_no | orderNoFilter }}
        </template>
      </el-table-column>
      <el-table-column label="金额" width="195" align="center">
        <template slot-scope="scope">
          ¥{{ scope.row.price | toThousandFilter }}
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>

export default {
  name: 'saleTop',
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        pending: 'danger'
      }
      return statusMap[status]
    },
    orderNoFilter(str) {
      return str.substring(0, 30)
    }
  },
  data() {
    return {
      list: null
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.list = []
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/.el-card__body {
  padding: 0px;
}
</style>
