<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="filter-item-btn">
        <el-button class="filter-item pan-btn light-blue-btn" type="primary" icon="el-icon-search" @click="handleFilter">
          查询
        </el-button>
      </div>
      <el-select v-model="listQuery.type" style="width: 140px" class="filter-item" @change="changeType" placeholder="统计方式">
        <el-option v-for="item in sumaryTypeOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-date-picker class="filter-item"
        v-model="listQuery.time"
        :type="listQuery.type"
        align="right"
        placeholder="请选择时间"
        :value-format="timeValueFormat"
        :disabled="timeDisable"
        @change="handleFilter"
      >
      </el-date-picker>
      <productCombine ref="productCombineRef" @select="selectProductCombine"/>
    </div>
    <div class="sub-navbar">
      <div class="sub-navbar-title">{{ title }}</div>
    </div>
    <lineAndBar :chart-data="lineChartData" />
    <div>
      <el-row :gutter="12">
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="sumary-title">今天</div>
            <div class="sumary-value">{{ sumary.today }}</div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="sumary-title">昨天</div>
            <div class="sumary-value">{{ sumary.yesterday }}</div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="sumary-title">最近7天</div>
            <div class="sumary-value">{{ sumary.week }}</div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="sumary-title">总共</div>
            <div class="sumary-value">{{ sumary.all }}</div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { getProductSale, getProductSaleSumary } from '@/api/report'
import lineAndBar from './components/lineAndBar';
import productCombine from '@/components/productCombine';

export default {
  name: 'OrderStatistics',
  components: { lineAndBar, productCombine },
  computed: {
    sumaryTypeOptions() {
      return this.$store.state.const.sumaryTypeOptions
    },
    query() {
      return this.$store.state.const.query
    }
  },
  created() {
    if (this.query) {
      const query = this.query
      this.listQuery = Object.assign(this.listQuery, query)
      this.$nextTick(() => {
        this.setProductCombine(query)
      })
    }
    this.handleFilter()
    this.$store.dispatch('const/clearQuery')
  },
  data() {
    return {
      title: '产品销售分析',
      lineChartData: {
        xAxis: [],
        lineName: '销售数量',
        lineData: [],
        barName: '累积销量',
        barData:[]
      },
      listQuery: {
        type:'',
        time: '',
        shop_id: '',
        product_id: '',
        cargo_number: ''
      },
      timeValueFormat: 'yyyy-MM-dd',
      timeDisable: false,
      sumary: {
        today: 0,
        yesterday: 0,
        week: 0,
        all: 0
      }
    }
  },
  methods: {
    handleFilter() {
      getProductSale(this.listQuery).then(res => {
        this.lineChartData.xAxis = res.response.x_axis
        this.lineChartData.lineData = res.response.line_data
        this.lineChartData.barData = res.response.bar_data
      }).catch(() => {})
      getProductSaleSumary(this.listQuery).then(res => {
        this.sumary = res.response
      }).catch(() => {})
    },
    selectProductCombine(query) {
      this.listQuery.product_id = query.product_id
      this.listQuery.cargo_number = query.cargo_number
      this.handleFilter()
    },
    changeType() {
      this.timeDisable = false;
      if (this.listQuery.type === 'all') {
        this.timeDisable = true
      }
      this.handleFilter()
    },
    setProductCombine(params) {
      this.$refs.productCombineRef.setValue(params)
    }
  }
}
</script>
<style lang="scss" scoped>
.sumary-value {
  text-align: center;
  margin-top: 10px;
  font-size: 28px;
}
.sumary-title {
  text-align: center;
}
</style>
