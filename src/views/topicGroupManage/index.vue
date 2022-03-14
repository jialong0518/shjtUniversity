<template>
  <div class="topicGroup">
      <el-row :gutter="20" style="padding: 20px;">
    <el-col :span="6">
        <div style="display: inline-block;width:25%;">课题名称：</div>
        <el-input style="width: 75%" v-model="searchtitle" autocomplete="off"></el-input>
    </el-col>
    <el-col :span="6">
        <div style="display: inline-block;width:30%;">负责人姓名：</div>
        <el-input style="width: 70%" v-model="searchlinkman" autocomplete="off"></el-input>
    </el-col>
    <el-col :span="6">
        <el-button type="primary" @click="getTableData()">搜索</el-button>
    </el-col>
    </el-row>
    <div style="padding: 15px;overflow: hidden;">
      <el-button type="primary" v-if="rights_list['发布']" style="float:right;" @click="pubTopicGroupButt('', 'all')">全部发布</el-button>
    </div>
    <el-table
    :data="tableData"
    @sort-change="tableSort"
    border
    style="width: 100%">
    <el-table-column
      prop="sort"
      label="展示顺序"
      sortable
      width="180">
    </el-table-column>
    <el-table-column
      prop="title"
      label="课题名称"
      width="180">
    </el-table-column>
    <el-table-column
      prop="linkman"
      label="负责人姓名">
    </el-table-column>
    <el-table-column
      prop="display"
      label="是否显示">
    </el-table-column>
    <el-table-column
      label="操作">
      <template slot-scope="scope">
        <el-button v-if="rights_list['查看']" @click="seeTopicGroupButt(scope.row)" type="text" size="small">查看</el-button>
        <el-button v-if="rights_list['编辑']" type="text" @click="editTopicGroupButt(scope.row)" size="small">编辑</el-button>
        <el-popconfirm
            title="确认发布吗？"
            @onConfirm="pubTopicGroupButt(scope.row, 'one')" 
        >
        <el-button style="margin: 0 10px;" v-if="rights_list['发布']" slot="reference"  type="text" size="small">发布</el-button>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog :title="titleForm" :visible.sync="dialogTopicGroupVisible">
  <el-form :model="form" :rules="rulesTopicGroup" ref="ruleForm" label-width="100px">
    <el-form-item label="课题名称" prop="title">
      <el-input style="width: 300px" :disabled="titleForm.indexOf('查看')!== -1" v-model="form.title" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="负责人姓名" prop="name">
      <el-input style="width: 300px" :disabled="titleForm.indexOf('查看')!== -1" v-model="form.name" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="显示/隐藏" prop="isShow">
    <el-select style="width: 300px" :disabled="titleForm.indexOf('查看')!== -1" v-model="form.isShow" placeholder="请选择显示/隐藏">
        <el-option label="显示" value="显示"></el-option>
        <el-option label="隐藏" value="隐藏"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="展示顺序" prop="order">
      <el-select style="width: 300px" :disabled="titleForm.indexOf('查看')!== -1" v-model="form.order" placeholder="请选择展示顺序">
        <el-option label="1" value="1"></el-option>
        <el-option label="2" value="2"></el-option>
        <el-option label="3" value="3"></el-option>
        <el-option label="4" value="4"></el-option>
        <el-option label="5" value="5"></el-option>
        <el-option label="6" value="6"></el-option>
        <el-option label="7" value="7"></el-option>
        <el-option label="8" value="8"></el-option>
      </el-select>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="cancelSubmit('ruleForm')">取 消</el-button>
    <el-button :disabled="titleForm.indexOf('查看')!== -1" :loading="loadingTopicGroup" type="primary" @click="submitTopicGroup('ruleForm')">确 定</el-button>
  </div>
</el-dialog>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import { userlist, userAdd, passwordreset } from "@/api/account";
import { roleslist } from "@/api/role";
import { researchlist, edit } from "@/api/topicGroupManage";
  

