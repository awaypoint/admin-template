<template>
  <div class="product-btn-group">
    <el-button icon="el-icon-download" size="small" @click="downloadTemplate">下载模板</el-button>
    <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
    <addProduct ref="addProduct" @insertProduct="insertProduct"></addProduct>
  </div>
</template>

<script>
import addProduct from '@/components/addProduct'
import UploadExcelComponent from '@/components/UploadExcel/index.vue'

const templateFiles = {
  'stockin': '入库产品模板.xls',
  'stockout': '出库产品模板.xls',
  'inventory': '盘点产品模板.xls',
}

export default {
  name: 'productBtnGroup',
  components: { addProduct, UploadExcelComponent },
  props: {
    templateType: {
      type: String,
      required: true
    }
  },
  data() {
    return {
    }
  },
  methods: {
    insertProduct(insertData, type) {
      type = type || 'select'
      this.$emit('insertProduct', insertData, type)
    },
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1

      if (isLt1M) {
        return true
      }

      this.$message({ message: '只能上传小于1M的文件', type: 'warning', showClose: true})
      return false
    },
    handleSuccess({ results, header }) {
      this.insertProduct(results, 'export')
    },
    downloadTemplate() {
      const fileName = templateFiles[this.templateType]
      const url = CUSTOMCONF.fileHost + templateFiles[this.templateType]
      const link = document.createElement('a')
      link.style.display ='none'
      link.href = url
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ .el-button {
  margin-left: 0;
}
.product-btn-group {
  margin-bottom: 10px;
  text-align: right;
}
</style>
