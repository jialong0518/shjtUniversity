<template>
  <div class="showModuleDeploy">
    <el-row :gutter="20" style="padding: 20px;">
    <el-col :span="6">
        <div style="display: inline-block;width:30%;">模块标题：</div>
        <el-input style="width: 70%" v-model="searchtitle" autocomplete="off"></el-input>
    </el-col>
    <el-col :span="6">
        <div style="display: inline-block;width:30%;">模块类型：</div>
         <el-select style="width: 70%" v-model="searchtype" placeholder="请选择模块类型">
             <el-option  label="全部" value=""></el-option>
            <el-option  label="视频" value="视频"></el-option>
            <el-option  label="图文" value="图文"></el-option>
            <el-option  label="图片" value="图片"></el-option>
            <el-option  label="图表" value="图表"></el-option>
            <el-option  label="数列" value="数列"></el-option>
            <el-option  label="表格" value="表格"></el-option>
        </el-select>
    </el-col>
    <el-col :span="6">
        <el-button type="primary" @click="getTableData()">搜索</el-button>
    </el-col>
    </el-row>
    <div style="padding: 15px;overflow: hidden;">
      <el-radio-group v-model="type">
        <el-radio label="视频">视频</el-radio>
        <el-radio label="图文">图文</el-radio>
        <el-radio label="图片">图片</el-radio>
        <el-radio label="图表">图表</el-radio>
        <el-radio label="数据">数据</el-radio>
      </el-radio-group>
      <el-button type="primary" v-if="rights_list['发布']" style="float:right;" @click="publishData('', 'all')">全部发布</el-button>
      <el-button type="primary" v-if="rights_list['添加']" style="float:right;margin-right: 20px;" @click="addShowModuleDeployButt('ruleForm')">添加模块</el-button>
    </div>
    <el-table
    :data="tableData"
    @sort-change="tableSort"
    border
    style="width: 100%">
    <el-table-column
      type="index"
      label="编号"
      width="180">
    </el-table-column>
    <el-table-column
      prop="title"
      label="模块标题"
      width="180">
    </el-table-column>
    <el-table-column
      prop="sort"
      sortable
      label="展示顺序">
    </el-table-column>
    <el-table-column
      prop="type"
      label="模块类型">
    </el-table-column>
    <el-table-column
      prop="display"
      label="是否显示">
    </el-table-column>
    <el-table-column
      prop="publish"
      label="发布情况">
    </el-table-column>
    <el-table-column
      label="操作">
      <template slot-scope="scope">
        <el-button v-if="rights_list['查看']" @click="seeShowModuleDeployButt(scope.row)" type="text" size="small">查看</el-button>
        <el-button v-if="rights_list['编辑']" type="text" @click="editShowModuleDeployButt(scope.row)" size="small">编辑</el-button>
        <el-popconfirm
            title="是否确定删除该模块"
            @onConfirm="showModuleDeployDel(scope.row)" 
        >
        <el-button style="margin-left: 10px;" v-if="rights_list['删除']" slot="reference"  type="text" size="small">删除</el-button>
        </el-popconfirm>
        <!-- <el-button v-if="rights_list['删除']" @click="handleClick(scope.row)" type="text" size="small">删除</el-button> -->
        <el-popconfirm
            title="确认发布吗？"
            @onConfirm="publishData(scope.row, 'one')" 
        >
        <el-button  style="margin: 0 10px;" v-if="rights_list['发布']"  slot="reference" type="text" size="small">发布</el-button>
        </el-popconfirm>
        <el-button v-if="rights_list['移动排序']" @click="sortData(scope.row, 'up')" type="text" size="small">上移</el-button>
        <el-button v-if="rights_list['移动排序']" type="text" @click="sortData(scope.row, 'down')" size="small">下移</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div style="text-align: center;
    margin-top: 20px;">
      <el-pagination
      background
      @size-change="sizeChange"
      @current-change="currentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30]"
      :page-size="pageSize"
      layout="total,  prev, pager, next, sizes,jumper"
      :total="totalPage">
    </el-pagination>
  </div>  
  <el-dialog :title="titleForm" :visible.sync="dialogShowModuleDeployVisible">
    <el-form :model="form" :rules="rulesShowModuleDeploy" ref="ruleForm" label-width="100px">
        <el-form-item label="模块名称" prop="name">
        <el-input :disabled="titleForm.indexOf('查看')!== -1" v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
        <el-button @click="cancelSubmit('ruleForm')">取 消</el-button>
        <el-button :disabled="titleForm.indexOf('查看')!== -1" :loading="loadingShowModuleDeploy" type="primary" @click="submitShowModuleDeploy('ruleForm')">确 定</el-button>
    </div>
    </el-dialog>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import { userlist, userAdd, passwordreset, userdel, useredit } from "@/api/account";
