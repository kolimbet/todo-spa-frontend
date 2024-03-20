import { createRouter, createWebHistory } from "vue-router";
import store from "@/store";

const routes = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/components/auth/LoginPage.vue"),
    meta: {
      requiresAuthorization: false,
    },
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@/components/auth/RegisterPage.vue"),
    meta: {
      requiresAuthorization: false,
    },
  },
  {
    path: "/",
    name: "home",
    component: () => import("@/components/task/TaskList.vue"),
    meta: {
      requiresAuthorization: true,
    },
  },
  {
    path: "/user",
    name: "user",
    component: () => import("@/components/user/UserPage.vue"),
    meta: {
      requiresAuthorization: true,
    },
  },
  {
    path: "/:pathMatch(.*)",
    name: "not_found",
    component: () => import("@/components/PageNotFound.vue"),
    meta: {
      requiresAuthorization: false,
    },
  },
];

const router = createRouter({
  base: "/",
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  console.log("Routing to " + to.fullPath);

  if (store.state.initial) {
    routing(to, next);
  } else {
    store.dispatch("initApp").then(() => {
      routing(to, next);
    });
  }
});

function routing(to, next) {
  // console.log(`start routing(${to.fullPath})`);
  if (to.meta.requiresAuthorization) {
    // console.log("Сhecking Autorized", getAuthorized.value);
    if (!store.state.authenticated) {
      // console.log("Router requiresAuthorization check redirect to: /login");
      next({ name: "login" });
    } else next();
  } else {
    next();
  }
}

export default router;
