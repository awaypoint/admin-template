<template>
  <div class="modify-container">
    <el-dialog
      :close-on-click-modal="false"
      :title="textMap[dialogStatus]"
      :visible.sync="dialogShow"
      width="950px"
      ref="modifyDialog"
      @close="closeDialog"
    >
      <div class="form-container">
        <el-form
          ref="dialogForm"
          :model="temp"
          :rules="rules"
          label-position="right"
          label-width="90px"
          class="dialog-form-cls"
        >
          <el-divider content-position="left"><i class="el-icon-info divider-icon" />基本信息</el-divider>
          <el-row :gutter="10">
            <div class="form-container-base">
              <el-col :span="24">
                <el-form-item label="产品名称" prop="subject">
                  <el-input v-model="temp.subject"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="产品货号" prop="product_cargo_number">
                  <el-input v-model="temp.product_cargo_number"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="门店" prop="shop">
                  <shopSelect ref="selectShopRef" @selectShop="selectShop"></shopSelect>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="产品售价" prop="consign_price">
                  <el-input v-model="temp.consign_price"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="平台价" prop="platform_price">
                  <el-input v-model="temp.platform_price" readonly></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="库位" prop="stock">
                  <el-input v-model="temp.stock"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="工厂" prop="factory">
                  <factorySelect ref="factorySelectRef" @selectFactory="selectFactory"></factorySelect>
                </el-form-item>
              </el-col>
            </div>
          </el-row>
          <el-divider content-position="left"><i class="el-icon-info divider-icon" />产品规格</el-divider>
          <el-row :gutter="10">
            <div class="form-container-sku">
              <el-col :span="24">
                <div class="form-container-sku-items" >
                   <el-form-item label="颜色">
                    <div class="form-container-sku-color" v-for="(color, ck) in temp.colors" :key="'color' + ck">
                      <el-col :span="6">
                        <el-checkbox v-if="typeof(color.type) === 'undefined'" :label="color.label" v-model="color.value"></el-checkbox>
                        <div  v-if="color.type === 'input'">
                          <el-col :span="18">
                            <el-input v-model="color.label" placeholder="请输入颜色" size="small"></el-input>
                          </el-col>
                          <el-col :span="6">
                            <el-button type="text" @click="delElement('colors', ck)">删除</el-button>
                          </el-col>
                        </div>
                      </el-col>
                    </div>
                    <el-col :span="6">
                      <el-button type="text" icon="el-icon-plus" @click="insertElement('colors')">添加自定义项</el-button>
                    </el-col>
                  </el-form-item>
                  <el-form-item>
                    <div class="form-container-sku-image" v-for="(color2, ck2) in temp.colors" :key="'img' + ck2">
                      <el-col :span="4">
                        <div v-if="color2.value">
                          <el-upload
                            class="avatar-uploader"
                            :action="imageUpHost"
                            :show-file-list="false"
                            :on-success="dropzoneS"
                            :data="{ k: ck2}"
                            >
                            <img v-if="color2.img" :src="color2.img" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                          </el-upload>
                          <el-input v-model="color2.label" size="small"></el-input>
                          <el-input size="small" placeholder="请填写货号" v-model="color2.cargo_number"></el-input>
                        </div>
                      </el-col>
                    </div>
                  </el-form-item>
                <div>
                  <el-form-item label="尺码">
                    <div class="form-container-sku-size" v-for="(size, sk) in temp.size" :key="'size' + sk">
                      <el-col :span="6">
                        <el-checkbox v-if="typeof(size.type) === 'undefined'" :label="size.label" v-model="size.value" @change="selectSize"></el-checkbox>
                        <div  v-if="size.type === 'input'">
                          <el-col :span="18">
                            <el-input v-model="size.label" placeholder="请输入尺码" size="small" @input="selectSize"></el-input>
                          </el-col>
                          <el-col :span="6">
                            <el-button type="text" @click="delElement('size', sk)">删除</el-button>
                          </el-col>
                        </div>
                      </el-col>
                    </div>
                    <el-col :span="6">
                      <el-button type="text" icon="el-icon-plus" @click="insertElement('size')">添加自定义项</el-button>
                    </el-col>
                  </el-form-item>
                </div>
                <div>
                  <el-form-item label="尺码表">
                    <div class="form-container-sku-sizetable-columns" v-for="(sizeTable, st) in temp.size_table" :key="'sizeTable' + st">
                      <el-col :span="6">
                        <el-checkbox v-if="typeof(sizeTable.type) === 'undefined'" :label="sizeTable.label" v-model="sizeTable.value" @change="createColumns"></el-checkbox>
                        <div  v-if="sizeTable.type === 'input'">
                          <el-col :span="18">
                            <el-input v-model="sizeTable.label" placeholder="请输入内容" size="small" @input="createColumns"></el-input>
                          </el-col>
                          <el-col :span="6">
                            <el-button type="text" @click="delElement('size_table', st)">删除</el-button>
                          </el-col>
                        </div>
                      </el-col>
                    </div>
                    <el-col :span="6">
                      <el-button type="text" icon="el-icon-plus" @click="insertElement('size_table')">添加自定义项</el-button>
                    </el-col>
                  </el-form-item>
                </div>
                </div>
              </el-col>
            </div>
            <div class="form-container-sku-sizetable">
              <el-table
                :key="key"
                row-key="id"
                :data="temp.size_table_data"
                border
                highlight-current-row
                style="width: 100%;"
                ref="sizeTable"
              >
                <el-table-column label="尺码" min-width="100px" align="center" prop='size' />
                <el-table-column v-for="(sizeO,stt) in sizeTableColumns" :key="'sizeTableT' + stt" :label="sizeO.label" min-width="100px" align="center">
                  <template slot-scope="scope">
                    <el-input 
                      v-model="scope.row['key' + sizeO.label]"
                      class="edit-input" size="small"
                    />
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-row>
          <el-divider content-position="left"><i class="el-icon-info divider-icon" />工艺</el-divider>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="布行名称" prop="cloth_line">
                <el-input v-model="temp.cloth_line"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系方式" prop="contact">
                <el-input v-model="temp.contact"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="色号" prop="color_no">
                <el-input v-model="temp.color_no"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="成分" prop="components">
                <el-input v-model="temp.components"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="面料" prop="fabric">
                <el-input v-model="temp.fabric"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="单件用量" prop="dosage">
                <el-input v-model="temp.dosage"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="用料" prop="material">
                <el-input v-model="temp.material"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="加工费" prop="process_fee">
                <el-input v-model="temp.process_fee"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="辅料" prop="accessories">
                <el-input v-model="temp.accessories"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="出厂价格" prop="factory_price">
                <el-input v-model="temp.factory_price"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog">取消</el-button>
        <el-button size="small" v-show="dialogStatus !== 'create'" @click="printSize">打印尺码表</el-button>
        <el-button
          type="primary"
          size="small"
          :loading="btnLoding"
          @click="dialogStatus==='create'?submit():updateData()"
        >保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { deepClone } from '@/utils'
