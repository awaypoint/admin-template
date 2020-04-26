<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="filter-item-btn">
        <el-button class="filter-item pan-btn light-blue-btn" type="primary" icon="el-icon-search" v-show="checkPermission('getFactoryList')" @click="handleFilter">
          查询
        </el-button>
      </div>
      <el-input v-model="listQuery.order_id" placeholder="请输入订单号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.status" style="width: 140px" class="filter-item" @change="handleFilter" placeholder="状态" clearable>
        <el-option v-for="item in typeOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.type" style="width: 140px" class="filter-item" @change="handleFilter" placeholder="类型" clearable>
        <el-option v-for="item in typeOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      show-summary
      :summary-method="getSummaries"
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="订单号" min-width="200px" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.type == 2 ? 'info' : 'success'">{{ typeMap[scope.row.type] }}</el-tag>
          <span>{{ scope.row.order_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品数量" min-width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sum_pay_ment }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总金额" min-width="140px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sum_pay_ment }}</span>
        </template>
      </el-table-column>
      <el-table-column label="买家" min-width="160px" align="center">
        <template slot-scope="scope">
          <img src="http://amos.alicdn.com/realonline.aw?v=2&uid=etindar&site=cntaobao&s=2&charset=utf-8" class="wangwang-cls">
          <el-tag type="warning">{{ scope.row.to_full_name }}</el-tag>
          <span>{{ scope.row.buyer_login_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="150px" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-color="#13ce66"
            active-value="1" inactive-value="2"
            @change="handleModifyState(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="下单时间" width="160px" align="center" sortable prop="created_at">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.order_created_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="130" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="bottom-end" v-show="checkPermission('updateFactory')">
            <el-button size="mini" icon="el-icon-edit" @click="handleUpdate(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="打印订单" placement="bottom-end" v-show="checkPermission('delFactroy')">
            <el-button icon="el-icon-delete" size="mini" type="danger" @click="handleDelete(scope.row.id)">
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.page_size"
      @pagination="getList"
    />

    <el-dialog
      :close-on-click-modal="false"
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      width="550px"
      ref="childForm"
    >
      <el-form
        ref="dialogForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="90px"
        class="dialog-form-cls"
      >
        <el-form-item label="厂家名称" prop="name">
          <el-input v-model="temp.name"/>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="temp.status" active-color="#13ce66" active-value="1" inactive-value="2"/>
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input v-model="temp.desc" type="textarea"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false">取消</el-button>
        <el-button 
          type="primary" 
          size="small" 
          :loading="btnLoding"
          @click="dialogStatus==='create'?submit($event):updateData()"
        >确认</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getOrderList, getOrderDetail } from '@/api/order'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { checkPermission } from '@/utils/index'

export default {
  name: 'Order',
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        page_size: 10,
        order_id: undefined,
        status: undefined,
        order_by: undefined,
        sort_by: undefined
      },
      temp: {
        id: undefined,
        name: '',
        status: '1',
        desc: ''
      },
      tempCopy: null,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑订单',
      },
      rules: {
        name: [
          { required: true, trigger: 'blur', message: '请填写厂家名称' }
        ]
      },
      typeOptions: [
        { key: 1, label: '正常'},
        { key: 2, label: '刷单'}
      ],
      typeMap: {
        1: '正常',
        2: '刷单'
      },
      btnLoding: false
    }
  },
  computed: {
    ...mapGetters([
      'permissions'
    ])
  },
  created() {
    this.tempCopy = Object.assign({}, this.temp)
    this.getList()
  },
  methods: {
    checkPermission(check) {
      return true
      return checkPermission(this.permissions, check)
    },
    handleFilter() {
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
      for(let field in this.temp) {
        this.temp[field] = row[field]
      }
      this.dialogFormVisible = true
    },
    sortChange(column) {
      this.listQuery.order_by = column.prop
      this.listQuery.sort_by = column.order === "descending" ? 'DESC' : 'ASC'
      this.handleFilter()
    },
    handleModifyState(row) {
      const upData = {
        'id': row.id,
        'status': row.status
      }
      this.modifyFactory(upData, false)
    },
    getList() {
      this.listLoading = true
      getOrderList(this.listQuery).then(res => {
        this.list = res.response.rows
        this.total = res.response.total
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      }).catch(() => {
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    resetForm(formName) {
      if (this.$refs[formName] === undefined) {
        return false
      }
      this.$refs[formName].resetFields()
      this.temp = Object.assign({}, this.tempCopy)
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
    updateData() {
      this.$refs['dialogForm'].validate((valid) => {
        if (valid) {
          this.btnLoding = true
          this.modifyFactory(this.temp, true)
        }
      })
    },
    handleDelete(id) {
      this.$confirm('此操作将永久删除该厂家, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        del({ 'id': id }).then((res) => {
          this.$message({
            message: res.codemsg || '操作成功',
            type: 'success',
            showClose: true
          })
          this.handleFilter()
        })
      }).catch(() => {})
    },
    modifyFactory(upData, isDialog) {
      update(upData).then((res) => {
        this.$message({
          message: res.codemsg || '操作成功',
          type: 'success',
          showClose: true
        })
        if (isDialog) {
          this.dialogFormVisible = false
          this.btnLoding = false
        }
        this.handleFilter()
      }).catch(() => {
        if (!isDialog) {
          this.handleFilter()
        } else {
          this.btnLoding = false
        }
      })
    },
    getSummaries(params) {
      const { columns, data } = params
      const sums = [ '合计', 333, 222 ]
      return sums
    }
  }
}
</script>
<style>
.wangwang-cls {
  vertical-align: middle;
  margin-right: 5px;
}
</style>
