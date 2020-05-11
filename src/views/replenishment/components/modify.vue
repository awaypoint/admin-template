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
        <el-form-item label="预计到货时间" prop="shipping">
          <el-date-picker
            v-model="temp.expected_at"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="是否已到货" prop="shop">
              <el-select v-model="temp.is_reached" filterable placeholder="请选择">
                <el-option
                  v-for="item in reachedOptions"
                  :key="item.key"
                  :label="item.label"
                  :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="紧急程度" prop="shipping">
              <el-select v-model="temp.urgency" filterable placeholder="请选择">
                <el-option
                  v-for="item in urgencyOptions"
                  :key="item.key"
                  :label="item.label"
                  :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>
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
            <productPopover :data="scope.row" :reference="scope.row.cargo_number"></productPopover>
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
        <el-table-column label="数量" width="100px" align="center">
          <template slot-scope="scope">
            <el-input 
              v-model="scope.row.quantity"
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
import { addRep, getRepDetail } from '@/api/replenishment'
import addProduct from '@/components/addProduct'
import productPopover from '@/components/productPopover';

export default {
  name: 'modifyReplenishment',
  components: { addProduct, productPopover },
  props: {
    row: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      textMap: {
        update: '编辑补货单',
        create: '添加补货单'
      },
      dialogShow: false,
      dialogStatus: '',
      btnLoding: false,
      temp: {},
      defaultTemp: {
        id: undefined,
        item_no: '',
        expected_at: '',
        is_reached: '',
        urgency: '',
        remark: '',
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
  watch: {
    row: {
      deep: true,
      handler(val) {}
    }
  },
  computed: {
    urgencyOptions() {
      return this.$store.state.const.replenishmentUrgencyOptions
    },
    reachedOptions() {
      return this.$store.state.const.boolOptions
    }
  },
  methods: {
    showDialog(status) {
      this.dialogStatus = status
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
      this.$store.dispatch('addproduct/setSelected', this.temp.goods)
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields()
      }
    },
    handleFilter() {
      this.$emit('handleFilter')
    },
    submit(event) {
      this.$refs['dialogForm'].validate((valid) => {
        if (valid) {
          this.btnLoding = true
          addRep(this.temp).then((res) => {
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
      getRepDetail({id: id}).then(res => {
        this.temp = res.response
        this.$store.dispatch('addproduct/setSelected', this.temp.goods)
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
            subject: item.subject,
            cargo_number: item.cargo_number,
            image: item.image,
            attr_arr: item['attr_arr'],
            quantity: 0
          }
          this.temp.goods.push(temp)
        })
        this.$store.dispatch('addproduct/setSelected', this.temp.goods)
      }
    },
    delRow(index) {
      this.temp.goods.splice(index, 1)
      this.$store.dispatch('addproduct/setSelected', this.temp.goods)
    }
  }
}
</script>
