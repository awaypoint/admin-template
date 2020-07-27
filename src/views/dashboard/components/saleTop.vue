<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>销量排行</span>
      <div class="date-option">
        <el-select v-model="listQuery.type" placeholder="请选择" clearable size="mini" @change="fetchData">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
    </div>
    <el-table :data="list" v-loading="loading" max-height="500">
      <el-table-column label="产品名称" min-width="200" align="left" show-overflow-tooltip>
        <template slot-scope="scope">
          <productPopover :data="scope.row" :reference="scope.row.subject"></productPopover>
        </template>
      </el-table-column>
      <el-table-column label="货号" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.cargo_number }}
        </template>
      </el-table-column>
      <el-table-column label="数量" width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.quantity }}
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
import { bestSale } from '@/api/report'
import productPopover from '@/components/productPopover'

export default {
  name: 'saleTop',
  components: { productPopover },
  data() {
    return {
      loading: false,
      list: null,
      listQuery: {
        type: '1'
      },
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
      this.loading = true
      bestSale(this.listQuery).then(res => {
        this.list = res.response
        setTimeout(() => {
          this.loading = false
        }, 0.5 * 1000);
      }).catch(() => {
        this.loading = false
      })
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
