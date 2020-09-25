<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" />
    <div :class="{hasTagsView:needTagsView}" class="main-container">
      <div :class="{'fixed-header':fixedHeader}">
        <navbar @showResetPwd="showResetPwdDialog"/>
        <tags-view v-if="needTagsView" />
      </div>
      <app-main />
      <right-panel>
        <settings ref="settingRef" @showCrop="showImageCrop"/>
      </right-panel>
    </div>
    <image-cropper
      v-show="imagecropperShow"
      field="file"
      :key="imagecropperKey"
      :url="imageUpHost"
      lang-type="zh"
      @close="close"
      @crop-upload-success="cropSuccess"
    />
    <el-dialog
      :close-on-click-modal="false"
      title="重置密码"
      :visible.sync="resetPwdFDialogVisible"
      width="550px"
      ref="resetPwd"
      class="dialog-form-cls"
    >
      <div class="user-profile-form">
        <el-form label-position="right" label-width="90px" :model="resetPwdForm" :rules="rules" ref="resetPwdForm">
          <el-form-item label="旧密码" prop="old_password">
            <el-input v-model="resetPwdForm.old_password" type="password"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="new_password">
            <el-input v-model="resetPwdForm.new_password" type="password"></el-input>
          </el-form-item>
          <el-form-item label="密码确认" prop="new_password_confirm">
            <el-input v-model="resetPwdForm.new_password_confirm" type="password"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button 
          type="primary" 
          size="small" 
          :loading="btnLoding"
          @click="modifyPwd"
        >重置密码</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import RightPanel from '@/components/RightPanel'
import { Navbar, Sidebar, AppMain, TagsView, Settings } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import ImageCropper from '@/components/ImageCropper'
import { mapState } from 'vuex'
import { modifyPwd } from '@/api/user'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    RightPanel,
    Settings,
    TagsView,
    ImageCropper
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  data() {
    const validPwdConfirm = (rule, value, callback) => {
      if (value !== this.resetPwdForm.new_password) {
        callback(new Error("密码输入不一致"));
      } else {
        callback();
      }
    }
    return {
      showSettings: true,
      imageUpHost: CUSTOMCONF.apiHost + 'uploadFile',
      imagecropperShow: false,
      imagecropperKey: 0,
      resetPwdFDialogVisible: false,
      btnLoding: false,
      resetPwdForm: {
        old_password: '',
        new_password: '',
        new_password_confirm: ''
      },
      rules: {
        old_password: [
          { required: true, message: '请输入旧密码', trigger: 'blur' }
        ],
        new_password: [
          { required: true, message: '请输入新密码', trigger: 'blur' }
        ],
        new_password_confirm: [
          { required: true, trigger: 'blur', validator: validPwdConfirm, message: '密码输入不一致' }
        ]
      }
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },
    showImageCrop(show) {
      this.imagecropperShow = show
    },
    modifyUser(avatar) {
      this.$store.dispatch("user/modifyUser", { 'avatar': avatar }).then((res)=>{
        if (res.code === 0) {
          this.$refs.settingRef.changeAvator(avatar)
          this.$message({
            message: res.codemsg || '操作成功',
            type: 'success',
            showClose: true
          })
        }
      }).catch(() => {})
    },
    cropSuccess(resData) {
      this.imagecropperShow = false
      this.imagecropperKey = this.imagecropperKey + 1
      if (resData.code === 0) {
        this.modifyUser(resData.response.path)
      }
    },
    close() {
      this.showImageCrop(false)
    },
    showResetPwdDialog() {
      this.resetPwdFDialogVisible = true
    },
    modifyPwd() {
      this.$refs.resetPwdForm.validate((valid) => {
        if (!valid) {
          return
        }
        this.btnLoding = true
        modifyPwd(this.resetPwdForm).then((res) => {
          if (res.code === 0) {
            this.btnLoding = false
            this.resetPwdFDialogVisible = false
            this.$message({ message: res.codemsg || '操作成功', type: 'success', showClose: true })
            this.resetForm('resetPwdForm')
          }
        }).catch(() => {
          this.btnLoding = false
        })
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }

  .user-profile-form {
    margin: 0 20px;
  }
</style>
