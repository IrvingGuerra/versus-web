import Vue from 'vue';
import VueRouter from "vue-router";
import routes from "./routes/routes";
import store from './store';

Vue.use(VueRouter);
const router=new VueRouter({
   routes
});

router.beforeEach((to, from, next) => {
   const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
   const isLogged = store.state.auth.isLogged;
   if (!requiresAuth && isLogged && to.path === '/login') {
      next('/');
   } else if (requiresAuth && !isLogged) {
      next('/login');
   } else {
      const userLogged = store.state.auth.user;
      const permission = to.meta.permission;
      if (permission) {
         Meteor.call("checkPermission", {
            idUser: userLogged._id,
            permission: permission
         }, (err, response) => {
            if (err) {
               console.error("Error checking permission: ", err);
            } else {
               if (response === true) {
                  next();
               } else {
                  router.push({name: from.name});
                  console.warn("You do not have access to this section.")
               }
            }
         });
      } else {
         next();
      }
   }
});

export default router;