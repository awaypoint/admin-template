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
    <doubleBar :chart-data="lineChartData" />
    <div>
      <el-row :gutter="12">
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="sumary-title">今天</div>
            <div class="sumary-value">出库:{{ sumary.today_out }}</div>
            <div class="sumary-value">入库:{{ sumary.today_in }}</div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="sumary-title">昨天</div>
            <div class="sumary-value">出库:{{ sumary.yesterday_out }}</div>
            <div class="sumary-value">入库:{{ sumary.yesterday_in }}</div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="sumary-value">出库:{{ sumary.week_out }}</div>
            <div class="sumary-value">入库:{{ sumary.week_in }}</div>
            <div class="sumary-title">最近7天</div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="sumary-title">总共</div>
            <div class="sumary-value">出库:{{ sumary.all_out }}</div>
            <div class="sumary-value">入库:{{ sumary.all_in }}</div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { getStockSumary, getStockStatistics } from '@/api/report'
import doubleBar from './components/doubleBar';

export default {
  name: 'OrderStatistics',
  components: { doubleBar },
  computed: {
    sumaryTypeOptions() {
      return this.$store.state.const.sumaryTypeOptions
    }
  },
  data() {
    return {
      title: '出入库金额统计',
      lineChartData: {
        xAxis: [],
        firstName: '出库金额',
        firstData: [],
        secName: '入库金额',
        secData:[]
      },
      listQuery: {
        type:'',
        time: '',
        shop_id: '',
        api_type: 'amount'
      },
      timeValueFormat: 'yyyy-MM-dd',
      timeDisable: false,
      sumary: {
        today_out: 0.00,
        today_in: 0.00,
        yesterday_out: 0.00,
        yesterday_in: 0.00,
        week_out: 0.00,
        week_in: 0.00,
        all_out: 0.00,
        all_in: 0.00
      }
    }
  },
  created() {
    this.handleFilter()
    this.getStockSumary()
  },
  methods: {
    handleFilter() {
      getStockStatistics(this.listQuery).then(res => {
        this.lineChartData.xAxis = res.response.x_axis
        this.lineChartData.firstData = res.response.first_data
        this.lineChartData.secData = res.response.sec_data
      }).catch(() => {})
    },
    getStockSumary() {
      getStockSumary(this.listQuery).then(res => {
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
