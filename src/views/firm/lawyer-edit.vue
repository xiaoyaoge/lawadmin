<template>
    <section v-loading="listLoading">
        <div class="cont-btns mb15">
            <a class="bk-button bk-default bk-button-small fl" title="返回" @click="$router.push('/lawyer')">
                <span>返回</span>
            </a>
        </div>
        <div class="info">
            <div class="bk-panel-body p25 cont">
                <div class="b-manage-title">
                    <h5 class="fl">律师详情</h5>
                    <div class="edit-btns b-manage-btns fr">
                        <!-- 交互说明
                             点击修改后，把保存于取消按钮显示出来，同时把info里所有input 的 readonly 去除
                        -->
                        <a v-show="formEditBtn" class="bk-button bk-primary bk-button-small ml10 fr" @click="editIonf('edit')" title="修改"><span>修改</span></a>
                        <a v-show="!formEdit" class="bk-button bk-success bk-button-small ml10 fr" @click="severInfo" title="保存"><span>保存</span></a>
                        <a v-show="!formEdit" class="bk-button bk-default bk-button-small ml10 fr" @click="editIonf('cancel')" title="取消"><span>取消</span></a>
                    </div>
                </div>
                <form class="bk-form" id="validate_form" method="POST" action="javascript:;">
                    <div class="bk-form-item">
                        <label class="bk-label"><span class="red">*</span>律师名称：</label>
                        <div class="bk-form-content">
                            <el-input v-if="!formEdit" type="text" v-model="lawyer.name" placeholder="请输入律师名称"></el-input>
                            <div v-else>{{lawyer.name}}</div>
                        </div>
                    </div>
                    <div class="bk-form-item mt5">
                        <label class="bk-label"><span class="red">*</span>律师标签：</label>
                        <div class="bk-form-content">
                            <el-input v-if="!formEdit" type="textarea" v-model="lawyer.title" placeholder="请输入律师标签（如：清华大学研究生、刑法专家）"></el-input>
                            <div v-else>{{lawyer.title}}</div>
                        </div>
                    </div>
                    <div class="bk-form-item mt5">
                        <label class="bk-label"><span class="red">*</span>律师头像：</label>
                        <div class="bk-form-content" v-if="!formEdit">
                            <div class="img-box" style="height:80px; width:100px; margin-bottom:0;">
                                <img :src="(lawyer.avatar||defaultImgUrl)+'?x-oss-process=image/resize,w_100,h_80'">
                            </div>
                            <a class="bk-button bk-primary" @click="modifyUpload('用户头像','avatar')">{{lawyer.avatar?'修改照片':'上传照片'}}</a>
                        </div>
                        <div class="bk-form-content" v-else><img :src="(lawyer.avatar||defaultImgUrl)+'?x-oss-process=image/resize,w_160'"></div>
                    </div>
                    <div class="bk-form-item mt5">
                        <label class="bk-label"><span class="red">*</span>律师简介：</label>
                        <div class="bk-form-content">
                            <quill-editor v-if="!formEditBtn" ref="myTextEditor" v-model="lawyer.introduction" :config="editorOption" @blur="onEditorBlur($event)" @focus="onEditorFocus($event)" @ready="onEditorReady($event)"></quill-editor>
                            <div v-else v-html="lawyer.introduction||'&nbsp;'">&nbsp;</div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </section>
