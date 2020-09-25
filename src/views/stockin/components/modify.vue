<template>
  <div class="modify-container">
    <el-dialog 
      :close-on-click-modal="false" 
      :title="textMap[dialogStatus]" 
      :visible.sync="dialogShow"
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      width="800px" 
      ref="childForm"
      @close="closeDialog"
      :row-class-name="tableRowClassName"
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
            <el-form-item label="入库来源厂家" prop="factory">
              <factorySelect ref="factorySelectRef" @selectFactory="selectFactory" :disabled="readOnly"></factorySelect>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="运费" prop="desc">
          <el-input v-model="temp.shipping" :readOnly="readOnly"/>
        </el-form-item>
        <el-form-item label="备注" prop="desc">
          <el-input v-model="temp.remark" type="textarea" :readOnly="readOnly"/>
        </el-form-item>
      </el-form>
      <el-divider></el-divider>
      <productBtnGroup v-if="!readOnly" templateType="stockin" @insertProduct="insertProduct"></productBtnGroup>
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
        <el-table-column label="序号" type="index" width="50" align="center">
        </el-table-column>
        <el-table-column label="货号/尺码" min-width="150px" align="center" prop='cargo_number'>
          <template slot-scope="scope" >
            <productPopover v-if="!scope.row.leaf" :data="scope.row" :reference="scope.row.cargo_number"></productPopover>
            <span v-else>{{ scope.row.size }}</span>
          </template>
        </el-table-column>
        <el-table-column label="入库价格" min-width="100px" align="center" prop="price">
          <template slot-scope="scope" v-if="!scope.row.leaf">
            <el-input 
              v-if="dialogStatus === 'create'"
              v-model="scope.row.price"
              class="edit-input"
              size="small"
              :readonly="readOnly"
              @input="sumary"
            />
            <span v-else>{{ scope.row.quantity }}</span>
          </template>
        </el-table-column>
        <el-table-column label="数量" min-width="140px" align="center">
          <template slot-scope="scope">
            <el-input 
              v-if="dialogStatus === 'create' && scope.row.leaf"
              v-model="scope.row.quantity"
              class="edit-input"
              size="small"
              :readOnly="!scope.row.leaf"
              @input="sumary"
            />
            <el-tag v-else-if="!scope.row.leaf" size="small">{{ scope.row.quantity }}</el-tag>
            <span v-else>{{ scope.row.quantity }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="130" class-name="small-padding fixed-width" v-if="!readOnly">
          <template slot-scope="scope">
            <el-button v-if="!scope.row.leaf" icon="el-icon-delete" size="mini" type="danger" @click="delRow(scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog">取消</el-button>
        <el-button 
          type="primary" 
          size="small" 
          @click="dialogStatus==='create'?submit($event):closeDialog()"
          :loading="btnLoding"
        >确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addStockIn, getStockInDetail } from '@/api/stockin'
import { getExportProducts } from '@/api/product'
import factorySelect from '@/components/factorySelect'
import productPopover from '@/components/productPopover'
import productBtnGroup from '@/components/productBtnGroup'

export default {
  name: 'modifyStockIn',
  components: { factorySelect, productPopover, productBtnGroup },
  props: {
    row: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      textMap: {
        update: '编辑入库单',
        create: '添加入库单',
        view: '查看入库单'
      },
      readOnly: false,
      dialogShow: false,
      dialogStatus: 'create',
      btnLoding: false,
      sumPrice: 0,
      sumQuantity: 0,
      temp: {},
      defaultTemp: {
        id: undefined,
        factory: '',
        type: '1',
        shipping: '',
        remark: '',
        goods: []
      },
      rules: {
        name: [
          { required: true, trigger: 'blur', message: '请填写店铺名称' }
        ]
      },
      tagTypeArr: ['info', 'warning', '', 'success',  'danger'],
    }
  },
  watch: {
    row: {
      deep: true,
      handler(val) {}
    }
  },
  computed: {
    typeOptions() {
      return this.$store.state.const.boolOptions
    },
    sizeSort() {
      return this.$store.state.const.sizeSort
    }
  },
  methods: {
    showDialog(status) {
      this.dialogStatus = status
      this.readOnly = status === 'view'
      this.dialogShow = true
      this.$nextTick(() => {
        if (status === 'create') {
          this.resetForm('dialogForm')
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
      if (this.$refs.factorySelectRef !== undefined) {
        this.$refs.factorySelectRef.setValue('')
      }
      this.$store.dispatch('addproduct/setSelected', this.temp.goods)
    },
    handleFilter() {
      this.$emit('handleFilter')
    },
    submit(event) {
      this.$refs['dialogForm'].validate((valid) => {
        if (valid) {
          this.btnLoding = true
          addStockIn(this.temp).then((res) => {
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
      getStockInDetail({ id: id}).then(res => {
        this.temp = res.response
        this.$store.dispatch('addproduct/setSelected', this.temp.goods)
        this.$nextTick(() => {
          this.$refs.factorySelectRef.setValue(this.temp.factory)
        })
        this.sumary()
      }).catch(() => {})
    },
    insertProduct(selected, type) {
      type = type || 'select'
      if (selected.length > 0) {
        if (type === 'select') {
          selected.forEach(sel => {
            sel.price = sel.factory_price
            this.pushProduct(sel)
          })
          this.sumary()
          this.$store.dispatch('addproduct/setSelected', this.temp.goods)
        }else {
          getExportProducts({ data: selected, ext: ['单价', '数量'] }).then(res => {
            if (res.response.length > 0) {
              res.response.forEach(resp => {
                sel.price = sel.factory_price
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
    delRow(row) {
      const index = this.temp.goods.indexOf(row)
      this.temp.goods.splice(index, 1)
      this.$store.dispatch('addproduct/setSelected', this.temp.goods)
    },
    selectFactory(value) {
      this.temp.factory = value
    },
    sumary() {
      this.sumQuantity = 0
      this.sumPrice = 0
      if (this.temp.goods.length > 0) {
        this.temp.goods.forEach(item => {
          if (typeof(item.children) !== 'undefined' && item.children.length > 0) {
            const price = item.price || 0
            let quantitySum = 0
            item.children.forEach(child => {
              const childQuantity = child.quantity || 0
              quantitySum += parseInt(childQuantity)
            })
            item.quantity = quantitySum
            this.sumQuantity += quantitySum
            this.sumPrice += parseFloat(price) * quantitySum
          }
          //排序
          item.children = this.setSizeSort(item.children)
        })
      }
    },
    getSummaries() {
      return ['', '合计', this.sumPrice, this.sumQuantity]
    },
    pushProduct(product) {
      const that = this
      let shouldPush = true
      that.temp.goods.forEach(good => {
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
        that.temp.goods.push(product)
      }
    },
    setSizeSort(children) {
      const that = this
      let result = []
      let noControl = []
      children.forEach(c => {
        if (that.sizeSort.indexOf(c.size) >= 0) {
          result.push(c)
        } else {
          noControl.push(c)
        }
      })
      if (noControl.length > 0) {
        result = result.concat(noControl)
      }
      return result
    },
    tableRowClassName({ row, rowIndex }) {
      if (typeof(row.leaf) === 'undefined' || !row.leaf) {
        return '';
      }
      return 'success-row';
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/.el-table .success-row {
  background: #f0f9eb;
}
</style>
