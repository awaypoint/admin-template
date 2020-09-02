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
            <el-form-item label="买家">
              <buyerSelect ref="buyerSelectRef" :type="2" @selectBuyer="selectBuyer" :disabled="temp.order_id !== '' || isView"></buyerSelect>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="temp.order_id">
            <el-form-item label="订单号">
              <el-input v-model="temp.order_id" readonly/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="运费">
              <el-input v-model="temp.shipping_fee" :readonly="isView"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="快递单号">
              <el-input v-model="temp.shipping_no" :readonly="isView"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="temp.remark" type="textarea" :readonly="isView"/>
        </el-form-item>
      </el-form>
      <el-divider></el-divider>
      <div v-if="dialogStatus === 'create'">
        <productBtnGroup templateType="stockout" @insertProduct="insertProduct"></productBtnGroup>
      </div>
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
          <template slot="header" slot-scope="scope">
            <div :class="priceCls">
              <span>出库价格</span>
              <el-input
                v-if="dialogStatus === 'create'"
                v-model="diff"
                size="mini"
                @mousewheel.native.prevent 
                @input="multPrice"
                placeholder="每件减x元"/>
            </div>
          </template>
          <template slot-scope="scope" v-if="!scope.row.leaf">
            <el-input 
              v-if="dialogStatus === 'create'"
              v-model="scope.row.price"
              class="edit-input"
              size="mini"
              type="number"
              @mousewheel.native.prevent 
              @input="sumary"
            />
            <span v-else>{{ scope.row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="dialogStatus === 'create'" label="库存" width="100px" align="center" prop="stock">
          <template slot-scope="scope">
            <span>{{ scope.row.stock }}</span>
          </template>
        </el-table-column>
        <el-table-column label="数量" min-width="150px" align="center" prop="quantity">
          <template slot-scope="scope">
            <div :class="priceCls">
              <div v-if="temp.order_id" class="price-div">
                <el-tag type="info" size="small">{{ scope.row.order_quantity || 0 }}</el-tag>/
              </div>
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
              <span v-else>{{ scope.row.quantity }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="缺货" width="100px" align="center" prop="lack_quantity">
          <template slot-scope="scope">
            <el-input 
              v-if="dialogStatus === 'create' && scope.row.leaf"
              v-model="scope.row.lack_quantity"
              class="edit-input"
              type="number"
              size="mini"
              min="0"
              @input="sumary"
            />
            <el-tag v-else-if="!scope.row.leaf" size="small">{{ scope.row.lack_quantity }}</el-tag>
            <span v-else>{{ scope.row.lack_quantity }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="dialogStatus === 'create'" label="操作" align="center" min-width="130" class-name="small-padding fixed-width">
          <template slot-scope="scope" v-if="!scope.row.leaf">
            <el-tooltip class="item" effect="dark" content="删除" placement="bottom-end">
              <el-button icon="el-icon-delete" size="mini" type="danger" @click="delRow(scope.$index)">
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog">取消</el-button>
        <el-button 
          type="primary" 
          size="small" 
          @click="dialogStatus==='create' ? submit($event) : closeDialog()"
          :loading="btnLoding"
        >确认</el-button>
        <el-button type="success" size="small" @click="handlePrinte">打印</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addStockOut, getStockOutDetail } from '@/api/stockout'
import { getOrderDetail } from '@/api/order'
import { getExportProducts } from '@/api/product'
import buyerSelect from '@/components/buyerSelect'
import productBtnGroup from '@/components/productBtnGroup';
import productPopover from '@/components/productPopover'

export default {
  name: 'modifyStockOut',
  components: { buyerSelect, productBtnGroup, productPopover },
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
        update: '编辑出库单',
        create: '添加出库单',
        view: '查看出库单'
      },
      dialogShow: false,
      dialogStatus: '',
      btnLoding: false,
      sumPrice: 0,
      sumQuantity: 0,
      lackQuantity: 0,
      diff: '',
      priceCls: '',
      isView: false,
      temp: {},
      defaultTemp: {
        id: undefined,
        order_id: '',
        buyer_member_id: '',
        shipping_fee: '',
        remark: '',
        shipping_no: '',
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
      this.isView = this.dialogStatus !== 'create'
      this.$nextTick(() => {
        if (status === 'create') {
          if (typeof(this.row.api_type) !== 'undefined' && this.row.api_type === 'order') {
            this.getOrderDetail(this.row.order_id)
          } else {
            this.resetForm('dialogForm')
          }
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
      this.$store.dispatch('addproduct/setSelected', this.temp.goods)
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields()
      }
      this.$refs.buyerSelectRef.setValue(0)
    },
    handleFilter() {
      this.$emit('handleFilter')
    },
    submit(event) {
      this.$refs['dialogForm'].validate((valid) => {
        if (valid) {
          this.btnLoding = true
          addStockOut(this.temp).then((res) => {
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
      getStockOutDetail({id: id}).then(res => {
        this.temp = res.response
        this.priceCls = 'price-cls'
        if (this.dialogStatus === 'view') {
          this.priceCls = 'price-label-cls'
        }
        this.$store.dispatch('addproduct/setSelected', this.temp.goods)
        this.$nextTick(() => {
          this.$refs.buyerSelectRef.setValue(this.temp.buyer_login_id)
        })
        this.sumary()
      }).catch(() => {})
    },
    insertProduct(selected, type) {
      type = type || 'select'
      if (selected.length > 0) {
        if (type === 'select') {
          selected.forEach(sel => {
            sel.lack_quantity = ''
            this.pushProduct(sel)
          })
          this.sumary()
          this.$store.dispatch('addproduct/setSelected', this.temp.goods)
        }else {
          getExportProducts({ data: selected, ext: ['单价', '数量'] }).then(res => {
            if (res.response.length > 0) {
              res.response.forEach(resp => {
                this.pushProduct(resp)
              })
            }
            this.$nextTick(() => {
              this.sumary()
            })
          })
        }
      }
    },
    delRow(index) {
      this.temp.goods.splice(index, 1)
      this.$store.dispatch('addproduct/setSelected', this.temp.goods)
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
            item.order_quantity = 0
            item.children.forEach(child => {
              const childQuantity = parseInt(child.quantity) || 0
              const childLackQuantity = parseInt(child.lack_quantity) || 0
              const childOrderQuantity = parseInt(child.order_quantity) || 0
              item.quantity += childQuantity
              this.sumQuantity += childQuantity
              this.lackQuantity += childLackQuantity
              item.lack_quantity += childLackQuantity
              this.sumPrice += price * childQuantity
              item.order_quantity += childOrderQuantity
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
    selectBuyer(value) {
      this.temp.buyer_member_id = value
    },
    multPrice() {
      if (this.dialogStatus === 'create' &&  Math.abs(this.diff) > 0 && this.temp.goods.length > 0) {
        this.temp.goods.forEach(good => {
          good.price = parseFloat(good.price) - parseFloat(this.diff)
        })
        this.sumary()
      }
    },
    editQuantity(row) {
      const stock = row.stock * 1
      if (row.quantity > stock) {
        this.$message({ message: '库存不足', type: 'warning', showClose: true })
        row.lack_quantity = row.quantity - stock
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
    getOrderDetail(orderId) {
      const params = {
        id: orderId,
        api_type: 'stockout'
      }
      getOrderDetail(params).then(res => {
        this.temp = res.response
        this.$store.dispatch('addproduct/setSelected', this.temp.goods)
        this.$nextTick(() => {
          this.$refs.buyerSelectRef.setValue(this.temp.buyer_login_id)
        })
        this.sumary()
      }).catch(() => {})
    },
    pushProduct(product) {
      let shouldPush = true
      this.temp.goods.forEach(good => {
        if (good.cargo_number === product.cargo_number) {
          shouldPush = false
          product.children.forEach(child => {
            let childExist = false
            good.children.forEach(gc => {
              if (child.size === gc.size) {
                childExist = true
              }
            })
            if (!childExist) {
              good.children.push(child)
            }
          })
        }
      })
      if (shouldPush) {
        this.temp.goods.push(product)
      }
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
    handlePrinte() {
      const list = [this.row.id]
      this.$store.dispatch('order/setSelectStockout', list)
      const routeData = this.$router.resolve({ path: '/stockoutPrinte' });
      window.open(routeData.href, '_blank');
    }
  }
}
</script>
<style lang="scss" scoped>
.price-cls {
  display: flex;
}
.price-cls span {
  width: 60%;
  margin: 2px 3px 0 0;
}
.price-cls .price-div {
  width: 60%;
}
.price-div {
  display: inline;
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
