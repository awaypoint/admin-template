<template>
  <div class="view-container">
    <el-dialog
      :close-on-click-modal="false"
      title="产品详情"
      :visible.sync="dialogShow"
      width="900px"
      ref="childForm"
    >
      <div>
        <aside class="aside">
          <el-tag effect="dark">
            <span>{{ temp.product_cargo_number }}</span>
          </el-tag>
          <span>{{ temp.subject }}</span>
        </aside>
      </div>
      <el-carousel :interval="4000" type="card" height="300px">
        <el-carousel-item v-for="(sku, index) in temp.sku" :key="index">
          <el-image
            :src="sku.image ? sku.image : temp.image"
            fit="contain">
          </el-image>
          <div class="carousel-cls-sku">
            <el-tag effect="dark">{{ sku.cargo_number}}</el-tag>
            <el-tag v-for="(skuAttr, s) in sku.attr_arr" :key="s">{{ skuAttr }}</el-tag>
          </div>
        </el-carousel-item>
      </el-carousel>
      <div>
        <el-row :gutter="12">
          <el-col :span="24/priceColNum" v-for="(price, p) in temp.price" :key="p">
            <el-card shadow="hover">
              <span class="price-cls-range">{{ price.range }}{{ temp.unit }}</span>
              <div class="price-cls-price">
                <svg-icon icon-class="money" />
                <span>{{ price.price }}</span>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <el-divider></el-divider>
      <div class="attrs-cls">
        <el-row :gutter="6">
          <el-col :span="12" v-for="(attr, index) in temp.attrs" :key="index" class="attrs-cls-col">
            <label class="attrs-cls-label">{{ attr.name }}:</label>
            <div class="attrs-cls-value">
              <span v-for="(value, v) in attr.value" :key="v" class="attrs-cls-span">
                {{ value }}
              </span>
            </div>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog">取消</el-button>
        <el-button 
          type="primary" 
          size="small" 
          @click="closeDialog"
        >确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getProductDetail } from '@/api/product'

export default {
  name: 'viewProduct',
  components: {},
  props: {
    row: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      dialogShow: false,
      dialogStatus: '',
      priceColNum: 4,
      temp: {}
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
      this.dialogShow = true
      this.dialogStatus = status
      this.$nextTick(() => {
        getProductDetail({ id: this.row.id }).then( res => {
          this.temp = res.response
          this.priceColNum = Math.min(4, this.temp.price.length)
        }).catch(() => {})
      })
    },
    closeDialog() {
      this.dialogShow = false
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/.el-dialog {
  margin-top: 5vh !important;
  margin-bottom: 5vh;
}
/deep/.el-dialog__body {
  padding-top: 0px;
  padding-bottom: 12px;
}
/deep/.el-card__body {
  padding: 10px;
  text-align: center;
}
.attrs-cls-col {
  margin-bottom: 18px;
}
.attrs-cls-label {
  font-size: 16px;
  margin-left: 30px;
  font-weight: 700;
  color: #2c3e50;
}
.attrs-cls-value {
  display: inline;
}
.attrs-cls-span {
  border: 1px solid #dcdfe6;
  border-radius: 5px;
  padding: 3px;
  margin-left: 6px;
  line-height: 20px;
}
.attrs-cls-span:hover {
  border-color: #d9ecff;
  background-color: #ecf5ff;
  color: #409EFF;
}
.price-cls-range {
  font-size: 18px;
}
.price-cls-price {
  margin-top: 8px;
  font-size: 18px;
}
.carousel-cls-sku {
  position: absolute;
  bottom: 10px;
  right: 10px;
}
</style>
