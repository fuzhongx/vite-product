import { createWebHashHistory, createRouter } from "vue-router";
import { getRouters } from "@/api/login.js";
import {ref} from 'vue'

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  { path: "/login", component: () => import("@/view/login.vue") },
  {
    path: "/home",
    component: () => import("@/view/Layout.vue"),
    children: [
      { path: "/home", component: () => import("@/view/home.vue") },
      { path: "/table", component: () => import("@/view/table.vue") },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

//动态路由数据
router.beforeEach(async (to, from, next) => {
  if (to.path === "/login") {
    next();
  } else {
    //1.发送请求
    const {
      data: { data },
    } = await getRouters();
    // console.log(data); 
    //2.服务端返回数据添加路由数据
    const dynamicRoutes = addDynamicRoutes(data);
    //3.动态路由配置
    router.addRoute(dynamicRoutes);
    next();
  }
});

const homesChildren = (t) => {
  t.forEach((v) => { 
    return {
      path: `/${v.path}`,
      name: v.name,
      component: () => import(`@/view/Layout/${v.component}.vue`),
      hidden: v.hidden,
      meta: v.meta,
    };
  });
}

//服务端返回数据转换成路由数据格式
const addDynamicRoutes = (data) => {
  const homeRoutes = routes.filter((v) => v.path === "/home")[0];
  homeRoutes.children = [];
  data.forEach((item) => {
    homeRoutes.children.push({
      path: item.path,
      name: item.name,
      component: () => import(`@/view/Layout/${item.component}.vue`),
      meta: item.meta,
      children:item.children? homesChildren(item.children):[],
    });
  });  
  console.log(homeRoutes);
  return homeRoutes;
};



export default router;
