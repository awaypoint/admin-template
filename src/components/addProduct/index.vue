<template>
  <el-popover
    placement="right"
    width="600"
    trigger="manual"
    v-model="visible"
    popper-class="popper-class-name"
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
          @keyup.enter.native="handleFilter"
        >
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </div>
      <el-table 
        ref="addProductTableRef"
        v-loading="listLoading"
        :data="gridData"
        width="100%"
        max-height="500px"
        @selection-change="handleSelect"
      >
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column label="图片" width="100px">
          <template  slot-scope="scope">
            <img :src="scope.row.image" style="height:64px;width:64px;">
          </template>
        </el-table-column>
        <el-table-column min-width="250" property="address" label="产品名称" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.subject }}</span>
          </template>
        </el-table-column>
        <el-table-column width="100" label="货号">
          <template slot-scope="scope">
            <span>{{ scope.row.cargo_number }}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.page_size"
        layout="total, prev, pager, next"
        @pagination="getList"
      />
      <div class="add-product-insert-btn">
        <el-button size="mini" type="primary" @click="choose">选好了</el-button> 
        <el-button size="mini" type="" @click="close">关闭</el-button> 
      </div>
    </div>
    <el-button type="primary" slot="reference" size="small" :icon="btnIcon" @click="click" class="add-product-btn-cls">添加产品</el-button>
  </el-popover>
</template>

<script>
import { getSkuProducts } from '@/api/product'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

const pageSize = 8
let mockGridData = []
for(let i = 0; i < pageSize; i++) {
  mockGridData.push({ id: 'mock' + i })
}

export default {
  name: 'addProduct',
  components: { Pagination },
  data() {
    return {
      listLoading: false,
      visible: false,
      btnIcon: 'el-icon-s-goods',
      total: 0,
      listQuery: {
        page: 1,
        page_size: pageSize,
        query: undefined
      },
      multipleSelection: [],
      pageSelection: [],
      gridData: [],
      tagTypeArr: ['info', 'warning', '', 'success',  'danger']
    }
  },
  computed: {
    selected() {
      return this.$store.state.addproduct.selected
    }
  },
  methods: {
    click() {
      this.visible = !this.visible
      this.btnIcon = this.visible ? 'el-icon-close' : 'el-icon-s-goods'
      if (this.visible) {
        this.resetComponent()
        this.handleFilter()
      }
    },
    resetComponent() {
      this.listQuery.query = ''
      this.multipleSelection = []
      this.pageSelection = []
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    getList() {
      this.listLoading = true
      this.setMultSelect()
      getSkuProducts(this.listQuery).then(res => {
        const that = this
        console.log(res, 'resd')
        const response = res.response
        that.gridData = response.rows
        // that.total = response.total
        console.log(that.gridData, 'res')
        // if (that.gridData.length > 0 && that.selected.length > 0) {
        //   that.$nextTick(() => {
        //     that.gridData.forEach(data => {
        //       if (that.selected.indexOf(data.id) > -1) {
        //         that.$refs.addProductTableRef.toggleRowSelection(data)
        //       }
        //     })
        //   })
        // }
        setTimeout(() => {
          this.listLoading = false
        }, 0.3 * 1000)
      }).catch(() => {
        this.listLoading = false
      })
    },
    close() {
      this.visible = false
      this.btnIcon = 'el-icon-s-goods'
    },
    choose() {
      this.setMultSelect()
      // this.close()
      this.$emit('insertProduct', this.multipleSelection)
    },
    handleSelect(selection) {
      this.pageSelection = selection
    },
    setMultSelect() {
      if (this.pageSelection.length > 0) {
        this.pageSelection.forEach( pageSelect => {
          if (this.selected.indexOf(pageSelect.id) === -1) {
            this.multipleSelection.push(pageSelect)
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/.pagination-container {
  padding: 0;
  margin-top: 10px;
  text-align: left;
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
.add-product-insert-btn {
  position: absolute;
  right: 13px;
  bottom: 13px;
}
/deep/.el-table .warning-row {
  background: oldlace;
}

/deep/.el-table .success-row {
  background: #f0f9eb;
}
.popper-class-name {
  height: 500px;
}
</style>
