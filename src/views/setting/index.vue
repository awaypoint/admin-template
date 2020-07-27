<template>
  <div class="app-container">
    <div class="form-container">
      <el-form
        ref="settingForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="120px"
        class="dialog-form-cls"
      >
        <el-form-item label="appKey" prop="app_key">
          <el-input v-model="temp.app_key"/>
        </el-form-item>
        <el-form-item label="appSecret" prop="app_secret">
          <el-input v-model="temp.app_secret"/>
        </el-form-item>
        <el-form-item label="打印标题" prop="print_title">
          <el-input v-model="temp.print_title"/>
        </el-form-item>
      </el-form>
      <div class="form-footer">
        <el-button 
          type="primary" 
          size="small" 
          v-show="checkPermission('updateSetting')"
          @click="submit($event)"
          :loading="btnLoding"
        >保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getSetting, updateSetting } from '@/api/system'
import { checkPermission } from '@/utils/index'

export default {
  name: 'Setting',
  components: {  },
  computed: {
    ...mapGetters([
      'permissions',
    ])
  },
  data() {
    return {
      temp: {
        id: undefined,
        app_key: '',
        app_secret: '',
        print_title: ''
      },
      rules: {
        app_key: [
          { required: true, trigger: 'blur', message: '请填写appid' }
        ],
        app_secret: [
          { required: true, trigger: 'blur', message: '请填写app密码' }
        ],
        print_title: [
          { required: true, trigger: 'blur', message: '请填写打印标题' }
        ]
      },
      btnLoding: false
    }
  },
  created() {
    this.getSetting()
  },
  methods: {
    checkPermission(check) {
      return checkPermission(this.permissions, check)
    },
    getSetting() {
      this.listLoading = true
      getSetting().then(res => {
        this.temp = res.response
      })
      setTimeout(() => {
        this.listLoading = false
      }, 0.5 * 1000)
    },
    submit(event) {
      this.$refs['settingForm'].validate( (valid) => {
        if (valid) {
          this.btnLoding = true
          updateSetting(this.temp).then((res) => {
            this.$message({ message: res.codemsg || '操作成功', type: 'success', showClose: true })
            setTimeout(() => {
              this.btnLoding = false
            }, 0.5 * 1000)
          }).catch(() => {
            this.btnLoding = false
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/.el-table th {
  padding: 11px 0;
}
.form-container {
  width: 40%;
  margin: auto;
  padding-top: 50px;
}
.form-footer {
  text-align: right;
  padding-right: 20px;
}
</style>
