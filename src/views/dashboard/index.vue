<template>
  <div class="dashboard-container">
    <panel-group @handleSetLineChartData="handleSetLineChartData" />
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" />
    </el-row>
    <el-row :gutter="8">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 10}" :xl="{span: 10}" style="padding-right:8px;margin-bottom:30px;">
        <saleTop></saleTop>
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 6}" :xl="{span: 6}" style="padding-right:8px;margin-bottom:30px;">
        <newBuyers></newBuyers>
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 8}" :xl="{span: 8}" style="padding-right:8px;margin-bottom:30px;">
        <bestOrders></bestOrders>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import router, { resetRouter, asyncRoutes, constantRoutes } from '@/router'
import Driver from 'driver.js' // import driver.js
import 'driver.js/dist/driver.min.css' // import driver.js css
import steps from './steps'
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import saleTop from './components/saleTop'
import newBuyers from './components/newBuyers'
import bestOrders from './components/bestOrders';

export default {
  name: 'Dashboard',
  components: {
    PanelGroup,
    LineChart,
    saleTop,
    newBuyers,
    bestOrders
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar'
    ])
  },
  data() {
    return {
      lineChartData: {
        name: '',
        xAxis: [],
        data: []
      }
    }
  },
  mounted() {
    if (this.$store.state.user.guided === '0') {
      const driverOptions = {
        doneBtnText: '完成',              // Text on the final button
        closeBtnText: '关闭',            // Text on the close button for this step
        nextBtnText: '下一项',              // Next button text for this step
        prevBtnText: '上一项', 
        allowClose: false
      }
      const driver = new Driver(driverOptions)
      driver.defineSteps(steps)
      driver.start()
    }
  },
  methods: {
    handleSetLineChartData(name, xAxis, data) {
      this.lineChartData = { name: name, xAxis: xAxis, data: data }
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
