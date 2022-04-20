<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <span style="display: inline-block;
    font-size: 18px;
    font-weight: 500;
    margin-right: 10px;
    position: relative;
    top: -12px;">{{name}}:{{phone}}</span>
          <img src="http://mob.hexntc.com/byd/web/uploads/touxiang.jpg" class="user-avatar">
          <i class="el-icon-caret-bottom user-avatar" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item divided @click.native="showeditpassword">
            <span style="display:block;">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog
    title="修改密码"
    :visible.sync="dialogVisible"
    width="30%"
    :before-close="handleClose">
    <el-form :model="form" :rules="rulesAccount" ref="ruleForm" label-width="100px">
        <el-form-item label="原密码" prop="oldword">
        <el-input style="width: 300px"  v-model="form.oldword" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newword">
        <el-input style="width: 300px"  v-model="form.newword" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmword">
        <el-input style="width: 300px"  v-model="form.confirmword" autocomplete="off"></el-input>
        </el-form-item>
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="canceleditword">取 消</el-button>
        <el-button type="primary" @click="editword">确 定</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { showModuleDeployList } from "@/api/showModuleDeploy";

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data(){
      let validateNewPassword2 = (rule, value, callback) => {
                if(value !== this.form.newword) {
                    callback(new Error('与新密码不一致!'))
                } else if(value === this.form.oldword) {
                    callback(new Error('与旧密码重复!'))
                } else {
                    callback()
                }
            }
            const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于6位'))
      } else {
        callback()
      }
    }
      return{
          name: sessionStorage.getItem('jd_name'),
          phone: sessionStorage.getItem('jd_phone'),
          dialogVisible:false,
          rulesAccount: {
            oldword: [
                { required: true, message: '请填写原密码', trigger: 'blur' }
            ],
            newword: [
                { required: true, message: '请填写新密码', trigger: 'blur' },
                {
                    validator: validatePassword,
                    trigger: 'blur'
                }
            ],
            confirmword: [
                { required: true, message: '请填写确认密码', trigger: 'blur' },
                {
                    validator: validateNewPassword2,
                    trigger: 'blur'
                }
            ],
        },
        form: {
            oldword: '',
            newword: '',
            confirmword: '',
        },
        dialog:false
      }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  watch:{
   $route(to,from){
     console.log(to.path);
   }
},
  mounted(){
      if(sessionStorage.getItem('upd') === '0'&&sessionStorage.getItem('dialog') == null){
           const h = this.$createElement;
        this.$msgbox({
          title: '提示',
          message: h('p', null, [
            h('span', null, '您当前使用的密码是初始密码，为了确保账户安全，建议先修改登录密码！ '),
          ]),
          showCancelButton: true,
          confirmButtonText: '修改密码',
          cancelButtonText: '知道了',
          
        }).then(action => {
          this.dialogVisible = true
        });
          sessionStorage.setItem('dialog','1')
          
      }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      // await this.$store.dispatch('user/logout')
      this.$router.push(`/login`)
      sessionStorage.removeItem("jd_uid")
      sessionStorage.removeItem("jd_phone")
      sessionStorage.removeItem("jd_name")
      sessionStorage.removeItem("dialog")
    },
    showeditpassword(){
        if(this.$refs.ruleForm){
            this.$refs.ruleForm.resetFields();
        }
        this.dialogVisible = true;
    },
    canceleditword(){
        this.$refs.ruleForm.resetFields();
        this.dialogVisible = false;
    },
    editword(){
        // this.$refs[formName].resetFields();
        this.$refs.ruleForm.validate(valid => {
            if (valid) {
            showModuleDeployList('/byd/web/index.php?r=reg/passwordupd', {
            "old": this.form.oldword,
            "new": this.form.newword,
            "uid": sessionStorage.getItem('jd_uid')
        }).then(r => {
            this.$router.push(`/login`)
            sessionStorage.removeItem("jd_uid")
            sessionStorage.removeItem("jd_phone")
            sessionStorage.removeItem("jd_name")
            sessionStorage.removeItem("dialog")
        })
            .catch(() => {
            });
            } else {
            console.log('error submit!!')
            return false
            }
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
