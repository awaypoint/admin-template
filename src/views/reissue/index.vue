<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="filter-item-btn">
        <el-button class="filter-item pan-btn light-blue-btn" type="primary" icon="el-icon-search" v-show="checkPermission('getStockOutList')" @click="handleFilter">
          查询
        </el-button>
      </div>
      <el-input v-model="listQuery.item_no" placeholder="请输入出库单号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <buyerSelect ref="buyerSelectRef" @selectBuyer="selectBuyer" :styleStr="styleStr"></buyerSelect>
      <el-input v-model="listQuery.shipping_no" placeholder="请输入快递单号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-date-picker class="filter-item"
        v-model="listQuery.times"
        type="datetimerange"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"
        @change="handleFilter"
        :row-class-name="tableRowClassName"
      >
      </el-date-picker>
    </div>

    <el-table
      row-key="id"
      ref="listTable"
      v-loading="listLoading"
      :data="list"
      lazy
      :load="load"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      :tree-props="{ hasChildren: 'hasChildren' }"
      :row-class-name="tableRowClassName"
      @sort-change="sortChange"
      @row-click="handleClick"
    >
      <el-table-column label="出库单号" min-width="200px" align="center" prop="item_no">
        <template slot-scope="scope">
          <a class="item-no-cls" @click="clickItemNo(scope.row)">{{ scope.row.item_no }}</a>
        </template>
      </el-table-column>
      <el-table-column label="买家" width="200px" align="center" prop="buyer_login_id">
      </el-table-column>
      <el-table-column label="出库数量" min-width="120px" align="center" prop="quantity">
      </el-table-column>
      <el-table-column label="运费" min-width="120px" align="center" prop="shipping_fee">
      </el-table-column>
      <el-table-column label="已补/缺货" min-width="120px" align="center" prop="lack_quantity">
        <template slot-scope="scope" v-if="!scope.row.leaf">
          <el-tag type="success" effect="dark">{{ scope.row.reissue_quantity }}</el-tag>
          <el-tag type="danger" effect="dark">{{ scope.row.lack_quantity }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="出库时间" width="160px" align="center" sortable prop="created_at">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.created_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="130px" class-name="small-padding fixed-width" prop="operate">
        <template slot-scope="scope">
          <el-button size="mini" icon="el-icon-edit" v-show="checkPermission('updateStockOut') && !scope.row.leaf" @click="handleAdd(scope.row)">补发</el-button>
          <el-button icon="el-icon-delete" size="mini" type="danger" v-show="checkPermission('delStockOut') && !scope.row.leaf" @click="handleDelete(scope.row.id)">撤销
          </el-button>
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
    <modifyReissue ref="modifyReissueDialog" :row="stockoutRow" @handleFilter="handleFilter"></modifyReissue>
    <modifyStockOut ref="modifyStockOutDialog" :row="stockoutRow" @handleFilter="handleFilter"></modifyStockOut>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getStockOutList } from '@/api/stockout'
import { getReissueItems } from '@/api/reissue'
import Pagination from '@/components/Pagination'
import { checkPermission } from '@/utils/index'
import modifyReissue from './components/modify'
import modifyStockOut from '../stockout/components/modify'
import buyerSelect from '@/components/buyerSelect'

export default {
  name: 'Reissue',
  components: { Pagination, modifyStockOut, buyerSelect, modifyReissue  },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true,
      btnLoding: false,
      listQuery: {
        api_type: 'reissue',
        page: 1,
        page_size: 10,
        item_no: undefined,
        shipping_no: undefined,
        order_by: undefined,
        sort_by: undefined,
        buyer_member_id: undefined
      },
      stockoutRow: {},
      styleStr: 'display: inline-block;vertical-align: middle;margin-bottom: 10px;width:150px;'
    }
  },
  computed: {
    ...mapGetters([
      'permissions'
    ]),
    pickerOptions() {
      return this.$store.state.const.pickerOptions
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
    handleAdd(row) {
      this.stockoutRow = row
      this.$refs.modifyReissueDialog.showDialog('create')
    },
    handleUpdate(row) {
      this.stockoutRow = row
      this.$refs.modifyReissueDialog.showDialog('update')
    },
    sortChange(column) {
      this.listQuery.order_by = column.prop
      this.listQuery.sort_by = column.order === "descending" ? 'DESC' : 'ASC'
      this.handleFilter()
    },
    getList() {
      this.listLoading = true
      getStockOutList(this.listQuery).then(res => {
        this.list = res.response.rows
        this.total = res.response.total
        this.list.map(l => {
          this.$refs.listTable.toggleRowExpansion(l, false)
        })
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleDelete(id) {
      this.$confirm('此操作将永久删除该出库单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        del({ 'id': id }).then((res) => {
          this.$message({ message: res.codemsg || '操作成功', type: 'success', showClose: true })
          this.handleFilter()
        })
      }).catch(() => {})
    },
    selectBuyer(value) {
      this.listQuery.buyer_member_id = value
      this.handleFilter()
    },
    tableRowClassName({ row, rowIndex }) {
      if (typeof(row.leaf) === 'undefined' || !row.leaf) {
        return '';
      }
      return 'success-row';
    },
    handleClick(row, index, e) {
      if (index.property !== 'operate' && row.hasChildren) {
        const expanded = this.$refs.listTable.store.states.treeData[row.id].expanded || false
        if (!expanded) {
          this.$refs.listTable.store.states.treeData[row.id].loaded = false
        }
        this.$refs.listTable.store.loadOrToggle(row)
      }
    },
    load(row, treeNode, resolve) {
      const params = {
        stock_out_id: row.id
      }
      getReissueItems(params).then( res => {
        setTimeout(() => {
          resolve(res.response)
        }, 0.3 * 1000);
      }).catch(() => {
        resolve()
      })
    },
    clickItemNo(row) {
      this.stockoutRow = row
      if (typeof(row.leaf) !== 'undefined' && !row.leaf) {
        this.$refs.modifyStockOutDialog.showDialog('view')
        return
      }
      this.stockoutRow.id = this.stockoutRow.real_id
      this.$refs.modifyReissueDialog.showDialog('view')
    }
  }
}
</script>
<style lang='scss' scoped>
/deep/.el-table .success-row {
  background: #f0f9eb;
}
.item-no-cls {
  color: #409EFF;
  cursor: pointer;
}
</style>