import { addProduct, getProductDetail, updateProduct } from '@/api/product'
import factorySelect from '@/components/factorySelect';
import shopSelect from '@/components/shopSelect'

export default {
  name: 'modifyProduct',
  components: { factorySelect, shopSelect },
  props: {
    row: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      key:1,
      textMap: {
        create: '添加商品',
        update: '编辑商品',
        view: '查看商品',
      },
      dialogShow: false,
      dialogStatus: 'create',
      temp: {
        subject: '',
        product_cargo_number: '',
        shop: '',
        consign_price: '',
        platform_price: '',
        stock: '',
        factory: '',
        colors: [],
        size: [],
        size_table: [],
        size_table_data: [],
        cloth_line: '',
        contact: '',
        color_no: '',
        components: '',
        fabric: '',
        dosage: '',
        material: '',
        process_fee: '',
        accessories: '',
        factory_price: '',
      },
      tempCopy: null,
      rules: {
        subject: [
          { required: true, trigger: 'blur', message: '请填写产品名称' }
        ],
        product_cargo_number: [
          { required: true, trigger: 'blur', message: '请填写产品货号' }
        ],
        cargo_number: [
          { required: true, trigger: 'blur', message: '请填写产品sku货号' }
        ]
      },
      btnLoding: false,
      imageUpHost: process.env.VUE_APP_BASE_API + 'uploadFile',
      sizeTableColumns: [],
      img: ''
    }
  },
  computed: {
    defaultColors() {
      return this.$store.state.const.colorOptions
    },
    defaultSize() {
      return this.$store.state.const.sizeOptions
    },
    defaultSizeTable() {
      return this.$store.state.const.sizeTableOptions
    }
  },
  created() {
    this.tempCopy = deepClone(this.temp)
    this.tempCopy.colors = deepClone(this.defaultColors)
    this.tempCopy.size = deepClone(this.defaultSize)
    this.tempCopy.size_table = deepClone(this.defaultSizeTable)
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
      this.$nextTick(() => {
        if (status === 'create') {
          this.resetForm('dialogForm')
        } else {
          this.getDetail()
        }
      })
    },
    closeDialog() {
      this.dialogShow = false
    },
    resetForm(formName) {
      if (this.$refs[formName] === undefined) {
        return false
      }
      this.$refs[formName].resetFields()
      this.temp = deepClone(this.tempCopy)
      this.createColumns()
    },
    handleFilter() {
      this.$emit('handleFilter')
    },
    submit(event) {
      this.$refs['dialogForm'].validate((valid) => {
        if (valid) {
          this.btnLoding = true
          addProduct(this.temp).then((res) => {
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
    dropzoneS(response, file, fielList) {
      if (response.code > 0) {
        this.$message({ message: '图片上传失败', type: 'error', showClose: true })
        return
      }
      this.temp.colors[response.response.k].img = response.response.path
      this.$message({ message: '图片上传成功', type: 'success', showClose: true })
    },
    insertElement(type) {
      if (typeof(this.temp[type]) !== 'undefined') {
        this.temp[type].push({ value: true, label: '', type: 'input' })
      }
    },
    delElement(type, index) {
      if (typeof(this.temp[type]) !== 'undefined') {
        this.temp[type].splice(index, 1)
        if (type === 'size') {
          this.selectSize()
        }
        if (type === 'size_table') {
          this.createColumns()
        }
      }
    },
    createColumns() {
      this.sizeTableColumns = this.temp.size_table.filter(i => i.value)
    },
    selectSize() {
      const oldSizeTableData = deepClone(this.temp.size_table_data)
      this.temp.size_table_data = []
      this.temp.size.forEach(item => {
        if (item.value) {
          const exist = oldSizeTableData.filter(o => o.size === item.label)
          const tmp = exist.length > 0 ? exist[0] : { size: item.label }
          this.temp.size_table_data.push(tmp) 
        }
      })
    },
    selectFactory(value) {
      this.temp.factory = value
    },
    getDetail() {
      getProductDetail({ id: this.row.id }).then( res => {
        this.temp = res.response
        this.$refs.selectShopRef.setValue(this.temp.shop)
        this.$refs.factorySelectRef.setValue(this.temp.factory)
        this.temp.colors = this.getDefaultData(this.defaultColors, res.response.colors)
        this.temp.size = this.getDefaultData(this.defaultSize, res.response.size)
        this.temp.size_table = this.getDefaultData(this.defaultSizeTable, res.response.size_table, true)
        this.selectSize()
        this.createColumns()
      }).catch(() => {})
    },
    getDefaultData(source, target, defaultValue) {
      defaultValue = defaultValue || false
      let result = []
      source.forEach(item => {
        let exist = []
        if (target.length > 0) {
          exist = target.filter(t => t.label === item.label)
        }
        if (exist.length === 0) {
          item.value = defaultValue
          result.push(item)
        } else {
          target.splice(target.indexOf(exist[0]), 1)
          result.push(exist[0])
        }
      })
      if (target.length > 0) {
        target.map(tar => {
          result.push(tar)
        })
      }
      return result
    },
    updateData() {
      this.$refs['dialogForm'].validate((valid) => {
        if (valid) {
          this.btnLoding = true
          updateProduct(this.temp).then((res) => {
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
    selectShop(shopId) {
      this.temp.shop = shopId
    },
    printSize() {
      const routeData = this.$router.resolve({ path: '/size?id=' + this.row.id });
      window.open(routeData.href, '_blank');
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ .el-dialog__body {
  padding: 10px 30px;
}
/deep/ .el-divider--horizontal {
  display: inline-block;
  margin-top: 5px;
}
/deep/.el-select {
  width: 100%;
}
/deep/.el-dialog {
  margin-bottom: 5vh;
  margin-top: 5vh !important;
}
/deep/.dz-preview {
  display: inherit;
}
.sku-btn-group, .price-btn-group, .attr-btn-group {
  text-align: right;
}
.divider-icon {
  margin-right: 5px;
}
.form-container-sku-sizetable {
  padding-bottom: 20px;
}
.avatar-uploader {
  line-height: 10px;
}
.avatar-uploader /deep/.el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 118px;
  height: 118px;
  line-height: 118px;
  text-align: center;
}
.avatar {
  width: 118px;
  height: 118px;
  display: block;
}
</style>
