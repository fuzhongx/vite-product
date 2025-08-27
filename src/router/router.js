import { createWebHashHistory, createRouter } from "vue-router";
import { getRouters } from "@/api/login.js";
import { ref } from "vue";

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  { path: "/login", component: () => import("@/view/login.vue") },
  {
    path: "/main",
    component: () => import("@/view/Main.vue"),
    children: [],
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

const modules = import.meta.glob('../view/**/*.vue')
//服务端返回数据转换成路由数据格式
const addDynamicRoutes = (data) => {
  const homeRoutes = routes.filter((v) => v.path === "/main")[0];
  homeRoutes.children = [];
  data.forEach((item) => {
    // console.log( modules[`../view/${item.component}.vue`])
    // 根据具体的url动态获取组件
    homeRoutes.children.push({
      path: `${item.path}`,
      name: item.name,
      component: modules[`../view/${item.component}.vue`],
      meta: {
        title: item.meta,
      },
      children: item.children ? homesChildren(item.children) : [],
    });
  });
  return homeRoutes;
};
const homesChildren = (t) => {
  const childs = [];
  t.forEach((v) => {
    return childs.push({
      path: `${v.path}`,
      name: v.name,
      component: modules[`@/view/${v.component}.vue`],
      hidden: v.hidden,
      meta: {
        title: v.meta.title,
      },
      children: v.children ? homesChildren(v.children) : [],
    });
  });
  return childs;
};

export default router;
