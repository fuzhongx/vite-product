import { defineStore } from "pinia";

const store = defineStore("main", {
  state: {
    nva: [],
  },
  actions: {
    //v获取到的路由存储到这里
    getRouter(v) {
      this.nva = v;
    },
  },
});