export default {
  name: 'Login',
  data() {
    return {
        searchsort:'',
        searchlinkman:'',
        searchtitle:'',
      dialogTopicGroupVisible: false,
      form: {
        name: '',
        isShow: '',
        order: '',
        title: '',
      },
      roleList: {},
      titleForm:'',
      rights_list: {},
      rulesTopicGroup: {
        name: [
            { required: true, message: '请填写负责人名字', trigger: 'blur' }
        ],
        isShow: [
            { required: true, message: '请选择显示/隐藏', trigger: 'change' }
        ],
        order: [
            { required: true, message: '请选择顺序', trigger: 'change' }
        ],
        title: [
            { required: true, message: '请填写课题名称', trigger: 'blur' }
        ],
      },
      loadingTopicGroup: false,
      loginForm: {
        username: 'admin',
        password: '111111'
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      tableData: [],
      topicGroupId: ''
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
      tableSort(column, prop, order){
          if(column.order.indexOf('asc') !== -1){
             this.searchsort = 'asc'
          }else{
              this.searchsort = 'desc'
          }
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
    // this.$refs[formName].resetFields();
    seeTopicGroupButt(data) {
      console.log(data)
      this.form = {
        name: data.linkman,
        isShow: data.display,
        order: data.sort
      }
      this.titleForm = `${data.title}查看`
      this.dialogTopicGroupVisible = true
    },
    editTopicGroupButt(data) {
      this.form = {
        name: data.linkman,
        isShow: data.display,
        order: data.sort,
        title: data.title
      }
      this.topicGroupId = data.id
      this.titleForm = `${data.title}编辑`
      this.dialogTopicGroupVisible = true
    },
    addTopicGroupButt(formName) {
      this.topicGroupId = '';
      this.titleForm = '添加课题组'
      this.dialogTopicGroupVisible = true
    },
    cancelSubmit(formName) {
      this.topicGroupId = '';
      this.dialogTopicGroupVisible = false;
      this.$refs[formName].resetFields();
    },
    allpub(){
      let urlarr = [
        '/byd/web/index.php?r=reg/water_researchpub',
        '/byd/web/index.php?r=reg/organisms_researchpub',
        '/byd/web/index.php?r=reg/carbon_researchpub',
        '/byd/web/index.php?r=reg/sub4_researchpub',
        '/byd/web/index.php?r=reg/sub5_researchpub',
        '/byd/web/index.php?r=reg/sub6_researchpub',
        '/byd/web/index.php?r=reg/sub7_researchpub',
        '/byd/web/index.php?r=reg/sub8_researchpub',
      ];
      urlarr.map(item=>{
        edit(item,{"uid": sessionStorage.getItem('uid')})
            .then(r => {
              this.$message({
                message: '发布成功！',
                type: 'success'
                });
              this.getTableData() 
            })
            .catch(() => {
            });
      })
    },
    pubTopicGroupButt(data1, type){
      let url= '/byd/web/index.php?r=reg/researchpub';
      let data ={}
      
      if(type === 'all'){
        data = {
          uid:1
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
              edit(url, data)
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
        if(data1.id === '1') url='/byd/web/index.php?r=reg/water_researchpub'
        if(data1.id === '2') url='/byd/web/index.php?r=reg/organisms_researchpub'
        if(data1.id === '3') url='/byd/web/index.php?r=reg/carbon_researchpub'
        if(data1.id === '4') url='/byd/web/index.php?r=reg/sub4_researchpub'
        if(data1.id === '5') url='/byd/web/index.php?r=reg/sub5_researchpub'
        if(data1.id === '6') url='/byd/web/index.php?r=reg/sub6_researchpub'
        if(data1.id === '7') url='/byd/web/index.php?r=reg/sub7_researchpub'
        if(data1.id === '8') url='/byd/web/index.php?r=reg/sub8_researchpub'
        data = {
          uid:1,
        }
        edit(url,data)
            .then(r => {
                this.$message({
                message: '发布成功！',
                type: 'success'
                });
              this.getTableData() 
            })
            .catch(() => {
            });
      }
      
    },
    submitTopicGroup(formName) {
      this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loadingTopicGroup = true
            let url= '';
            if(this.topicGroupId === '1') url='/byd/web/index.php?r=reg/water_researchedit'
            if(this.topicGroupId === "2") url='/byd/web/index.php?r=reg/organisms_researchedit'
            if(this.topicGroupId === "3") url='/byd/web/index.php?r=reg/carbon_researchedit'
            if(this.topicGroupId === "4") url='/byd/web/index.php?r=reg/sub4_researchedit'
            if(this.topicGroupId === "5") url='/byd/web/index.php?r=reg/sub5_researchedit'
            if(this.topicGroupId === "6") url='/byd/web/index.php?r=reg/sub6_researchedit'
            if(this.topicGroupId === "7") url='/byd/web/index.php?r=reg/sub7_researchedit'
            if(this.topicGroupId === "8") url='/byd/web/index.php?r=reg/sub8_researchedit'
            edit(url,{
              "title": this.form.title,
              "linkman": this.form.name,
              "display": this.form.isShow,
              "sort": this.form.order,
              "uid": sessionStorage.getItem('uid')})
            .then(r => {
              this.loadingTopicGroup = false
              this.dialogTopicGroupVisible = false
              this.$refs[formName].resetFields();
              this.getTableData() 
              console.log(r)
            })
            .catch(() => {
              this.loadingTopicGroup = false
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },
    resetTopicGroup(data) {
        passwordreset({
            "id": data.id,
            "uid": sessionStorage.getItem('uid')})
            .then(r => {
              console.log(r)
            })
            .catch(() => {
            });      
    },
    getTableData() {
      researchlist({"title": this.searchtitle,
      "linkman": this.searchlinkman,
      "uid": sessionStorage.getItem('uid'),
      "sort": this.searchsort
      })
      .then(r => {
            this.tableData = r.data.data_list;
            r.data.rights_list.map(item=>{
            this.rights_list[item.rights] = item.rights_id
            })  
        }).catch(() => {});
      // roleslist({"rolename": "",
    // "memo": "",
    // "uid": sessionStorage.getItem('uid')})
    //   .then(r => {
    //       this.roleList = r.data.data_list
    //         console.log(r)            
    //     }).catch(() => {});
    }
  },
  mounted: function() {
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
