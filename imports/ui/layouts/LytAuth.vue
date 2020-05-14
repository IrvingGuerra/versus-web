<template>
    <v-row class="left-side">
        <v-col xs="12" sm="8" md="4" class="d-flex flex-column justify-space-around pa-12">
            <div class="text-center">
                <img src="/img/vuetify.png" alt="Vuetify" height="180px" width="auto"/>
            </div>
            <transition name="section-view">
                <router-view name="sectionView"/>
            </transition>
            <div class="text-center">
                <img src="/img/Powered.png" id="poweredLogo" height="35px" alt="Powered by Antware"/>
            </div>
        </v-col>
        <v-col xs="12" sm="4" md="8" class="right-side d-flex flex-column justify-center">
            <div class="right-side-cover"></div>
            <div class="display-3 font-weight-medium mr-10 text-right white--text">
                Scaffold Meteor + Vue
            </div>
        </v-col>
    </v-row>
</template>

<script>
    export default {
        name: "LytAuth",
    }
</script>

<style>
    body {
        background-color: transparent;
    }
</style>
<style scoped>
    .left-side {
        background: white;
    }

    .right-side-cover {
        /*background-color: var(--primary-color);*/

        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        content: '';
        opacity: 1;
    }

    .display-3 {
        z-index: 2;
        margin-top: 350px;
    }

    .right-side {
        background-image: url('/img/meteor2.jpg');
        background-size: cover;
        color: var(--body-color);
        height: 100vh;
        position: relative;
    }

    body {
        margin: 0;
    }
    .section-view-enter-active {
        transition: all .5s ease .5s;
    }
    .section-view-leave-active {
        transition: all .5s ease;
    }

    .section-view-enter, .section-view-leave-to {
        opacity: 0;
    }
</style>
