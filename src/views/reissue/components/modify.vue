<template>
  <div class="modify-container">
    <el-dialog 
      :close-on-click-modal="false" 
      :title="textMap[dialogStatus]" 
      :visible.sync="dialogShow" 
      width="930px" 
      ref="childForm"
      @close="closeDialog"
    >
      <el-form
        ref="dialogForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="120px"
        class="dialog-form-cls"
      >
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="运费">
              <el-input v-model="temp.shipping_fee" :readonly="readOnly"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="快递单号">
              <el-input v-model="temp.shipping_no" :readonly="readOnly"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="temp.remark" type="textarea" :readonly="readOnly"/>
        </el-form-item>
      </el-form>
      <el-table
        row-key="id"
        :data="temp.goods"
        border
        highlight-current-row
        style="width: 100%;"
        ref="dialogTable"
        default-expand-all
        :summary-method="getSummaries"
        show-summary
        :row-class-name="tableRowClassName"
      >
        <el-table-column type="index" align="center" label="序号" width="50"></el-table-column>
        <el-table-column label="货号/尺码" min-width="150px" align="center" prop='cargo_number'>
          <template slot-scope="scope" >
            <productPopover v-if="!scope.row.leaf" :data="scope.row" :reference="scope.row.cargo_number"></productPopover>
            <span v-else>{{ scope.row.size }}</span>
          </template>
        </el-table-column>
        <el-table-column label="出库价格" width="200px" align="center" prop="price">
          <template slot-scope="scope">
            <span v-if="!scope.row.leaf">{{ scope.row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="dialogStatus === 'create'" label="库存" width="100px" align="center" prop="stock"></el-table-column>
        <el-table-column label="补发数量" min-width="150px" align="center" prop="quantity">
          <template slot-scope="scope">
            <div :class="priceCls">
              <el-input 
                v-if="dialogStatus === 'create' && scope.row.leaf"
                v-model="scope.row.quantity"
                class="edit-input"
                size="mini"
                type="number"
                min="0"
                @mousewheel.native.prevent 
                @input="editQuantity(scope.row)"
              />
              <el-tag v-else-if="!scope.row.leaf" size="small">{{ scope.row.quantity }}</el-tag>
              <span v-else >{{ scope.row.quantity }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column v-if="dialogStatus === 'create'" label="缺货数量" width="100px" align="center" prop="lack_quantity">
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog">取消</el-button>
        <el-button 
          type="primary" 
          size="small" 
          @click="submit($event)"
          :loading="btnLoding"
        >确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getStockOutDetail } from '@/api/stockout'
import { addReissue, getReissueDetail } from '@/api/reissue'
import productPopover from '@/components/productPopover'

export default {
  name: 'modifyReissue',
  components: { productPopover },
  props: {
    row: {
      type: Object,
      required: true
    }
  },
  computed: {
    sizeSort() {
      return this.$store.state.const.sizeSort
    }
  },
  data() {
    return {
      textMap: {
        update: '编辑补发单',
        create: '添加补发单',
        view: '查看补发单'
      },
      dialogShow: false,
      dialogStatus: '',
      readOnly: false,
      btnLoding: false,
      sumPrice: 0,
      sumQuantity: 0,
      lackQuantity: 0,
      diff: '',
      priceCls: '',
      temp: {},
      defaultTemp: {
        id: undefined,
        stock_out_id: '',
        buyer_member_id: '',
        shipping_fee: '',
        remark: '',
        shipping_no: '',
        shipping_fee: '',
        goods: []
      },
      rules: {}
    }
  },
  watch: {
    row: {
      deep: true,
      handler(val) {}
    }
  },
  methods: {
    showDialog(status) {
      this.dialogStatus = status
      this.dialogShow = true
      this.priceCls = this.dialogStatus === 'create' ? 'price-cls' : 'price-label-cls'
      this.readOnly = this.dialogStatus !== 'create'
      this.$nextTick(() => {
        if (status === 'create') {
          this.getStockOutDetail(this.row.id)
        } else {
          this.getDetail(this.row.id)
        }
      })
    },
    closeDialog() {
      this.dialogShow = false
    },
    resetForm(formName) {
      this.temp = Object.assign({}, this.defaultTemp)
      this.temp.goods = []
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields()
      }
    },
    handleFilter() {
      this.$emit('handleFilter')
    },
    submit(event) {
      if (this.dialogStatus === 'view') {
        this.closeDialog()
        return
      }
      this.$refs['dialogForm'].validate((valid) => {
        if (valid) {
          this.btnLoding = true
          addReissue(this.temp).then((res) => {
            this.$message({ message: res.codemsg || '操作成功', type: 'success', showClose: true })
            this.dialogShow = false
            this.btnLoding = false
            this.handleFilter()
          }).catch(() => {
            this.btnLoding = false
          })
        }
      })
    },
    getDetail(id) {
      getReissueDetail({ id: id }).then(res => {
        this.temp = res.response
        this.priceCls = 'price-label-cls'
        this.sumary()
      }).catch(() => {})
    },
    sumary() {
      this.sumQuantity = 0
      this.sumPrice = 0
      this.lackQuantity = 0
      if (this.temp.goods.length > 0) {
        this.temp.goods.forEach(item => {
          if (typeof(item.children) !== 'undefined' && item.children.length > 0) {
            const price = parseFloat(item.price) || 0
            item.quantity = 0
            item.lack_quantity = 0
            item.children.forEach(child => {
              const childQuantity = parseInt(child.quantity) || 0
              const childLackQuantity = parseInt(child.lack_quantity) || 0
              const childOrderQuantity = parseInt(child.order_quantity) || 0
              item.quantity += childQuantity
              this.sumQuantity += childQuantity
              this.lackQuantity += childLackQuantity
              item.lack_quantity += childLackQuantity
              this.sumPrice += price * childQuantity
            })
            //排序
            item.children = this.setSizeSort(item.children)
          }
        })
      }
    },
    getSummaries({ columns, data }) {
      return columns.map(c => {
        let res = ''
        switch(c.property) {
          case "cargo_number":
            res = '合计'
            break
          case "price":
            res = this.sumPrice
            break
          case "quantity":
            res = this.sumQuantity
            break
          case "lack_quantity":
            res = this.lackQuantity
            break
        }
        return res
      })
    },
    editQuantity(row) {
      const stock = row.stock * 1
      if (row.quantity > stock) {
        this.$message({ message: '【' + row.cargo_number + '】库存不足', type: 'warning', showClose: true })
        row.quantity = stock
      }
      this.sumary()
    },
    tableRowClassName({ row, rowIndex }) {
      if (typeof(row.leaf) === 'undefined' || !row.leaf) {
        return '';
      }
      return 'success-row';
    },
    getStockOutDetail(stockOutId) {
      const params = {
        id: stockOutId,
        api_type: 'reissue'
      }
      getStockOutDetail(params).then(res => {
        this.temp = res.response
        this.sumary()
      }).catch(() => {})
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
  }
}
</script>
<style lang="scss" scoped>
.price-cls {
  display: inline;
}
.price-cls span {
  width: 60%;
  margin: 2px 3px 0 0;
}
.price-cls .price-div {
  width: 60%;
}
.price-cls div {
  margin-left: 3px;
}
.price-label-cls {
  display: block;
}
/deep/.el-table .success-row {
  background: #f0f9eb;
}
</style>
