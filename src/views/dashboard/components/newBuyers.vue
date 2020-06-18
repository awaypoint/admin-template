<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>今日新买家</span>
    </div>
    <el-table :data="list" v-loading="listLoading" max-height="500">
      <el-table-column label="买家id" min-width="200" align="center" prop="buyer_login_id">
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
import { getTodayBuyers } from '@/api/report'

export default {
  name: 'newBuyers',
  data() {
    return {
      list: [],
      listLoading: false,
      listQuery: {

      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getTodayBuyers(this.listQuery).then(res => {
        this.list = res.response
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000);
      }).catch(() => {
        this.listLoading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/.el-card__body {
  padding: 0px;
}
</style>
