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
      <shopSelect ref="selectShopRef" :isQuery="true" @selectShop="selectShop"></shopSelect>
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
import { getOrderStatistics, getOrderSumary } from '@/api/report'
import lineAndBar from './components/lineAndBar';
import shopSelect from '@/components/shopSelect'

export default {
  name: 'OrderStatistics',
  components: { lineAndBar, shopSelect },
  computed: {
    sumaryTypeOptions() {
      return this.$store.state.const.sumaryTypeOptions
    }
  },
  data() {
    return {
      title: '订单统计',
      lineChartData: {
        xAxis: [],
        lineName: '订单金额',
        lineData: [],
        barName: '订单数量',
        barData:[]
      },
      listQuery: {
        type:'',
        time: '',
        shop_id: ''
      },
      timeValueFormat: 'yyyy-MM-dd',
      timeDisable: false,
      sumary: {
        today: 0.00,
        yesterday: 0.00,
        week: 0.00,
        all: 0.00
      }
    }
  },
  created() {
    this.handleFilter()
  },
  methods: {
    handleFilter() {
      getOrderStatistics(this.listQuery).then(res => {
        this.lineChartData.xAxis = res.response.x_axis
        this.lineChartData.lineData = res.response.line_data
        this.lineChartData.barData = res.response.bar_data
      }).catch(() => {})
      getOrderSumary(this.listQuery).then(res => {
        this.sumary = res.response
      }).catch(() => {})
    },
    changeType() {
      this.timeDisable = false;
      if (this.listQuery.type === 'all') {
        this.timeDisable = true
      }
      this.handleFilter()
    },
    selectShop(shopId) {
      this.listQuery.shop_id = shopId
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
