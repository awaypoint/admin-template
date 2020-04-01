<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <el-button type="primary" size="small" @click="handleEdit()">Edit</el-button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import router, { resetRouter, asyncRoutes, constantRoutes } from '@/router'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name',
      'avatar'
    ])
  },
  methods: {
    handleEdit() {
      let asyncR = asyncRoutes
      router.addRoutes(asyncR)
      resetRouter()
      console.log('d')
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
