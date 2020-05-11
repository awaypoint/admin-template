<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="filter-item-btn">
        <el-button class="filter-item pan-btn light-blue-btn" type="primary" icon="el-icon-search" @click="handleFilter" v-show="checkPermission('getBuyerList')">
          查询
        </el-button>
      </div>
      <el-input v-model="listQuery.buyer_login_id" placeholder="请输入买家名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-date-picker class="filter-item"
        v-model="listQuery.times"
        type="datetimerange"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"
        @change="handleFilter"
      >
      </el-date-picker>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="买家名称" min-width="200px" align="center">
        <template slot-scope="scope">
          <img src="http://amos.alicdn.com/realonline.aw?v=2&uid=etindar&site=cntaobao&s=2&charset=utf-8" class="wangwang-cls">
          <span>{{ scope.row.buyer_login_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="买家id" min-width="170px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.buyer_member_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单数量" width="120px" align="center" sortable>
        <template slot-scope="scope">
          <el-tag>{{ scope.row.order_num }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="订单金额" width="150px" align="center" sortable>
        <template slot-scope="scope">
          <el-tag type="danger"><i class="el-icon-money" style="margin-right: 10px"/>{{ scope.row.order_amount }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="同步时间" width="160px" align="center" sortable prop="created_at">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.created_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="130" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="bottom-end" v-show="checkPermission('updateBuyer')">
            <el-button size="mini"  icon="el-icon-edit" @click="handleUpdate(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="订单列表" placement="bottom-end" v-show="checkPermission('getOrderList')">
            <el-button icon="el-icon-s-order" size="mini" type="primary">
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.page_size"
      @pagination="getList"
    />
    <modifyBuyerDialog ref="modifyBuyerDialog" :row="buyerRow" @handleFilter="handleFilter"></modifyBuyerDialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getBuyerList } from '@/api/buyer'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { checkPermission } from '@/utils/index'
import modifyBuyerDialog from './components/modify';

export default {
  name: 'Buyer',
  components: { Pagination, modifyBuyerDialog },
  computed: {
    ...mapGetters([
      'permissions',
    ]),
    pickerOptions() {
      return this.$store.state.const.pickerOptions
    }
  },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        page_size: 10,
        buyer_login_id: undefined,
        times: [],
        order_by: undefined,
        sort_by: undefined
      },
      buyerRow: {}
    }
  },
  created() {
    this.getList()
  },
  methods: {
    checkPermission(check) {
      return checkPermission(this.permissions, check)
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleUpdate(row) {
      this.buyerRow = row
      this.$refs.modifyBuyerDialog.showDialog('update')
    },
    sortChange(column) {
      this.listQuery.order_by = column.prop
      this.listQuery.sort_by = column.order === "descending" ? 'DESC' : 'ASC'
      this.handleFilter()
    },
    getList() {
      this.listLoading = true
      getBuyerList(this.listQuery).then(res => {
        this.list = res.response.rows
        this.total = res.response.total
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      }).catch(() => {
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/.el-range-input  {
  vertical-align: top;
}
/deep/.el-range-separator {
  vertical-align: top;
}
.wangwang-cls {
  vertical-align: middle;
  margin-right: 5px;
}
</style>
