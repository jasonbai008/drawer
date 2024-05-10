<template>
    <el-icon :size="30" @click="openPanel">
        <Setting />
    </el-icon>
    <el-drawer v-model="drawer" direction="rtl" size="25%">
        <template #header>
            <h3>画板设置</h3>
        </template>
        <template #default>
            <el-form label-position="top" label-width="auto" :model="brushObj" style="max-width: 600px">
                <el-form-item label="画布操作">
                    <p style="margin-bottom: 10px;">
                        <el-button :icon="Refresh" type="success" @click="reset">重置缩放</el-button>
                        <el-button :icon="Delete" type="danger" @click="clear">清空画布</el-button>
                    </p>
                    <p>
                        <el-button :icon="Back" type="warning" @click="preStep($parent)">撤销操作</el-button>
                        <el-button :icon="Download" type="primary" @click="output">导出图片</el-button>
                    </p>
                </el-form-item>
                <el-form-item label="画布透明">
                    <el-switch v-model="brushObj.enableTransparent" active-color="#13ce66" inactive-color="#ff4949">
                    </el-switch>
                </el-form-item>
                <el-divider />
                <el-form-item label="画笔类型">
                    <el-radio-group v-model="brushObj.brushType">
                        <el-radio value="pencil">铅笔</el-radio>
                        <el-radio value="spray">蜡笔</el-radio>
                        <el-radio value="dash">虚线</el-radio>
                        <el-radio value="circle">水墨</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="画笔粗细">
                    <el-slider v-model="brushObj.radius" :min="1" :max="50" />
                </el-form-item>
                <el-form-item label="画笔颜色">
                    <el-color-picker v-model="brushObj.color" show-alpha />
                </el-form-item>
                <el-form-item label="画笔投影">
                    <el-switch v-model="brushObj.enableShadow" active-color="#13ce66" inactive-color="#ff4949">
                    </el-switch>
                </el-form-item>
            </el-form>
        </template>
        <template #footer>
            <p style="text-align: center;">Developed by <a href="https://gitee.com/lubanseven/dream-pad"
                    target="_blank">Jason Bai</a> with Vue3.x & Fabric.js</p>
        </template>
    </el-drawer>
</template>

<script setup>
// 只能在顶层使用，坑！
const props = defineProps(['myCanvas', 'brushObj'])

import { Delete, Download, Refresh, Back } from '@element-plus/icons-vue'

const drawer = ref(false)
let myCanvas = reactive({})

// 从父组件中拿到Fabric实例
watch(() => props.myCanvas, (n) => myCanvas = n)

// 绘制直线方法提示
watchEffect(() => {
    if (props.brushObj.brushType === 'pencil' && window.innerWidth > 700) {
        ElNotification({
            title: '有用的提示',
            message: "按住Shift键，可以绘制直线",
            position: 'top-left',
            type: 'success',
        })
    }
})

// 打开配置面板
function openPanel() {
    drawer.value = true
}
// 清空画布
function clear() {
    myCanvas.clear()
    // 由于连画布背景色也清空了，所以还得重新设置背景色
    myCanvas.setBackgroundColor(props.brushObj.enableTransparent ? 'transparent' : '#ffffff')
    drawer.value = false
}
// 重置画布缩放，666
function reset() {
    props.myCanvas.setViewportTransform([1, 0, 0, 1, 0, 0])
}
// 导出图片
function output() {
    let base64String = props.myCanvas.toDataURL('png')
    // 创建一个新的 `<a>` 元素
    const link = document.createElement('a');
    // 将 base64 字符串转换为 Blob 对象
    const blob = new Blob([base64StringToBlob(base64String)], { type: 'image/png' });
    // 创建一个指向 Blob 对象的 URL
    const url = URL.createObjectURL(blob);
    // 设置 `<a>` 元素的属性
    link.href = url;
    link.download = 'drawers.png';
    // 触发 `<a>` 元素的点击事件
    link.click();
    // 释放 Blob 对象的 URL
    URL.revokeObjectURL(url);
    drawer.value = false
}

function base64StringToBlob(base64String) {
    // 去除 base64 字符串中的前缀
    const prefix = 'data:image/png;base64,';
    if (base64String.startsWith(prefix)) {
        base64String = base64String.slice(prefix.length);
    }
    // 将 base64 字符串解码为字节数组
    const bytes = atob(base64String);
    // 创建一个字节数组缓冲区
    const buffer = new ArrayBuffer(bytes.length);
    // 将字节数组复制到缓冲区中
    const array = new Uint8Array(buffer);
    for (let i = 0; i < bytes.length; i++) {
        array[i] = bytes.charCodeAt(i);
    }
    // 创建一个 Blob 对象
    const blob = new Blob([buffer], { type: 'image/png' });
    return blob;
}

// 从画布中删除最近的一次绘制
function preStep($parent) {
    if ($parent.history.length > 0) {
        var path = $parent.history.pop();
        myCanvas.remove(path);
    }
}

</script>

<style lang="scss" scoped>
.el-icon {
    position: absolute;
    top: 50px;
    right: 70px;
    transition: all 1s;

    &:hover {
        cursor: pointer;
        transform: rotate(360deg);
    }
}

.el-drawer__footer p a {
    font-weight: bold;
    color: #409eff;
}

.el-form-item:deep(.el-form-item__label) {
    font-weight: bold;
    letter-spacing: 1px;
}
</style>