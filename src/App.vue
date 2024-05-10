<template>
  <!-- 欢迎图标，自动消失 -->
  <!-- <img src="./assets/hello.gif" id="hello"> -->
  <lottie-player :src="helloUrl" background="transparent" speed="1" style="width: 260px; height: 260px" direction="1"
    mode="normal" loop autoplay id="hello"></lottie-player>
  <Pad></Pad>
</template>

<script setup>
import Pad from './components/Pad.vue'
// 备用CDN地址：https://lottie.host/c0835948-00bb-47c8-b53b-92235707cefd/7lftg5wfUV.json
const helloUrl = new URL('./assets/hello.json', import.meta.url).href
</script>

<style lang="scss">
// 格子衫背景
body {
  background: linear-gradient(45deg,
      rgba(0, 0, 0, 0.1) 25%,
      transparent 25%,
      transparent 75%,
      rgba(0, 0, 0, 0.1) 75%,
      rgba(0, 0, 0, 0.1) 100%),
    linear-gradient(45deg,
      rgba(0, 0, 0, 0.1) 25%,
      transparent 25%,
      transparent 75%,
      rgba(0, 0, 0, 0.1) 75%,
      rgba(0, 0, 0, 0.1) 100%);
  /* 背景大小必须小于盒子的大小 */
  background-size: 30px 30px;
  /* 第二种渐变的偏移必须为为背景大小的一半 */
  background-position: 0 0, 15px 15px;
}

#hello {
  position: fixed;
  top: 50vh;
  left: 50vw;
  z-index: 1;
  transform: translate(-130px, -150px);
  animation: fadeOut 0.5s forwards;
  animation-delay: 3s;
  animation-iteration-count: 1;
}

@keyframes fadeOut {
  from {
    display: block;
  }

  to {
    opacity: 0;
    display: none;
  }
}

.el-drawer__header {
  margin-bottom: 20px;

  h3 {
    font-weight: bold;
    letter-spacing: 1px;
  }
}

.el-drawer__body {
  border-top: 1px solid #ddd;
}

@media (max-width: 1100px) {
  .el-drawer.rtl {
    width: 40% !important;
  }
}

@media (max-width: 700px) {
  .el-drawer.rtl {
    width: 69% !important;
  }

  .canWrap>.el-icon {
    top: 35px;
    right: 35px;
  }
}

/* 针对屏幕宽度大于或等于 1800px 的样式 */
@media (min-width: 1800px) {
  .el-drawer.rtl {
    width: 450px !important;
  }
}
</style>
