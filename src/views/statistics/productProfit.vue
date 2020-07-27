<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="filter-item-btn">
        <el-button class="filter-item pan-btn light-blue-btn" type="primary" icon="el-icon-search" @click="handleFilter">
          查询
        </el-button>
      </div>
      <el-select v-model="listQuery.type" style="width: 140px" class="filter-item" @change="handleFilter" placeholder="统计方式">
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
    </div>
    <div class="sub-navbar">
      <div class="sub-navbar-title">{{ title }}</div>
    </div>
    <doubleLines :chart-data="lineChartData" />
    <div>
      <el-row :gutter="12">
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="sumary-title">今天</div>
            <div class="sumary-value">产品利润:{{ sumary.today_product }}</div>
            <div class="sumary-value">收取运费:{{ sumary.today_shipping }}</div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="sumary-title">昨天</div>
            <div class="sumary-value">产品利润:{{ sumary.yesterday_product }}</div>
            <div class="sumary-value">收取运费:{{ sumary.yesterday_shipping }}</div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="sumary-title">最近7天</div>
            <div class="sumary-value">产品利润:{{ sumary.week_product }}</div>
            <div class="sumary-value">收取运费:{{ sumary.week_shipping }}</div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="sumary-title">总共</div>
            <div class="sumary-value">产品利润:{{ sumary.all_product }}</div>
            <div class="sumary-value">收取运费:{{ sumary.all_shipping }}</div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { getProductProfitSumary, getProductProfit } from '@/api/report'
import doubleLines from './components/doubleLines';

export default {
  name: 'ProductProfit',
  components: { doubleLines },
  computed: {
    sumaryTypeOptions() {
      return this.$store.state.const.sumaryTypeOptions
    }
  },
  data() {
    return {
      title: '产品利润统计',
      lineChartData: {
        xAxis: [],
        firstName: '产品利润',
        firstData: [],
        secName: '收取运费',
        secData:[]
      },
      listQuery: {
        type:'',
        time: ''
      },
      timeValueFormat: 'yyyy-MM-dd',
      timeDisable: false,
      sumary: {
        today_product: 0.00,
        today_shipping: 0.00,
        yesterday_product: 0.00,
        yesterday_shipping: 0.00,
        week_product: 0.00,
        week_shipping: 0.00,
        all_product: 0.00,
        all_shipping: 0.00
      }
    }
  },
  created() {
    this.handleFilter()
    this.getProfitSumary()
  },
  methods: {
    handleFilter() {
      getProductProfit(this.listQuery).then(res => {
        this.lineChartData.xAxis = res.response.x_axis
        this.lineChartData.firstData = res.response.first_data
        this.lineChartData.secData = res.response.sec_data
      }).catch(() => {})
    },
    getProfitSumary() {
      getProductProfitSumary(this.listQuery).then(res => {
        this.sumary = res.response
      }).catch(() => {})
    },
    changeType() {
      this.timeDisable = false;
      if (this.listQuery.type === 'all') {
        this.timeDisable = true
      }
      this.handleFilter()
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
