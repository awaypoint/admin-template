<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <el-button type="primary" size="small" @click.prevent.stop="handleEdit()">Edit</el-button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import router, { resetRouter, asyncRoutes, constantRoutes } from '@/router'
import Driver from 'driver.js' // import driver.js
import 'driver.js/dist/driver.min.css' // import driver.js css
import steps from './steps'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name',
      'avatar'
    ])
  },
  mounted() {
    const driverOptions = {
      doneBtnText: '完成',              // Text on the final button
      closeBtnText: '关闭',            // Text on the close button for this step
      nextBtnText: '下一项',              // Next button text for this step
      prevBtnText: '上一项', 
    }
    const driver = new Driver(driverOptions)
    driver.defineSteps(steps)
    driver.start()
  },
  methods: {
    handleEdit() {

    },
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
