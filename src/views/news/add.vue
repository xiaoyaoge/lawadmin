<template>
    <div class="user-info bg_w">
        <div class="wrap">
            <el-form :model="email" label-width="100px" class="demo-ruleForm">
                <!--:rules="rules" -->
                <!--ref="ruleForm" -->
                <el-form-item label="类型" class="news-type">
                    <el-select v-model="news.type" placeholder="请选择">
                        <el-option label="请选择" value="null"></el-option>
                        <el-option label="公告" value="1"></el-option>
                        <el-option label="活动" value="2"></el-option>
                        <!--<el-option-->
                        <!--v-for="item in options"-->
                        <!--:key="item.value"-->
                        <!--:label="item.label"-->
                        <!--:value="item.value">-->
                        <!--</el-option>-->
                    </el-select>
                </el-form-item>
                <el-form-item label="标题">
                    <el-input v-model="news.title" placeholder="请输入标题"></el-input>
                </el-form-item>
                <el-form-item label="内容">
                    <quill-editor ref="myTextEditor" v-model="news.content" :config="editorOption" @blur="onEditorBlur($event)" @focus="onEditorFocus($event)" @ready="onEditorReady($event)">
                    </quill-editor>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click.native="doSave">提交</el-button>
                    <!--<el-button @click="resetForm('ruleForm2')">重置</el-button>-->
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
import { quillEditor } from 'vue-quill-editor'
export default {
    name: 'Index',
    //注册组件：Message方便使用
    components: {
        'quillEditor': quillEditor
        //        Message
    },
    data() {
        return {
            email: {},
            news: {
                content: "",
                type: null
            },
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
            // console.log('editor change!', editor, html, text)
            this.content = html
        },
        doSave() {
            let that = this
            let url = '/news/add'
            var reqData = {
                userId: auth.getUser().id,
            }
            Object.assign(reqData, that.news)
            that.$http.post(url, reqData).then(function(res) {
                if (res.body.msg == "ok") {
                    this.$notify({
                        title: '成功',
                        message: '添加成功',
                        type: 'success'
                    });

                }
            });
        }
    }
}
</script>
<style>
.bg_w {
    background: white;
    padding: 15px;
}

.in_news ul li {
    border: 1px solid #DDD;
    height: 38px;
    line-height: 38px;
    margin-bottom: 15px;
}

.in_news ul li .hint {
    float: left;
    margin: 0px 15px;
    color: #FE9802;
}

.in_news ul li .time {
    float: right;
    margin-right: 15px;
    color: #666;
    font-size: 12px;
}

.user-info {
    .wrap {
        width: 80%;
        margin: 0 auto;
        margin-bottom: 20px;
        color: #666;
    }
}

.ql-container .ql-editor {
    min-height: 20em;
    padding-bottom: 1em;
    max-height: 25em;
}

.news-type .el-select {
    width: 100%;
}
.ql-snow .ql-picker-label::before {
    display: inline-block;
    line-height: 22px;
    position: absolute; 
}
</style>