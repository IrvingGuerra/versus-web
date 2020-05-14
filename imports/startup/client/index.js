// Libs
import {Meteor} from 'meteor/meteor';
import Vue from 'vue';
import vuetify from "../../ui/plugins/vuetify";
require("../../ui/plugins/index");

// Main app
import App from '/imports/ui/App.vue';
import router from "../../ui/router";
import store from "../../ui/store";
Meteor.startup(() => {
    new Vue({
        router,
        store,
        vuetify,
        render: h => h(App)
    }).$mount("app");
});
