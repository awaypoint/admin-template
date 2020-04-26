<template>
  <div>
    <el-card style="margin-bottom:20px;height:100vh">
      <div slot="header" class="clearfix">
        <span>个人中心</span>
        <i class="el-icon-close" style="float: right;cursor: pointer;" @click="closePanel"/>
      </div>

      <div class="user-profile">
        <div class="box-center">
          <pan-thumb :image="user.avatar" :height="'100px'" :width="'100px'" :hoverable="false">
            <i class="el-icon-upload" @click="showCropper" style="font-size:40px;margin-top: 10px;cursor: pointer;"/>
          </pan-thumb>
        </div>
        <div class="box-center">
          <div class="user-name text-center">{{ user.roleName }}</div>
          <div class="user-role text-center text-muted">{{ user.name }}</div>
        </div>
        <el-divider></el-divider>
        <div class="box-center">
          <div class="user-profile-form-i">
            <i class="el-icon-edit" @click="modifyForm"/>
          </div>
          <el-form :model="formData" label-width="50px">
            <el-form-item prop="nickname" label="昵称">
              <el-input v-model="formData.nickname" :readonly="formReadOnly" ref="nicknameInput" @blur="modifyUser"></el-input>
            </el-form-item>
            <el-form-item label="手机号">
              <el-input v-model="formData.mobile" :readonly="formReadOnly" @blur="modifyUser"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import PanThumb from '@/components/PanThumb'
import MdInput from '@/components/MDinput'

export default {
  components: { PanThumb, MdInput },
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
      imagecropperKey: 0,
      formReadOnly: true
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
      if (!this.formReadOnly) {
        this.$store.dispatch("user/modifyUser", this.formData).then((res)=>{
          if (res.code === 0) {
            this.$message({
              message: res.codemsg || '操作成功',
              type: 'success',
              showClose: true
            })
          }
        }).catch(() => {})
      }
    },
    showCropper() {
      this.$emit('showCrop', true);
    },
    closePanel() {
      this.$store.dispatch('settings/changeSetting', {
        key: 'showSettings',
        value: false
      })
      this.formReadOnly = true
    },
    modifyForm() {
      this.formReadOnly = false
      this.$refs.nicknameInput.$el.querySelector('input').focus();
    },
    changeAvator(avatar) {
      this.user.avatar = avatar
    }
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
.user-profile-form-i {
  text-align: center;
  margin-bottom: 20px;
}
.user-profile-form-btn {
  text-align: right;
}
/deep/.el-form-item__label {
  padding-right: 0px;
}
/deep/ .el-input__inner {
  border-top-style: hidden;
  border-left-style: hidden;
  border-right-style: hidden;
  text-align: center;
}

</style>
