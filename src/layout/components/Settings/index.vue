<template>
  <div>
    <el-card style="margin-bottom:20px;">
      <div slot="header" class="clearfix">
        <span>个人中心</span>
      </div>

      <div class="user-profile">
        <div class="box-center">
          <pan-thumb :image="user.avatar" :height="'100px'" :width="'100px'" :hoverable="false">
            <i class="el-icon-upload" @click="imagecropperShow=true" style="font-size:40px;margin-top: 10px;"/>
          </pan-thumb>
        </div>
        <div class="box-center">
          <div class="user-name text-center">{{ user.roleName }}</div>
          <div class="user-role text-center text-muted">{{ user.name }}</div>
        </div>
      </div>
    </el-card>
    <div class="user-profile-form">
      <el-form label-position="right" label-width="130px" :model="formData">
        <el-form-item label="昵称">
          <el-input v-model="formData.nickname"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="formData.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div class="user-profile-form-btn">
        <el-button type="primary" @click="modifyUser">保存</el-button>
      </div>
    </div>
    <el-divider></el-divider>
    <div class="user-profile-form">
      <el-form label-position="right" label-width="130px" :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item label="旧密码" prop="old_password">
          <el-input v-model="ruleForm.old_password"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="new_password">
          <el-input v-model="ruleForm.new_password"></el-input>
        </el-form-item>
        <el-form-item label="密码确认" prop="new_password_confirm">
          <el-input v-model="ruleForm.new_password_confirm"></el-input>
        </el-form-item>
      </el-form>
      <div class="user-profile-form-btn">
        <el-button type="danger" @click="modifyPwd">重置密码</el-button>
      </div>
    </div>
    <image-cropper
      v-show="imagecropperShow"
      field="file"
      :key="imagecropperKey"
      :width="300"
      :height="300"
      :url="imageUpHost"
      lang-type="zh"
      @close="close"
      @crop-upload-success="cropSuccess"
    />
  </div>
</template>

<script>
import { modifyPwd } from '@/api/user'
import PanThumb from '@/components/PanThumb'
import ImageCropper from '@/components/ImageCropper'

export default {
  components: { PanThumb, ImageCropper },
  data() {
    const validPwdConfirm = (rule, value, callback) => {
      if (value !== this.ruleForm.new_password) {
        callback(new Error("密码输入不一致"));
      } else {
        callback();
      }
    }
    return {
      user:{
        name: this.$store.state.user.username,
        avatar: this.$store.state.user.avatar,
        roleName: this.$store.state.user.roleName,
      },
      formData: {
        avatar: this.$store.state.user.avatar,
        nickname: this.$store.state.user.name,
        mobile: this.$store.state.user.mobile,
      },
      ruleForm: {
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
      },
      imageUpHost:process.env.VUE_APP_BASE_API + 'uploadFile',
      imagecropperShow: false,
      imagecropperKey: 0
    }
  },
  computed: {
    fixedHeader: {
      get() {
        return this.$store.state.settings.fixedHeader
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'fixedHeader',
          value: val
        })
      }
    },
    tagsView: {
      get() {
        return this.$store.state.settings.tagsView
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'tagsView',
          value: val
        })
      }
    },
    sidebarLogo: {
      get() {
        return this.$store.state.settings.sidebarLogo
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'sidebarLogo',
          value: val
        })
      }
    }
  },
  methods: {
    modifyUser() {
      this.$store.dispatch("user/modifyUser", this.formData).then((res)=>{
        if (res.code === 0) {
          this.$message({
            message: res.codemsg || '操作成功',
            type: 'success',
            showClose: true
          })
        }
      })
    },
    modifyPwd() {
      this.$refs.ruleForm.validate((valid) => {
        if (!valid) {
          return
        }
        modifyPwd(this.ruleForm).then((res) => {
          if (res.code === 0) {
            this.$message({
              message: res.codemsg || '操作成功',
              type: 'success',
              showClose: true
            })
            this.resetForm('ruleForm')
          }
        })
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    close() {
      this.imagecropperShow = false
    },
    cropSuccess(resData) {
      this.imagecropperShow = false
      this.imagecropperKey = this.imagecropperKey + 1
      if (resData.code === 0) {
        this.formData.avatar = resData.response.path
        this.modifyUser()
        this.user.avatar = resData.response.path
      }
      // this.image = resData.files.avatar
    },
  }
}
</script>

<style lang="scss" scoped>

.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}

.user-profile {
  .user-name {
    font-weight: bold;
  }

  .box-center {
    padding-top: 10px;
  }

  .user-role {
    padding-top: 10px;
    font-weight: 400;
    font-size: 14px;
  }

  .box-social {
    padding-top: 30px;

    .el-table {
      border-top: 1px solid #dfe6ec;
    }
  }

  .user-follow {
    padding-top: 20px;
  }
}

.user-bio {
  margin-top: 20px;
  color: #606266;

  span {
    padding-left: 4px;
  }

  .user-bio-section {
    font-size: 14px;
    padding: 15px 0;

    .user-bio-section-header {
      border-bottom: 1px solid #dfe6ec;
      padding-bottom: 10px;
      margin-bottom: 10px;
      font-weight: bold;
    }
  }
}
.user-profile-form {
  margin: 0 20px;
  width: 85%;
}
.user-profile-form-btn {
  text-align: right;
}
</style>
