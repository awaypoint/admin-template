<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="filter-item-btn">
        <el-button class="filter-item pan-btn light-blue-btn" type="primary" icon="el-icon-search" v-show="checkPermission('getStockList')" @click="handleFilter">
          查询
        </el-button>
      </div>
      <el-input v-model="listQuery.subject" placeholder="请输入产品名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.cargo_number" placeholder="请输入产品货号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <factorySelect ref="factorySelectRef" :isQuery="true" width="150" @selectFactory="selectFactory"></factorySelect>
    </div>

    <el-table
      row-key="id"
      ref="listTable"
      v-loading="listLoading"
      :data="list"
      fit
      style="width: 100%;"
      lazy
      :load="load"
      :tree-props="{ hasChildren: 'hasChildren' }"
      :row-class-name="tableRowClassName"
      show-summary
      :summary-method="getSummaries"
      @sort-change="sortChange"
      @row-click="handleClick"
    >
      <el-table-column label="产品名称" min-width="200px" align="left" prop="subject" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <productPopover :data="scope.row" :reference="scope.row.subject" @click="handleUpdate"></productPopover>
        </template>
      </el-table-column>
      <el-table-column label="价格" width="150px" align="center" prop="price">
        <template slot-scope="scope">
          <span v-if="!scope.row.leaf">
            <el-tag effect="dark" type="success">{{ scope.row.consign_price }}</el-tag>
            <el-tag effect="dark" type="danger">{{ scope.row.platform_price }}</el-tag>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="货号/尺码" min-width="100px" align="center" prop="cargo_number" sortable="custom">
      </el-table-column>
      <el-table-column label="库位" width="80px" align="center" prop="stock">
      </el-table-column>
      <el-table-column label="库存" width="80px" align="center" prop="quantity">
      </el-table-column>
      <el-table-column label="销量" width="80px" align="center" prop="sale">
      </el-table-column>
      <el-table-column label="缺货" width="80px" align="center" prop="lack_quantity">
      </el-table-column>
      <el-table-column label="未发货" width="80px" align="center" prop="waitsend_quantity">
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="100" prop="operate">
        <template scope="scope">
          <div v-if="typeof(scope.row.leaf) === 'undefined' || !scope.row.leaf">
            <el-button size="mini" icon="el-icon-s-data" type="primary" v-show="checkPermission('productSale')" @click="handleSale(scope.row)">销售数据</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <modifyProductDialog ref="modifyProductDialog" :row="productRow" @handleFilter="handleFilter"></modifyProductDialog>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.page_size"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getStockList, getStockItems } from '@/api/stock'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { checkPermission } from '@/utils/index'
import productPopover from '@/components/productPopover'
import factorySelect from '@/components/factorySelect'
import modifyProductDialog from '../product/components/modify'

export default {
  name: 'Stock',
  components: { Pagination, factorySelect, productPopover, modifyProductDialog },
  data() {
    return {
      tableKey: 0,
      expands: [],
      list: [],
      total: 0,
      quantity: 0,
      amount: 0.00,
      listLoading: false,
      listQuery: {
        page: 1,
        page_size: 10,
        subject: undefined,
        cargo_number: undefined,
        factory: undefined,
        order_by: undefined,
        sort_by: undefined
      },
      productRow: {}
    }
  },
  computed: {
    ...mapGetters([
      'permissions'
    ]),
    sizeSort() {
      return this.$store.state.const.sizeSort
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
      this.productRow.id = row.p_id
      this.$refs.modifyProductDialog.showDialog('update')
    },
    sortChange(column) {
      this.listQuery.order_by = column.prop
      this.listQuery.sort_by = column.order === "descending" ? 'DESC' : 'ASC'
      this.handleFilter()
    },
    getList() {
      this.listLoading = true
      getStockList(this.listQuery).then(res => {
        this.list = res.response.rows
        this.total = res.response.total
        this.quantity = res.response.quantity
        this.amount = res.response.amount
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
    tableRowClassName({ row, rowIndex }) {
      if (typeof(row.leaf) === 'undefined' || !row.leaf) {
        return '';
      }
      return 'success-row';
    },
    load(row, treeNode, resolve) {
      const params = {
        product_id: row.product_id,
        cargo_number: row.cargo_number
      }
      getStockItems(params).then( res => {
        //排序
        const result = this.setSizeSort(res.response)
        setTimeout(() => {
          resolve(result)
        }, 0.3 * 1000);
      })
    },
    handleClick(row, index, e) {
      if (index.property !== 'operate' && !row.leaf) {
        const expanded = this.$refs.listTable.store.states.treeData[row.id].expanded || false
        if (!expanded) {
          this.$refs.listTable.store.states.treeData[row.id].loaded = false
        }
        this.$refs.listTable.store.loadOrToggle(row)
      }
    },
    selectFactory(value) {
      this.listQuery.factory = value
      this.handleFilter()
    },
    getSummaries() {
      return ['合计', '库存金额:' + this.amount, '库存数量:' + this.quantity]
    },
    setSizeSort(children) {
      const that = this
      let result = []
      let noControl = []
      children.forEach(c => {
        that.sizeSort.every(size => {
          if (c.size === size) {
            result.push(c)
            return false
          } 
          noControl.push(c)
        })
      })
      if (noControl.length > 0) {
        result = result.concat(noControl)
      }
      return result
    },
    handleSale(row) {
      const query = {
        product_id: row.product_id,
        cargo_number: row.cargo_number,
        subject: row.subject
      }
      this.$store.dispatch('const/setQuery', query)
      this.$router.push('/statistics/selling')
    }
  }
}
</script>
<style lang='scss' scoped>
/deep/.el-table .warning-row {
  background: oldlace;
}

/deep/.el-table .success-row {
  background: #f0f9eb;
}
</style>
