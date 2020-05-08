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
                <el-form-item label="产品名称" prop="name">
                  <el-input v-model="temp.name"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="产品货号" prop="name">
                  <el-input v-model="temp.no"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="产品售价" prop="name">
                  <el-input v-model="temp.price"></el-input>
                </el-form-item>
              </el-col>
            </div>
          </el-row>
          <el-divider content-position="left"><i class="el-icon-info divider-icon" />SKU</el-divider>
          <el-row :gutter="10">
            <div class="form-container-sku" v-for="(sku, ik) in skus" :key="ik">
              <el-col :span="12">
                <div class="form-container-sku-items" >
                  <el-form-item label="图片">
                    <dropzone 
                      :ref="'dropzoneImage' + ik"
                      :id="'skuDropzone' + ik"
                      :url="imageUpHost"
                      :maxFiles="1"
                      @dropzone-success="dropzoneS" 
                      @dropzone-error="dropzoneE"
                    />
                  </el-form-item>
                  <el-form-item label="货号">
                    <el-input v-model="temp.name"></el-input>
                  </el-form-item>
                  <el-form-item label="属性">
                    <el-col :span="18">
                      <el-select v-model="value1" multiple placeholder="请选择">
                        <el-option
                          v-for="item in options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="6" class="sku-btn-group">
                      <el-button-group>
                        <el-button icon="el-icon-plus" size="mini" circle></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="changeSku(ik, 'del')"></el-button>
                      </el-button-group>
                    </el-col>
                  </el-form-item>
                </div>
              </el-col>
            </div>
          </el-row>
          <el-divider content-position="left"><i class="el-icon-info divider-icon" />价格</el-divider>
          <el-row :gutter="10">
            <div class="form-container-price" v-for="(priceItem, pk) in price" :key="pk + 'price'">
              <el-col :span="12">
                <div class="form-container-price-items" >
                  <el-form-item label="起购数" prop="region">
                    <el-input v-model="temp.min"></el-input>
                  </el-form-item>
                  <el-col :span="20">
                    <el-form-item label="价格" prop="region">
                      <el-input v-model="temp.price"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4" class="price-btn-group">
                    <el-button-group>
                      <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="changePrice(pk, 'del')"></el-button>
                    </el-button-group>
                  </el-col>
                </div>
              </el-col>
            </div>
          </el-row>
          <el-divider content-position="left"><i class="el-icon-info divider-icon" />属性</el-divider>
          <el-row :gutter="10">
            <div class="form-container-attrs" v-for="(attrItem, ak) in attrs" :key="ak + 'attr'">
              <el-col :span="12">
                <el-form-item label="属性" prop="date1">
                  <el-col :span="9">
                    <el-input placeholder="属性名称" v-model="attrItem.label" style="width: 100%;"></el-input>
                  </el-col>
                  <el-col class="form-container-attr-split" :span="2">:</el-col>
                  <el-col :span="9">
                    <el-input placeholder="属性值" v-model="attrItem.value" style="width: 100%;"></el-input>
                  </el-col>
                  <el-col :span="4" class="attr-btn-group">
                    <el-button-group>
                      <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="changeAttr(ak, 'del')"></el-button>
                    </el-button-group>
                  </el-col>
                </el-form-item>
              </el-col>
            </div>
          </el-row>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog">取消</el-button>
        <el-button size="small" @click="changeSku">添加sku</el-button>
        <el-button size="small" @click="changePrice">添加价格</el-button>
        <el-button size="small" @click="changeAttr">添加属性</el-button>
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
import { getProductList, addProduct, getProductDetail, delProduct } from '@/api/product'
import Dropzone from '@/components/Dropzone'

export default {
  name: 'modifyProduct',
  components: { Dropzone },
  data() {
    return {
      textMap: {
        create: '添加商品',
        update: '编辑商品'
      },
      dialogShow: false,
      dialogStatus: 'create',
      temp: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        sku_image: '',
        sku: [{ value: '' }],
        price: 0.00,
        min: 0
      },
      tempCopy: null,
      skus: [{ image: '', attrs: [{ value: '' }] }],
      price: [{ min: 0, price: 0.00 }],
      attrs: [{ label: '', value: '' }],
      rules: {},
      btnLoding: false,
      imageUpHost: process.env.VUE_APP_BASE_API + 'uploadFile',
      previewImage: false,
      previewImageUrl: '',
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      value1: []
    }
  },
  created() {
    this.tempCopy = Object.assign({}, this.temp)
  },
  methods: {
    showDialog(status) {
      this.dialogStatus = status
      this.dialogShow = true
      this.resetForm('dialogForm')
    },
    closeDialog() {
      this.dialogShow = false
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleAdd() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.resetForm('dialogForm')
      })
    },
    handleUpdate(row) {
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.temp = {}
      getProductDetail({ id: row.id }).then( res => {
        this.temp = res.response
        this.priceColNum = Math.min(4, this.temp.price.length)
      }).catch(() => {})
    },
    resetForm(formName) {
      if (this.$refs[formName] === undefined) {
        return false
      }
      this.$refs[formName].resetFields()
      this.temp = Object.assign({}, this.tempCopy)
      this.temp.sku = [{ value: '' }]
      this.skus = [{ image: '', attrs: [{ value: '' }] }]
      if (this.$refs['dropzoneImage0'] !== undefined) {
        this.$refs['dropzoneImage0'][0].removeAllFiles()
      }
    },
    submit(event) {
      this.$refs['dialogForm'].validate((valid) => {
        if (valid) {
          this.btnLoding = true
          add(this.temp).then((res) => {
            this.$message({
              message: res.codemsg || '操作成功',
              type: 'success',
              showClose: true
            })
            setTimeout(() => {
              this.dialogFormVisible = false
              this.btnLoding = false
              this.handleFilter()
            }, 0.5 * 1000)
          }).catch(() => {
            setTimeout(() => {
              this.btnLoding = false
            }, 0.5 * 1000)
          })
        }
      })
    },
    getSummaries(params) {
      const { columns, data } = params
      const sums = [ '总计', 333, 222 ]
      return sums
    },
    changeSku(ik, type) {
      if (type === 'del') {
        this.skus.splice(ik, 1)
      } else {
        this.skus.push({ image: '', attrs: [{ value: '' }] })
      }
    },
    changePrice(pk, type) {
      if (type === 'del') {
        this.price.splice(pk, 1)
      } else {
        this.price.push({ min: 0, price: 0.00 })
      }
    },
    changeAttr(ak, type) {
      if (type === 'del') {
        this.attrs.splice(ak, 1)
      } else {
        this.attrs.push({ label: '', value: '' })
      }
    },
    dropzoneS(file) {
      if (file.status === 'success' && file.xhr.responseText) {
        const response = JSON.parse(file.xhr.responseText)
        if (response.code === 0) {
          this.temp.sku_image = response.response.path
          this.$message({ message: '图片上传成功', type: 'success', showClose: true })
          return
        }
      }
      this.$message({ message: '图片上传失败', type: 'error', showClose: true })
    },
    dropzoneE(file) {
      this.$message({ message: '只能上传一张图片', type: 'error', showClose: true })
      this.$refs.dropzoneImage.removeFile(file)
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
  width: 93.5% !important;
  display: inherit;
}
.sku-btn-group, .price-btn-group, .attr-btn-group {
  text-align: right;
}
.divider-icon {
  margin-right: 5px;
}
</style>