</template>
<script>
import moment from 'moment'
import md5 from 'js-md5';
import validate from '../../validate';
import { quillEditor } from 'vue-quill-editor'
export default {
    name: 'Edit',
    components: {
        'quillEditor': quillEditor
    },
    data() {
        return {
            defaultImgUrl: '',
            collapsed: true,
            collapsedText: '显示更多查询条件',
            formEdit: true,
            formEditBtn: true,
            lawyer: {
                avatar: '',
                title: '',
                introduction: "",
                name: ''
            },
            uploadTitle: '',
            uploadType: '',
            uploadVisible: false,
            dialogVisible: false,
            dialogImageUrl: '',
            uploadPolicy: {
                host: ''
            },
            uploadConfig: {
                multiple: true,
                thread: 5,
                data: {},
                accept: 'image/png,image/gif,image/jpeg,image/webp'
            },
            fileList: [],
            listLoading: false,
            editorOption: {
                theme: 'snow',
                placeholder: "输入任何内容，支持html",
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                        [{ 'color': [] }, { 'background': [] }],
                        [{ 'align': [] }],
                        ['link', 'image', 'video'],
                        ['clean']
                    ]
                }
            }
        }
    },
    methods: {
        onEditorBlur(editor) {
            console.log('editor blur!', editor)
        },
        onEditorFocus(editor) {
            console.log('editor focus!', editor)
        },
        onEditorReady(editor) {
            console.log('editor ready!', editor)
        },
        onEditorChange({ editor, html, text }) {
            console.log('editor change!', editor, html, text)
            this.lawyer.content = html
        },

        dateTime(val) {
            return moment(val).format('YYYY-MM-DD HH:mm:ss');
        },
        editIonf(type) {
            if (type === 'edit') {
                this.formEdit = false;
                this.formEditBtn = false;
            } else {
                this.formEdit = true;
                this.formEditBtn = true;
                this.getDataList();
            }
        },
        balanceEditIonf(type) {
            if (type === 'edit') {
                this.balanceEdit = false;
                this.balanceEditBtn = false;
            } else {
                this.balanceEdit = true;
                this.balanceEditBtn = true;
            }
        },
        balanceSeverInfo() {
            let params = {
                balanceInfo: this.balanceInfo
            };
            this.$confirm('确认修改吗？', '提示', {}).then(() => {
                this.listLoading = true;
                this.$http.ajaxPost({
                    url: this.balanceUrl,
                    params: params
                }, (res) => {
                    this.$http.aop(res, () => {
                        if (res.body.ret == '0') {
                            this.$message({
                                message: '编辑成功',
                                type: 'success'
                            });
                        } else {
                            this.getDataList();
                        }

                    });
                    this.balanceEdit = true;
                    this.balanceEditBtn = true;
                    this.listLoading = false;
                });
            }).catch(() => {
                this.getDataList();
                this.$message({
                    type: 'info',
                    message: '已取消'
                });
            });

        },
        handleCurrentChange(val) {
            this.table.pageNum = val;
            this.getDataList();
        },
        getDataList() {
            let params = {};
            params = {
                lid: this.$route.params.id
            };

            this.listLoading = true;
            this.$http.ajaxPost({
                url: 'lawyer/getInfo',
                params: params
            }, (res) => {
                this.$http.aop(res, () => {
                    let data = res.body.data;
                    this.lawyer = data || { avatar: '', title: '', introduction: "", name: '' };
                    this.listLoading = false;
                });
            });
        },
        checkForm(data) { //验证担保人信息
            let isOk = true;
            let text = '';
            Object.keys(data).forEach((val) => {
                switch (val) {
                    case 'title':
                        if (data[val] === '') {
                            text = '标题不能为空';
                            isOk = false;
                        }
                        break;
                    case 'category':
                        if (data[val] === '') {
                            text = '请选着类别';
                            isOk = false;
                        }
                        break;
                    case 'brief':
                        if (data[val] === '') {
                            text = '请输入简介';
                            isOk = false;
                        }
                        break;
                    case 'content':
                        if (data[val] === '') {
                            text = '请输入内容';
                            isOk = false;
                        }
                        break;
                }
            });
            if (!isOk) {
                this.$message.error(text);
                return false;
            }
            return true;
        },
        severInfo() {
            let params = {
                lawyer: this.lawyer,
            };
            params.lawyer.lid = this.$route.params.id;
            if (this.checkForm(params.lawyer)) {
                this.$confirm('确认修改吗？', '提示', {}).then(() => {
                    this.listLoading = true;
                    this.$http.ajaxPost({
                        url: 'lawyer/modify',
                        params: params.lawyer
                    }, (res) => {
                        this.$http.aop(res, () => {
                            if (res.body.ret == '0') {
                                this.$message({
                                    message: '编辑成功',
                                    type: 'success'
                                });
                            } else {
                                this.getDataList();
                            }
                        });
                        this.formEdit = true;
                        this.formEditBtn = true;
                        this.listLoading = false;
                    });
                }).catch(() => {
                    this.getDataList();
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            }
        },
        modifyUpload(title, type) { // 初始化上传控件 
            if (type !== this.uploadType) {
                this.fileList = [];
            }
            this.$http.post('upload/getAliyunPostPolicy', {}).then((res) => {
                this.$http.aop(res, () => {
                    this.uploadPolicy = res.body.data || {};
                    this.uploadConfig.data.policy = this.uploadPolicy.policy;
                    this.uploadConfig.data.OSSAccessKeyId = this.uploadPolicy.accessid;
                    this.uploadConfig.data.signature = this.uploadPolicy.signature;

                    this.uploadTitle = title;
                    this.uploadType = type;
                    this.uploadVisible = true;
                });
            }, (res) => {
                this.$http.aop(res);
            });
        },
        closeDebtDialog() {
            this.uploadVisible = false;
        },
        uploadSuccess(response, file, fileList) { //文件长传成功  
            let url = this.uploadPolicy.host + '/' + this.uploadConfig.data.key;
            this.form[this.uploadType] = url;
        },
        beforeUpload(file) {
            let key = this.uploadPolicy.dir + '/' + md5('' + Date.now + this.uploadPolicy.uid + Math.random());
            this.uploadConfig.data.key = key;
            const isLt5M = file.size / 1024 / 1024 < 5;
            if (!isLt5M) {
                this.fileList = [];
                this.$message.error('上传图片大小不能超过 5MB!');
            }
            return isLt5M;
        },
        uploadRemove(file, fileList) {
            if (fileList.length > 0) { this.fileList = fileList.slice(-1); }
        },
        uploadChange(file, fileList) {
            if (fileList.length > 0) {
                this.fileList = fileList.slice(-1);
            } else {
                this.fileList = [];
            }

        },
        uploadPictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        previewBox(title, url) {
            this.dialogImageUrl = url;
            this.dialogVisible = true;
        },
        uploadError(file, fileList) {
            this.$message({
                type: 'info',
                message: '文件上传失败'
            });
        },
        onSubmit() {
            this.getDataList();

        },
        handleChange(value) {}
    },
    mounted() {
        this.$parent.parentUrlName = "新闻管理";
        this.$parent.parentUrls = '/lawyer';
        this.getDataList();
    }
}
</script>