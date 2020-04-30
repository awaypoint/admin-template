<template>
  <div>
    <el-tooltip class="item" effect="dark" content="添加商品" placement="bottom-end">
      <el-popover
        placement="left"
        width="600"
        trigger="manual"
        v-model="visible"
      >
        <div>
          <div class="filter-container">
            <div class="filter-container-point" @click="close">
              <i class="el-icon-close filter-container-close" />
            </div>
            <el-input
              placeholder="请输入产品名称/货号"
              v-model="listQuery.query"
              style="width: 200px;"
              size="mini"
            >
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </div>
          <el-table :data="gridData" width="100%">
            <el-table-column width="100" property="date" label="货号"></el-table-column>
            <el-table-column width="100" property="name" label="sku"></el-table-column>
            <el-table-column min-width="300" property="address" label="产品名称"></el-table-column>
          </el-table>
          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="listQuery.page"
            :limit.sync="listQuery.page_size"
            :pager-count="5"
            layout="total, prev, pager, next"
            @pagination="handleFilter"
          />
        </div>
        <el-button slot="reference" circle size="mini" :icon="btnIcon" @click="click" class="add-product-btn-cls"></el-button>
      </el-popover>
    </el-tooltip>
  </div>
</template>

<script>
import { prepareAsyn, asynData } from '@/api/system'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'addProduct',
  components: { Pagination },
  data() {
    return {
      visible: false,
      btnIcon: 'el-icon-s-goods',
      total: 5,
      listQuery: {
        page: 1,
        page_size: 10,
        query: undefined
      },
      gridData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }]
    }
  },
  created() {
  },
  methods: {
    click() {
      this.visible = !this.visible
      this.btnIcon = this.visible ? 'el-icon-close' : 'el-icon-s-goods'
    },
    handleFilter() {

    },
    close() {
      this.visible = false
      this.btnIcon = 'el-icon-s-goods'
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/.pagination-container {
  padding: 0;
  margin-top: 10px
}
.add-product-btn-cls {
  font-size: 17px;
}
.filter-container {
  margin-bottom: 10px;
  text-align: right;
}
.filter-container-point {
  position: relative;
  float: left;
  background-color: #F56C6C;
  margin-top: 5px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
}
.filter-container-close {
  position: absolute;
  line-height: normal;
  font-size: 5px;
  left: 0;
  display: none;
}
.filter-container-point:hover .filter-container-close {
  cursor: pointer;
  display: block;
}
</style>
