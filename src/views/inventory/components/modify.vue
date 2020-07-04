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
    >
      <el-form
        ref="dialogForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="120px"
        class="dialog-form-cls"
      >
        <el-form-item label="备注" prop="desc">
          <el-input v-model="temp.remark" type="textarea" :readOnly="readOnly"/>
        </el-form-item>
      </el-form>
      <el-divider></el-divider>
      <productBtnGroup v-if="!readOnly" templateType="inventory" @insertProduct="insertProduct"></productBtnGroup>
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
        <el-table-column label="数量" min-width="140px" align="center">
          <template slot-scope="scope">
            <el-input 
              v-if="!readOnly"
              v-model="scope.row.quantity"
              class="edit-input"
              size="small"
              :readOnly="!scope.row.leaf"
              @input="sumary"
            />
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
import { addInventory, getInventoryDetail } from '@/api/inventory'
import { getExportProducts } from '@/api/product'
import productPopover from '@/components/productPopover'
import productBtnGroup from '@/components/productBtnGroup'

export default {
  name: 'modifyInventory',
  components: { productPopover, productBtnGroup },
  props: {
    row: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      textMap: {
        update: '编辑盘点单',
        create: '添加盘点单',
        view: '查看盘点单'
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
        remark: '',
        goods: []
      },
      rules: {},
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
      this.$store.dispatch('addproduct/setSelected', this.temp.goods)
    },
    submit(event) {
      this.$refs['dialogForm'].validate((valid) => {
        if (valid) {
          this.btnLoding = true
          addInventory(this.temp).then((res) => {
            this.$message({ message: res.codemsg || '操作成功', type: 'success', showClose: true })
            this.dialogShow = false
            this.btnLoding = false
            this.$emit('handleFilter')
          }).catch(() => {
            this.btnLoding = false
          })
        }
      })
    },
    getDetail(id) {
      getInventoryDetail({ id: id}).then(res => {
        this.temp = res.response
        this.sumary()
      }).catch(() => {})
    },
    insertProduct(selected, type) {
      type = type || 'select'
      if (selected.length > 0) {
        if (type === 'select') {
          selected.forEach(sel => {
            this.pushProduct(sel)
          })
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
    delRow(row) {
      const index = this.temp.goods.indexOf(row)
      this.temp.goods.splice(index, 1)
      this.$store.dispatch('addproduct/setSelected', this.temp.goods)
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
        })
      }
    },
    getSummaries() {
      return ['', '合计', this.sumQuantity]
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
