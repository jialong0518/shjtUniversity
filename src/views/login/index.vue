<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">上海交通大学专家管理系统</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="账号"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登录</el-button>
      <el-button style="width:100%;margin-bottom:30px;margin-left:0;" @click.native.prevent="goEmpower">上海交通大学统一身份认证</el-button>

      

    </el-form>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import { login, goEmpower } from "@/api/user";
import { resetRouter } from '@/router'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入账号'))
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
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '请输入账号' }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
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
    goEmpower() {
      // ?code=6118ae9a113d44f892bfd15b877adef8
      window.location.href ='https://jaccount.sjtu.edu.cn/oauth2/authorize?response_type=code&scope=essential&client_id=HTjYQXuT3U1QqTp8h0ug&redirect_uri=https://expert.sjtu.edu.cn/jdexpert/admin/index.html#/login';
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
      
      
      login(Object.assign({},this.loginForm))
      .then(r => {
        if(r.code === 1){
          this.$message.error(r.msg);
          return
        }
        if (!r.data.hasOwnProperty("uid")) {
          this.$message.error('请先确认账号密码！');
          return
        }
        if (!r.data.hasOwnProperty("type")) {
          this.$message.error('请先确认账号密码！');
          return
        }
        resetRouter()
        sessionStorage.setItem("jd_uid",r.data.uid)
        sessionStorage.setItem("jd_date",r.data.date)
        sessionStorage.setItem("jd_phone",r.data.phone)
        sessionStorage.setItem("jd_name",r.data.name)
        sessionStorage.setItem("jd_powerType",r.data.type)
        sessionStorage.setItem("ifupdpassword",r.data.ifupdpassword)
        if(sessionStorage.getItem('jd_powerType') === '5') {
          this.$router.push({ path:  '/secretary/secretary' })
        } else {
          this.$router.push({ path:  '/expertSeniority/expertSeniority' })
        }
        
      })
      .catch(() => {});
      // this.$refs.loginForm.validate(valid => {
      //   if (valid) {
      //     this.loading = true
      //     this.$store.dispatch('user/login', this.loginForm).then(() => {
      //       this.$router.push({ path: this.redirect || '/' })
      //       this.loading = false
      //     }).catch(() => {
      //       this.loading = false
      //     })
      //   } else {
      //     console.log('error submit!!')
      //     return false
      //   }
      // })
    }
  },
  mounted() {
    sessionStorage.clear()
    let url = window.location.href;
    let urlArr = [];
    // let url_ = 'https:///jdexpert/admin/index.html?code=66a3e83a6bb347c1bc6b11d7a31b7ab5#/login?back=index.html'
    if(url.indexOf('index.html?code=') !== -1){
      urlArr = url.split('index.html?code=');
      urlArr = urlArr[1].split('#/login')[0];
      window.location.href = `https://expert.sjtu.edu.cn/jdexpert/admin/index.html#/login?code=${urlArr}`
    }
    console.log(this.$route.query.code)
    if(this.$route.query.code){
      goEmpower({code: this.$route.query.code})
      .then(r => {
        if(r.code === 1){
          this.$message.error(r.msg);
          return
        }
        if (!r.data.hasOwnProperty("uid")) {
          this.$message.error('请先确认账号密码！');
          return
        }
        if (!r.data.hasOwnProperty("type")) {
          this.$message.error('请先确认账号密码！');
          return
        }
        resetRouter()
        sessionStorage.setItem("jd_uid",r.data.uid)
        sessionStorage.setItem("jd_date",r.data.date)
        sessionStorage.setItem("jd_phone",r.data.phone)
        sessionStorage.setItem("jd_name",r.data.name)
        sessionStorage.setItem("jd_powerType",r.data.type)
        sessionStorage.setItem("ifupdpassword",r.data.ifupdpassword)
        if(sessionStorage.getItem('jd_powerType') === '5') {
          this.$router.push({ path:  '/secretary/secretary' })
        } else {
          this.$router.push({ path:  '/expertSeniority/expertSeniority' })
        }
      })
      .catch(() => {});
    }
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
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