import { showModuleDeployList, showModuleDeployList1 } from "@/api/showModuleDeploy";
import { roleslist } from "@/api/role";
import plupload from '@/components/plupload'


export default {
  components: {
    plupload,
  },
  name: 'showModuleDeploy',
  data() {
    return {
        searchsort:'',
      searchtitle: '',
      searchtype: '',
      currentPage: 1,
      totalPage: 0,
      pageSize: 10,
      dialogShowModuleDeployVisible: false,
      form: {
        name: '',
      },
      roleList: {},
      titleForm:'',
      rights_list: {},
      rulesShowModuleDeploy: {
        name: [
            { required: true, message: '请填写模块名称', trigger: 'blur' }
        ],
      },
      loadingShowModuleDeploy: false,
      loginForm: {
        username: 'admin',
        password: '111111'
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      tableData: [],
      showModuleDeployId: '',
      type:'',
      urlList: [
        {
          url: '/byd/web/index.php?r=reg/water_modulelist',
          data: {
            "title": "",
            "type": "",
            "uid": sessionStorage.getItem('uid')
          }
        },
      ]
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
      sortData(data, type){
          let rid = '';
          if(this.$route.path.indexOf('water') !== -1){
                rid = '1'
            }
            if(this.$route.path.indexOf('organisms') !== -1){
                rid = '2'
            }
            if(this.$route.path.indexOf('carbon') !== -1){
                rid = '3'
            }
            if(this.$route.path.indexOf('sub4') !== -1){
                rid = '4'
            }
            if(this.$route.path.indexOf('sub5') !== -1){
                rid = '5'
            }
            if(this.$route.path.indexOf('sub6') !== -1){
                rid = '6'
            }
            if(this.$route.path.indexOf('sub7') !== -1){
                rid = '7'
            }
            if(this.$route.path.indexOf('sub8') !== -1){
                rid = '8'
            }
          showModuleDeployList('/byd/web/index.php?r=reg/move', {
               "type": type,
                "sort": data.sort,
                "rid": rid,
                "mid": data.id,
                "uid": sessionStorage.getItem('uid')
          })
            .then(r => {
                this.getTableData()
                this.$message({
                        message: '排序成功！',
                        type: 'success'
                        });
                instance.confirmButtonLoading = false;
                }).catch(() => {}); 
      },
      tableSort(column, prop, order){
          if(column.order.indexOf('asc') !== -1){
             this.searchsort = 'asc'
          }else{
              this.searchsort = 'desc'
          }
          this.getTableData()
    },
    sizeChange(val){
        this.currentPage = 1;
        this.pageSize = val;
        this.getTableData()
    },
    currentChange(val){
        this.currentPage = val;
        this.getTableData()
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    seeShowModuleDeployButt(data) {
      this.$router.push({
                path:'editShowModule',
                query:{type: data.type, moduleName: this.form.name, fullPath: this.$route.fullPath , action: 'see', id: data.id}
        });
    },
    editShowModuleDeployButt(data) {
      this.showModuleDeployId = data.id
       this.$router.push({
                path:'editShowModule',
                query:{type: data.type, moduleName: this.form.name, fullPath: this.$route.fullPath , action: 'edit', id: data.id}
        });
    },
    addShowModuleDeployButt(formName) {
        console.log(this.type)
        if(this.type === ''){
            this.$message({
                message: '请选择类型！',
                type: 'warning'
            })
            return
        }
      this.showModuleDeployId = '';
      this.titleForm = `添加${this.type}模块标题`
      this.dialogShowModuleDeployVisible = true
    },
    cancelSubmit() {
      this.showModuleDeployId = '';
      this.dialogShowModuleDeployVisible = false;
      this.$refs[formName].resetFields();
    },
    submitShowModuleDeploy(formName) {
      this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$router.push({
                path:'editShowModule',
                query:{type: this.type, moduleName: this.form.name, fullPath: this.$route.fullPath , action: 'add'}
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },
    editDataFun(formName) {
      this.loadingShowModuleDeploy = true
      useredit({
              "username": this.form.name,
              "id": this.showModuleDeployId,
              "phone": this.form.phone,
              "roleid": this.form.role,
              "uid": sessionStorage.getItem('uid')})
            .then(r => {
              this.loadingShowModuleDeploy = false
              this.dialogShowModuleDeployVisible = false
              this.$refs[formName].resetFields();
              this.getTableData()
            })
            .catch(() => {
              this.loadingShowModuleDeploy = false
            });
    },
    publishData(data1,type) {
      let url = '';
      let data = {};
      if(this.$route.path.indexOf('water') !== -1){
        url = '/byd/web/index.php?r=reg/water_modulepub'
      }
      if(this.$route.path.indexOf('organisms') !== -1){
        url = '/byd/web/index.php?r=reg/organisms_modulepub'
      }
      if(this.$route.path.indexOf('carbon') !== -1){
        url = '/byd/web/index.php?r=reg/carbon_modulepub'
      }
      if(this.$route.path.indexOf('sub4') !== -1){
        url = '/byd/web/index.php?r=reg/sub4_modulepub'
      }
      if(this.$route.path.indexOf('sub5') !== -1){
        url = '/byd/web/index.php?r=reg/sub5_modulepub'
      }
      if(this.$route.path.indexOf('sub6') !== -1){
        url = '/byd/web/index.php?r=reg/sub6_modulepub'
      }
      if(this.$route.path.indexOf('sub7') !== -1){
        url = '/byd/web/index.php?r=reg/sub7_modulepub'
      }
      if(this.$route.path.indexOf('sub8') !== -1){
        url = '/byd/web/index.php?r=reg/sub8_modulepub'
      }
      if(type === 'all'){
        data= {
             "id": 0,
              "type": "all",
              "uid": sessionStorage.getItem('uid')
          }
          const h = this.$createElement;
          this.$msgbox({
          title: '确认',
          message: h('p', null, [
            h('span', null, '确认全部发布 '),
          ]),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '发布中...';
              showModuleDeployList(url, data)
            .then(r => {
                this.getTableData()
                this.$message({
                        message: '发布成功！',
                        type: 'success'
                        });
                done();
                instance.confirmButtonLoading = false;
                }).catch(() => {}); 
                
            } else {
              done();
            }
          }
        }).then(action => {
        });
      }else{
        data= {
             "id": data1.id,
              "type": "one",
              "uid": sessionStorage.getItem('uid')
          }
          showModuleDeployList(url, data)
            .then(r => {
                this.getTableData()
                this.$message({
                        message: '发布成功！',
                        type: 'success'
                        });
                }).catch(() => {}); 
      }
      
    
    },
    showModuleDeployDel(data1) {
      let url = '';
      let data = {};
        data= {
              "id": data1.id,
              "uid": sessionStorage.getItem('uid')
          }
      if(this.$route.path.indexOf('water') !== -1){
        url = '/byd/web/index.php?r=reg/water_moduledel'
      }
      if(this.$route.path.indexOf('organisms') !== -1){
        url = '/byd/web/index.php?r=reg/organisms_moduledel'
      }
      if(this.$route.path.indexOf('carbon') !== -1){
        url = '/byd/web/index.php?r=reg/carbon_moduledel'
      }
      if(this.$route.path.indexOf('sub4') !== -1){
        url = '/byd/web/index.php?r=reg/sub4_moduledel'
      }
      if(this.$route.path.indexOf('sub5') !== -1){
        url = '/byd/web/index.php?r=reg/sub5_moduledel'
      }
      if(this.$route.path.indexOf('sub6') !== -1){
        url = '/byd/web/index.php?r=reg/sub6_moduledel'
      }
      if(this.$route.path.indexOf('sub7') !== -1){
        url = '/byd/web/index.php?r=reg/sub7_moduledel'
      }
      if(this.$route.path.indexOf('sub8') !== -1){
        url = '/byd/web/index.php?r=reg/sub8_moduledel'
      }
    showModuleDeployList(url, data)
      .then(r => {
        this.getTableData()
        this.$message({
                message: '删除成功！',
                type: 'success'
                });
        }).catch(() => {}); 
    },
    getTableData() {
      let url ='';let data = {};
    if(this.$route.path.indexOf('water') !== -1){
      url = '/byd/web/index.php?r=reg/water_modulelist',
          data= {
            "title": "",
            "type": "",
            "uid": sessionStorage.getItem('uid')
          }
    }
    if(this.$route.path.indexOf('organisms') !== -1){
      url = '/byd/web/index.php?r=reg/organisms_modulelist',
          data= {
            "title": "",
            "type": "",
            "uid": sessionStorage.getItem('uid')
          }
    }
    if(this.$route.path.indexOf('carbon') !== -1){
        url = '/byd/web/index.php?r=reg/carbon_modulelist'
        data= {
            "title": "",
            "type": "",
            "uid": sessionStorage.getItem('uid')
          }
      }
      if(this.$route.path.indexOf('sub4') !== -1){
        url = '/byd/web/index.php?r=reg/sub4_modulelist'
        data= {
            "title": "",
            "type": "",
            "uid": sessionStorage.getItem('uid')
          }
      }
      if(this.$route.path.indexOf('sub5') !== -1){
        url = '/byd/web/index.php?r=reg/sub5_modulelist'
        data= {
            "title": "",
            "type": "",
            "uid": sessionStorage.getItem('uid')
          }
      }
      if(this.$route.path.indexOf('sub6') !== -1){
        url = '/byd/web/index.php?r=reg/sub6_modulelist'
        data= {
            "title": "",
            "type": "",
            "uid": sessionStorage.getItem('uid')
          }
      }
      if(this.$route.path.indexOf('sub7') !== -1){
        url = '/byd/web/index.php?r=reg/sub7_modulelist'
        data= {
            "title": "",
            "type": "",
            "uid": sessionStorage.getItem('uid')
          }
      }
      if(this.$route.path.indexOf('sub8') !== -1){
        url = '/byd/web/index.php?r=reg/sub8_modulelist'
        data= {
            "title": "",
            "type": "",
            "uid": sessionStorage.getItem('uid')
          }
      }
      data.pages = this.currentPage;
      data.pagesize = this.pageSize;
      data.title = this.searchtitle;
      data.type = this.searchtype;
      data.sort = ''
      showModuleDeployList(url, data)
      .then(r => {
          console.log(r.data.data_list)
            this.tableData = r.data.data_list;
            this.totalPage = r.data.datacount
            r.data.rights_list.map(item=>{
              this.rights_list[item.rights] = item.rights_id
            })
        }).catch(() => {});
    },
    handleFileChange(fileList) {
      console.log('handleFileChange', fileList)
}
  },
  mounted: function() {
    console.log(this.$route.path, 'this.$router')
      this.getTableData()
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
.role{
  height: 100%;
  background: #fff;
}
</style>
