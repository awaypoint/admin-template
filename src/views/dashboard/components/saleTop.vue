<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>销量排行</span>
      <div class="date-option">
        <el-select v-model="value" placeholder="请选择" clearable size="mini">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
    </div>
    <el-table :data="list">
      <el-table-column label="产品名称" min-width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.order_no | orderNoFilter }}
        </template>
      </el-table-column>
      <el-table-column label="数量" width="195" align="center">
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
      list: null,
      value: '1',
      options: [
        {
          label: '全部',
          value: '1'
        },
        {
          label: '最近一周',
          value: '2'
        },
        {
          label: '最近一个月',
          value: '3'
        }
      ]
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
.clearfix {
  position: relative;
}
.date-option {
  position: absolute;
  width: 150px;
  right: 1px;
  top: 0px;
}
</style>
