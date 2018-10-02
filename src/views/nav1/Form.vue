<template>
    <el-form ref="form" :model="form" label-width="80px" style="margin:20px;width:20%;min-width:500px;">
        <el-form-item label="账户昵称">
            <el-input v-model="form.name" :readonly="true" disabled></el-input>
        </el-form-item>
        <el-form-item label="修改密码">
            <el-input v-model="form.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码">
            <el-input v-model="form.repassword" type="password"></el-input>
        </el-form-item>
        <el-form-item align="right">
            <el-button @click.native.prevent style="margin-right: 20px;">取消</el-button>
            <el-button type="primary" @click="save">保存</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import {resetPass} from '../../api/api';
    import util from '../../common/js/util'

    export default {
        data() {
            return {
                form: {
                    name: sessionStorage.getItem('user'),
                    password: '',
                    repassword: ''
                }
            }
        },
        methods: {
            save() {
                if (this.form.password !== this.form.repassword) {
                    this.$message({
                        message: "两次密码不一致",
                        type: 'warning'
                    });
                    return;
                }
                if (!util.checkPsw(this.form.password)) {
                    this.$message({
                        message: "请输入合法密码",
                        type: 'error'
                    });
                    return;
                }
                let resetParams = {
                    username: this.form.name,
                    password: this.form.password
                };
                resetPass(resetParams).then(data => {
                    if (data === "") {
                        this.$message({
                            message: "修改失败，请联系开发人员",
                            type: 'error'
                        });
                    } else {
                        this.form.password = '';
                        this.form.repassword = '';
                        this.$message({
                            message: "修改成功",
                            type: 'success'
                        });
                    }
                    //NProgress.done();
                });
            }
        }
    }

</script>