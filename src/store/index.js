import { defineStore } from "pinia";

export const mainStore = defineStore("main", {
  state(){
    return{
      menuNav: [],//导航菜单数据
      nav:''//面包屑导航
      
    }

  },
  // 管理状态
  actions: {
    //v获取到的路由存储到这里
    setNav(v) {
      this.menuNav = v;
    },
    setRouter(v){//面包屑
      this.nav=v
    }
  },
});
