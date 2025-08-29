import { defineStore } from "pinia";

export const mainStore = defineStore("main", {
  state(){
    return{
      nav: [],//导航菜单数据
    }

  },
  // 管理状态
  actions: {
    //v获取到的路由存储到这里
    setNav(v) {
      this.nav = v;
    },
  },
});
