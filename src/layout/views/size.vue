<template>
  <div class="printer" v-loading="listLoading">
    <el-backtop v-if="!printing"></el-backtop>
    <sticky :z-index="10" class-name="sub-navbar" v-if="!printing">
      <div class="printer-btns">
        <el-button type="danger" size="mini" @click="print">打印</el-button>
      </div>
    </sticky>
    <div id="printContainerId" ref="print">
      <div class="printer-container-table">
        <div class="printer-container-talbe-title">
          货号:
          <span>{{ list.product_cargo_number }}</span>
        </div>
        <el-table
          :key="1"
          :data="list.size_table_data"
          border
          fit
          style="width: 100%;"
        >
          <el-table-column label="尺码" width="80px" align="center" prop="size"></el-table-column>
          <el-table-column v-for="(column, index) in list.size_table" :key="index" :label="column.label" min-width="100px" align="center" :prop="'key'+column.label">
            <template slot-scope="scope">
              <span v-if="scope.row['key' + column.label] > 0">{{ scope.row['key' + column.label] }}cm</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="priniter-container-table-footer">
          说明:
          <span>平铺尺寸，允许误差1-3cm</span>
        </div>
      </div>
      <div class="printer-container-table">
        <div class="printer-container-talbe-title">
          Product ID:
          <span>{{ list.product_cargo_number }}</span>
        </div>
        <el-table
          :key="1"
          :data="list.size_table_data"
          border
          fit
          style="width: 100%;"
        >
          <el-table-column label="Size" width="80px" align="center" prop="size"></el-table-column>
          <el-table-column v-for="(column, index) in list.size_table" :key="index" :label="sizeTableEnMap[column.label]" min-width="100px" align="center" :prop="'key'+column.label">
            <template slot-scope="scope">
              <span v-if="scope.row['key' + column.label] > 0">{{ scope.row['key' + column.label] }}cm</span>
              <el-divider direction="vertical"></el-divider>
              <span v-if="scope.row['key' + column.label]">{{ (parseFloat(scope.row['key' + column.label]) * 0.3937).toFixed(2) }}inch</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="priniter-container-table-footer">
          Instructions:
          <span>Title size,allow 1-3 error</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getProductSize } from '@/api/product'
import Sticky from '@/components/Sticky'

export default {
  name: 'SizePrinter',
  components: { Sticky },
  computed: {
    defaultSizeTable() {
      return this.$store.state.const.sizeTableOptions
    },
    sizeTableEnMap() {
      return this.$store.state.const.sizeTableEnMap
    }
  },
  created() {
    this.id = this.$route.query.id
    this.getProductSize()
  },
  data() {
    return {
      id: 0,
      printing: false,
      listLoading: false,
      list: {
        size: [],
        size_table: [],
        size_table_data: []
      }
    }
  },
  methods: {
    getProductSize() {
      this.listLoading = true
      getProductSize({ 'id' : this.id }).then(res => {
        this.list = res.response
        if (res.response.size_table.length === 0) {
          this.list.size_table = this.defaultSizeTable
        }
        this.list.size_table = this.list.size_table.filter(i => i.value)
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      }).catch(() => {
        this.listLoading = false
      })
    },
    print() {
      this.printing = true
      this.$nextTick(() => {
        window.print()
        this.printing = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/.el-divider--horizontal {
  width: 95%;
  margin: 12px auto;
}
/deep/.el-table th, /deep/.el-table td {
    padding: 6px 0;
}
/deep/.el-table .cell {
  white-space: pre-line;
}
.printer {
  width: 900px;
  margin: 0 auto;
  padding: 20px 15px;
}
.printer-btns {
  text-align: right;
}
.printer-container {
  border: 1px solid #606266;
  margin-top: 10px;
}
.printer-container-table {
  margin-top: 20px;
}
.printer-container-talbe-title {
  font-weight: bold;
  text-align: center;
  margin-bottom: 5px;
}
.printer-container-talbe-title span,.priniter-container-table-footer span {
  font-weight: 300;
}
.priniter-container-table-footer {
  font-weight: bold;
  margin: 6px 0;
}
</style>
