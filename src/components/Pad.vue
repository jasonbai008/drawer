<template>
    <div class="canWrap">
        <!-- canvas 画布 -->
        <canvas id="can"></canvas>
        <!-- 右侧设置面板 -->
        <Settings :myCanvas="myCanvas" :brushObj="brushObj"></Settings>
    </div>
</template>

<script setup>
import { fabric } from 'fabric'
import Settings from './Settings.vue'

let myCanvas = ref({})
let history = ref([])

const brushObj = reactive({
    radius: 10,
    color: 'rgba(26, 188, 156, 0.9)',
    enableShadow: false,
    enableTransparent: false,
    brushType: 'spray'  // pencil || dash || spray || circle
})

// 在子组件中使用
defineExpose({ history })

onMounted(() => initCanvas())

watch(brushObj, (n, o) => {
    // 设置画布背景色
    myCanvas.value.setBackgroundColor(n.enableTransparent ? 'transparent' : '#ffffff')

    switch (n.brushType) {
        case 'pencil':
            myCanvas.value.freeDrawingBrush = new fabric.PencilBrush(myCanvas.value);
            myCanvas.value.freeDrawingBrush.strokeDashArray = [];
            break;
        case 'dash':
            myCanvas.value.freeDrawingBrush = new fabric.PencilBrush(myCanvas.value);
            myCanvas.value.freeDrawingBrush.strokeDashArray = [15, 30];
            break;
        case 'spray':
            myCanvas.value.freeDrawingBrush = new fabric.SprayBrush(myCanvas.value);
            break;
        case 'circle':
            myCanvas.value.freeDrawingBrush = new fabric.CircleBrush(myCanvas.value);
            break;

        default:
            myCanvas.value.freeDrawingBrush = new fabric.SprayBrush(myCanvas.value);
            break;
    }

    myCanvas.value.freeDrawingBrush.width = n.radius
    myCanvas.value.freeDrawingBrush.color = n.color
    if (n.enableShadow) {
        myCanvas.value.freeDrawingBrush.shadow = new fabric.Shadow({
            blur: 10,
            offsetX: 12,
            offsetY: 12,
            affectStroke: true,
            color: '#ccc',
        })
    } else {
        myCanvas.value.freeDrawingBrush.shadow = false
    }
    // 重绘画布
    myCanvas.value.renderAll()
})

// 初始化画布
function initCanvas() {
    myCanvas.value = new fabric.Canvas('can', {
        width: window.innerWidth, // 画布宽度
        height: window.innerHeight, // 画布高度
        backgroundColor: '#fff', // 画布背景色
        isDrawingMode: true, // 开启绘图模式
    })
    // 缓存操作步骤
    myCanvas.value.on('path:created', function (e) {
        history.value.push(e.path);
    });
    initBrash()
    zoomCanvas()
}

// 初始化画笔
function initBrash() {
    // 默认使用喷雾画笔
    myCanvas.value.freeDrawingBrush = new fabric.SprayBrush(myCanvas.value);
    // 设置画笔颜色
    myCanvas.value.freeDrawingBrush.color = brushObj.color
    // 设置画笔粗细
    myCanvas.value.freeDrawingBrush.width = brushObj.radius
    // 画笔投影
    myCanvas.value.freeDrawingBrush.shadow = false
}

// 鼠标缩放画布
function zoomCanvas() {
    myCanvas.value.on('mouse:wheel', opt => {
        let delta = opt.e.deltaY // 滚轮向上滚一下是 -100，向下滚一下是 100
        let zoom = myCanvas.value.getZoom() // 获取画布当前缩放值

        // 控制缩放范围在 0.01~20 的区间内
        zoom *= 0.999 ** delta
        if (zoom > 20) zoom = 20
        if (zoom < 0.01) zoom = 0.01

        // 设置画布缩放比例
        // 关键点！！！
        // 参数1：将画布的所放点设置成鼠标当前位置
        // 参数2：传入缩放值
        myCanvas.value.zoomToPoint(
            {
                x: opt.e.offsetX, // 鼠标x轴坐标
                y: opt.e.offsetY  // 鼠标y轴坐标
            },
            zoom // 最后要缩放的值
        )
    })
}

</script>

<style lang="scss" scoped>
.canWrap {
    position: relative;
}
</style>