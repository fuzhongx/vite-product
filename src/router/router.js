import { createWebHashHistory, createRouter } from "vue-router";
import { getRouters } from "@/api/login.js";
import { ref } from "vue";
import { mainStore } from "../store";
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'

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
  nprogress.start();
  if (to.path === "/login") {
    next();
  } else {
    if (mainStore() && mainStore().menuNav.length == 0) {
      //1.发送请求
      const {
        data: { data },
      } = await getRouters();
      //2.处理每次都会发送请求问题。缓存数据pinia
      mainStore().setNav(data);

      //3.服务端返回数据转换路由格式
      const dynamicRoutes = addDynamicRoutes(data);
      //4.动态添加路由配置
      router.addRoute(dynamicRoutes);
      next({path:to.path});
    }else{
      next();
    }

  }
});
router.afterEach(()=>{
    //路由跳转结束之后 进度条结束
  nprogress.done()
})

//需要处理的问题
//1导航每一次路由变化，都会发送请求->将数据缓存到pinia
//2有两次请求产生，如何优化->不调用接口，使用第一次路由调用接口缓存的数据


const modules = import.meta.glob("../view/**/*.vue");//获取所有vue文件
//服务端返回数据转换成路由数据格式
const addDynamicRoutes = (data) => {
  const homeRoutes = routes.filter((v) => v.path === "/main")[0];
  homeRoutes.children = [];
  data.forEach((item) => {
    const componentPath = `../view/${item.component}.vue`;
    // 根据具体的url动态获取组件
    homeRoutes.children.push({
      path: `${item.path}`,
      name: item.name,
      component: modules[componentPath],
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
    const componentPath = `../view/${v.component}.vue`;
    return childs.push({
      path: `/${v.path}`,
      name: v.name,
      component: modules[componentPath],
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
