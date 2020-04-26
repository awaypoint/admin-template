<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="filter-item-btn">
        <el-button class="filter-item pan-btn light-blue-btn" type="primary" icon="el-icon-search" @click="handleFilter" v-show="checkPermission('getBuyerList')">
          查询
        </el-button>
      </div>
      <el-input v-model="listQuery.buyer_login_id" placeholder="请输入买家名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-date-picker class="filter-item"
        v-model="listQuery.times"
        type="datetimerange"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"
        @change="handleFilter"
      >
      </el-date-picker>
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
      <el-table-column label="买家名称" min-width="200px" align="center">
        <template slot-scope="scope">
          <img src="http://amos.alicdn.com/realonline.aw?v=2&uid=etindar&site=cntaobao&s=2&charset=utf-8" class="wangwang-cls">
          <span>{{ scope.row.buyer_login_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="买家id" min-width="170px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.buyer_member_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单数量" width="120px" align="center" sortable>
        <template slot-scope="scope">
          <el-tag>{{ scope.row.order_num }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="订单金额" width="150px" align="center" sortable>
        <template slot-scope="scope">
          <el-tag type="danger"><i class="el-icon-money" style="margin-right: 10px"/>{{ scope.row.order_amount }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="同步时间" width="160px" align="center" sortable prop="created_at">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.created_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="130" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="bottom-end" v-show="checkPermission('updateBuyer')">
            <el-button size="mini"  icon="el-icon-edit" @click="handleUpdate(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="订单列表" placement="bottom-end" v-show="checkPermission('getOrderList')">
            <el-button icon="el-icon-s-order" size="mini" type="primary">
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
        :model="temp"
        label-position="right"
        label-width="90px"
        class="dialog-form-cls"
      >
        <el-form-item label="买家名称" prop="buyer_login_id">
          <el-input v-model="temp.buyer_login_id" readonly/>
        </el-form-item>
        <el-form-item label="买家id" prop="buyer_member_id">
          <el-input v-model="temp.buyer_member_id" readonly/>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio v-model="temp.sex" label="1">男</el-radio>
          <el-radio v-model="temp.sex" label="2">女</el-radio>
          <el-radio v-model="temp.sex" label="3">未知</el-radio>
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
          @click="updateData()"
          :loading="btnLoding"
        >确认</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getBuyerList, updateBuyer } from '@/api/buyer'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { checkPermission } from '@/utils/index'

export default {
  name: 'Buyer',
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
        page: 1,
        page_size: 10,
        buyer_login_id: undefined,
        times: [],
        order_by: undefined,
        sort_by: undefined
      },
      temp: {
        id: undefined,
        buyer_member_id: '',
        buyer_login_id: '',
        sex: '',
        desc: ''
      },
      tempCopy: null,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑买家',
        create: '添加买家'
      },
      typeList: [
        { id: '1', name: '普通店铺'},
        { id: '2', name: '1688店铺'}
      ],
      typeMap: {
        '1': '普通店铺',
        '2': '1688店铺'
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
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
      this.getList()
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
      getBuyerList(this.listQuery).then(res => {
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
    updateData() {
      this.$refs['dialogForm'].validate((valid) => {
        if (valid) {
          this.btnLoding = true
          this.updateBuyer(this.temp, true)
        }
      })
    },
    updateBuyer(upData, isDialog) {
      updateBuyer(upData).then((res) => {
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
<style>
.el-range-input  {
  vertical-align: top;
}
.el-range-separator {
  vertical-align: top;
}
.wangwang-cls {
  vertical-align: middle;
  margin-right: 5px;
}
</style>
