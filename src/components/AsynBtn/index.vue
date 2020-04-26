<template>
  <div>
    <svg-icon icon-class="international" @click="click" />
    <el-dialog title="正在进行同步操作，请勿关闭窗口..." 
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <el-progress :text-inside="true" :stroke-width="12" :percentage="state.percent"></el-progress>
      
      <el-alert
        :title="state.doingTitle"
        type="success"
        center
        :closable="false"
      >
        <i class="el-icon-loading" v-show="state.showLoading"/>
      </el-alert>
      <el-alert v-for="(msg, index) in state.errorMsgs" :key="index"
        :title="msg"
        type="error"
        center
        :closable="false"
        show-icon
        style="padding-top:0px;padding-bottom:0px;line-height:30px;"
      >
      </el-alert>

      <div slot="footer" class="dialog-footer" style="line-height:0px;" v-if="state.showBtn">
        <el-button @click="dialogFormVisible = false" size="mini" v-show="state.toAuth">去授权</el-button>
        <el-button type="primary" @click="closeDialog" size="mini">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { prepareAsyn, asynData } from '@/api/system'

export default {
  name: 'Asyn',
  data() {
    return {
      dialogFormVisible: false,
      state:{
        showBtn: false,
        toAuth: false,
        showLoading: true,
        doingTitle: '正在同步...',
        percent: 0,
        perRate: 100,
        maxPrecent: 0,
        errorMsgs: [],
      },
      defaultState: null,
      timer: undefined
    }
  },
  created() {
    this.defaultState = Object.assign({}, this.state)
  },
  methods: {
    click() {
      this.state = Object.assign({}, this.defaultState)
      this.dialogFormVisible = true
      prepareAsyn().then(res => {
        let that = this
        const data = res.response
        this.state.errorMsgs = this.state.errorMsgs.concat(data.error_msg)
        this.state.perRate = data.per_rate
        this.state.maxPrecent = data.per_rate
        this.state.toAuth = data.to_auth
        that.timer = setInterval(function () {
          if (that.state.percent < that.state.maxPrecent) {
            that.state.percent = Math.min(parseInt(that.state.percent) + 5, that.state.maxPrecent);
          }
          if (that.state.percent >= 100) {
            that.state.showBtn = true
            that.state.doingTitle = '同步完成!'
            that.state.showLoading = false
            that.stopTimer()
          }
        }, 100);  
      }).then(res => {
        this.doAsyn({})
      }).catch(() => {
        this.state.showBtn = true
        this.stopTimer()
      })
    },
    doAsyn(params) {
      let asynParams = {
        step: params['step'] || 1,
        shop_id: params['shop_id'] || 0
      }
      asynData(asynParams).then( res => {
        const data = res.response
        this.state.errorMsgs = this.state.errorMsgs.concat(data.error_msg)
        this.state.maxPrecent += this.state.perRate
        if (!data.complete) {
          asynParams['step'] = data.next_step
          asynParams['shop_id'] = data.shop_id
          this.doAsyn(asynParams)
        } else {
          this.state.maxPrecent = 100
        }
      }).catch( () => {
        this.state.showBtn = true
        this.stopTimer()
      })
    },
    stopTimer() {
      if (typeof(this.timer) !== 'undefined') {
        clearInterval(this.timer)
      }
    },
    closeDialog() {
      this.dialogFormVisible = false
      this.stopTimer()
    }
  }
}
</script>

<style>
.international-svg {
  display: inline-block;
  cursor: pointer;
  fill: #5a5e66;;
  width: 20px;
  height: 20px;
  vertical-align: 10px;
}
.el-dialog {
  width: 30%;
}
.el-alert--success.is-light {
  background-color: #ffffff;
}
.el-alert--error.is-light {
  background-color: #ffffff;
}
.el-alert__description {
  float: left;
  margin-top: 1px !important;
  padding-right: 5px !important;
}
</style>
