<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="filter-item-btn">
        <el-button class="filter-item pan-btn green-btn" type="" icon="el-icon-plus" @click="handleAdd" v-show="checkPermission('addShop')">
          添加
        </el-button>
        <el-button class="filter-item pan-btn light-blue-btn" type="primary" icon="el-icon-search" @click="handleFilter" v-show="checkPermission('getShopList')">
          查询
        </el-button>
      </div>
      <el-input v-model="listQuery.name" placeholder="请输入店铺名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.type" placeholder="请选择店铺类型" clearable class="filter-item" style="width: 150px" @change="handleFilter" filterable>
        <el-option v-for="item in typeList" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="店铺名称" min-width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="店铺类型" min-width="200px" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.type === '1' ? 'danger' : ''">{{ typeMap[scope.row.type] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="产品数量" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单数量" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="160px" align="center" sortable prop="created_at">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.created_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="130" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="bottom-end" v-show="checkPermission('updateShop')">
            <el-button size="mini"  icon="el-icon-edit" @click="handleUpdate(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="bottom-end" v-show="checkPermission('delShop')">
            <el-button icon="el-icon-delete" size="mini" type="danger" @click="handleDelete(scope.row.id)">
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="授权" placement="bottom-end" v-show="checkPermission('delShop')">
            <el-button icon="el-icon-connection" size="mini" type="primary" @click="handleDelete(scope.row.id)">
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page_no"
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
        <el-form-item label="店铺名称" prop="name">
          <el-input v-model="temp.name"/>
        </el-form-item>
        <el-form-item label="店铺类型" prop="role_id">
          <el-select v-model="temp.type" placeholder="请选择" clearable style="width:100%">
            <el-option v-for="item in typeList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
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
          @click="dialogStatus==='create'?submit($event):updateData()"
          :loading="btnLoding"
        >确认</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getShopList, addShop, updateShop, delShop } from '@/api/shop'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { checkPermission } from '@/utils/index'

export default {
  name: 'Shop',
  components: { Pagination },
  computed: {
    ...mapGetters([
      'permissions',
    ])
  },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page_no: 1,
        page_size: 10,
        name: undefined,
        type: undefined,
        order_by: undefined,
        sort_by: undefined
      },
      temp: {
        id: undefined,
        name: '',
        type: '',
        desc: ''
      },
      tempCopy: null,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑店铺',
        create: '添加店铺'
      },
      rules: {
        name: [
          { required: true, trigger: 'blur', message: '请填写店铺名称' }
        ]
      },
      typeList: [
        { id: '1', name: '普通店铺'},
        { id: '2', name: '1688店铺'}
      ],
      typeMap: {
        '1': '普通店铺',
        '2': '1688店铺'
      },
      btnLoding: false
    }
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
      this.listQuery.page_no = 1
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
    getList() {
      this.listLoading = true
      getShopList(this.listQuery).then(res => {
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
          addShop(this.temp).then((res) => {
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
          this.modifyShop(this.temp, true)
        }
      })
    },
    handleDelete(id) {
      this.$confirm('此操作将永久删除该店铺, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delShop({ 'id': id }).then((res) => {
          this.$message({
            message: res.codemsg || '操作成功',
            type: 'success',
            showClose: true
          })
          this.handleFilter()
        })
      }).catch(() => {})
    },
    modifyShop(upData, isDialog) {
      updateShop(upData).then((res) => {
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
    }
  }
}
</script>
