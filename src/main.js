import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";

import * as ElementPlusIconsVue from "@element-plus/icons-vue";

const app = createApp(App);

// 全局注册饿了么图标，费劲
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

// 挂载DOM节点
app.mount("#app");
