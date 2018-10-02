<template>
    <div style="text-align:center;margin-top:-80px;">
        <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px"
                 class="demo-ruleForm login-container" style="text-align:right">
            <h1 class="title">在校生登录</h1>
            <el-form-item prop="account">
                <el-input type="text" v-model="ruleForm2.account" placeholder="账号" autofocus
                          @keyup.enter.native="handleSubmit2">
                </el-input>
            </el-form-item>
            <el-form-item prop="checkPass">
                <el-input type="password" v-model="ruleForm2.checkPass" placeholder="密码"
                          @keyup.enter.native="handleSubmit2"></el-input>
            </el-form-item>
            <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
            <el-form-item style="width:100%;">
                <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2" :loading="logining">
                    登录
                </el-button>
                <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
            </el-form-item>
        </el-form>

        <p style="display:inline-block;text-decoration:none;height:20px;line-height:20px;">
            <img href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=33011802001296"
                 src="../assets/ba.png" style="float:left;"/>
            <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=33011802001296"
               style="float:left;height:20px;line-height:20px;margin: 0px 0px 0px 5px; color:#939393;"
               target="_blank">
                浙公网安备 33011802001296号
            </a>
            <a style="float:left;height:20px;line-height:20px;margin: 0px 0px 0px 5px; color:#939393;"
               target="_blank">
                &emsp;&emsp;©2018 Zhang Chong All Rights Reserved&emsp;&emsp;
            </a>
            <a href="http://www.miitbeian.gov.cn/"
               style="float:left;height:20px;line-height:20px;margin: 0px 0px 0px 5px; color:#939393;"
               target="_blank">
                浙ICP备17043890号
            </a>
        </p>
    </div>
</template>

<script>
    import {login} from '../api/api';
    import util from '../common/js/util'

    export default {
        data() {
            return {
                logining: false,
                ruleForm2: {
                    account: '',
                    checkPass: ''
                },
                rules2: {
                    account: [
                        {required: true, message: '请输入账号', trigger: 'blur'},
                        //{ validator: validaePass }
                    ],
                    checkPass: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        //{ validator: validaePass2 }
                    ]
                },
                checked: true
            };
        },
        methods: {
            handleReset2() {
                this.$refs.ruleForm2.resetFields();
            },
            handleSubmit2() {
                let _this = this;
                this.$refs.ruleForm2.validate((valid) => {
                    if (valid) {
                        // _this.$router.replace('/table');
                        if (!util.checkAccount(this.ruleForm2.account)) {
                            this.$message({
                                message: "请输入合法账号",
                                type: 'error'
                            });
                            return;
                        }
                        if (!util.checkPsw(this.ruleForm2.checkPass)) {
                            this.$message({
                                message: "请输入合法密码",
                                type: 'error'
                            });
                            return;
                        }
                        this.logining = true;
                        let loginParams = {
                            username: this.ruleForm2.account,
                            password: this.ruleForm2.checkPass
                        };
                        login(loginParams).then(data => {
                            this.logining = false;
                            if (data === "") {
                                this.$message({
                                    message: "用户名或密码错误",
                                    type: 'error'
                                });
                            } else {
                                sessionStorage.setItem('user', data.username);
                                sessionStorage.setItem('date', util.formatDate.format(new Date(), 'yyyy-MM-dd'));
                                _this.$router.push({path: '/table'});
                            }
                        }).catch(error => {
                            this.logining = false;
                        });
                    } else {
                        return false;
                    }
                });
            }
        }
    }

</script>

<style lang="scss" scoped>
    .login-container {
        /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
        -webkit-border-radius: 5px;
        border-radius: 5px;
        -moz-border-radius: 5px;
        background-clip: padding-box;
        margin: 180px auto;
        width: 350px;
        padding: 35px 35px 15px 35px;
        background: #fff;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 25px #cac6c6;
        .title {
            margin: 0px auto 40px auto;
            text-align: center;
            color: #505458;
        }
        .remember {
            margin: 0px 0px 35px 0px;
        }
    }
</style>