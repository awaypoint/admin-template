<template>
  <div class="modify-container">
    <el-dialog 
      :close-on-click-modal="false" 
      :title="textMap[dialogStatus]" 
      :visible.sync="dialogShow" 
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
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="入库来源店铺" prop="shop">
              <shopSelect ref="selectShopRef" @selectShop="selectShop"></shopSelect>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="运费" prop="shipping">
              <el-input v-model="temp.shipping"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="10">
            <el-form-item label="快递单号" prop="shop">
              <expressSelect ref="selectExpressRef" @selectExpress="selectExpress"></expressSelect>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-input v-model="temp.express_no"/>
          </el-col>
        </el-row>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="temp.remark" type="textarea"/>
        </el-form-item>
      </el-form>
      <el-table
        row-key="id"
        :data="temp.goods"
        border
        highlight-current-row
        style="width: 100%;"
        ref="dialogTable"
      >
        <el-table-column type="index" :index="indexMethod" align="center">
        </el-table-column>
        <el-table-column label="货号" width="100px" align="center" sortable prop='cargo_number'>
          <template slot-scope="scope">
            <el-popover
              placement="top-start"
              width="100%"
              trigger="hover">
              <el-image
                :src="scope.row.image"
                fit="contain"
              >
              </el-image>
              <el-tag slot="reference" effect="dark">{{ scope.row.cargo_number }}</el-tag>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="SKU" min-width="160px" align="center" prop="attr_arr">
          <template slot-scope="scope" >
            <el-tag 
              v-for="(attr, index) in scope.row.attr_arr"
              :key="index"
              effect="dark"
              :type="tagTypeArr[index % 5]"
              style="margin-right: 5px;"
            >
            {{ attr }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="出库价格" min-width="100px" align="center" prop="price">
          <template slot-scope="scope" >
            <el-input 
              v-model="scope.row.price"
              class="edit-input"
              size="small"
            />
          </template>
        </el-table-column>
        <el-table-column label="数量" width="100px" align="center">
          <template slot-scope="scope">
            <el-input 
              v-model="scope.row.quantity"
              class="edit-input"
              size="small"
            />
          </template>
        </el-table-column>
        <el-table-column label="缺货" width="100px" align="center">
          <template slot-scope="scope">
            <el-input 
              v-model="scope.row.lack_quantity"
              class="edit-input"
              size="small"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="130" class-name="small-padding fixed-width">
          <template slot="header">
            <addProduct ref="addProduct" @insertProduct="insertProduct"></addProduct>
          </template>
          <template slot-scope="scope">
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
          @click="dialogStatus==='create'?submit($event):updateData()"
          :loading="btnLoding"
        >确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addStockOut, getStockOutDetail } from '@/api/stockout'
import addProduct from '@/components/addProduct'
import shopSelect from '@/components/shopSelect'
import expressSelect from '@/components/expressSelect'

export default {
  name: 'modifyStockOut',
  components: { addProduct, shopSelect, expressSelect },
  data() {
    return {
      textMap: {
        update: '编辑出库单',
        create: '添加出库单'
      },
      dialogShow: false,
      dialogStatus: '',
      btnLoding: false,
      temp: {},
      defaultTemp: {
        id: undefined,
        shop: '',
        type: '1',
        shipping: '',
        remark: '',
        express: '',
        express_no: '',
        goods: []
      },
      rules: {
        name: [
          { required: true, trigger: 'blur', message: '请填写店铺名称' }
        ]
      },
      tagTypeArr: ['info', 'warning', '', 'success',  'danger']
    }
  },
  computed: {
  },
  methods: {
    showDialog(status) {
      this.dialogStatus = status
      this.dialogShow = true
      if (status === 'create') {
        this.$nextTick(() => {
          this.resetForm('dialogForm')
        })
      } else {
        this.getDetail(this.$store.state.stockout.row.id)
      }
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
      if (this.$refs.selectShopRef !== undefined) {
        this.$refs.selectShopRef.setValue('')
      }
      if (this.$refs.selectExpressRef !== undefined) {
        this.$refs.selectExpressRef.setValue('')
      }
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
        this.$store.dispatch('addproduct/setSelected', this.temp.goods)
        this.$nextTick(() => {
          this.$refs.selectShopRef.setValue(this.temp.shop)
          this.$refs.selectExpressRef.setValue(this.temp.express)
        })
      }).catch(() => {})
    },
    updateData() {
      this.$refs['dialogForm'].validate((valid) => {
        if (valid) {
          this.btnLoding = true
          updateShop(this.temp).then((res) => {
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
    indexMethod(index) {
      return index + 1
    },
    insertProduct(selected) {
      if (selected.length > 0) {
        selected.forEach( item => {
          const temp = {
            product_sku_id: item.id,
            product_id: item.product_id,
            cargo_number: item.cargo_number,
            image: '',
            attr_arr: item['attr_arr'],
            price: 0,
            quantity: 0,
            lack_quantity: 0
          }
          this.temp.goods.push(temp)
        })
        this.$store.dispatch('addproduct/setSelected', this.temp.goods)
      }
    },
    delRow(index) {
      this.temp.goods.splice(index, 1)
      this.$store.dispatch('addproduct/setSelected', this.temp.goods)
    },
    selectShop(shopId) {
      this.temp.shop = shopId
    },
    selectExpress(id) {
      this.temp.express = id
    }
  }
}
</script>
