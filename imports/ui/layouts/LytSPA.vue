<template>
    <v-container fluid>
        <transition appear name="appear-header">
            <header-view></header-view>
        </transition>
        <transition appear name="appear-section-spa">
            <v-content id="main_section">
                <transition name="section-view">
                    <router-view name="sectionView"></router-view>
                </transition>
            </v-content>
        </transition>
        <footer-view></footer-view>
    </v-container>
</template>

<script>
    import HeaderView from "./shared/HeaderView";
    import FooterView from "./shared/FooterView";

    export default {
        name: "LytSPA",
        components: {
            HeaderView,
            FooterView
        },
    }
</script>

<style scoped>
    #main_section {
        margin-bottom: 80px;
        position: relative;
    }

    .bg_lines {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 0;
    }

    .router-content {
        position: relative;
        z-index: 2;
    }

    .section-view-enter-active, .section-view-leave-active {
        transition: all .5s ease;
        position: absolute;
        width: 100%;
        margin-top: 70px;
    }

    .section-view-enter {
        opacity: 0;
        transform: translateX(100vw);
    }

    .section-view-enter-to {
        margin-left: calc(50% - 570px);;
    }

    .section-view-leave-to {
        opacity: 0;
        transform: translateX(-100vw);
    }

    .appear-header-enter-active {
        transition: all .5s ease .5s;
    }

    .appear-header-enter {
        transform: translateY(-100px);
        opacity: 0;
    }

    .appear-section-spa-enter-active {
        transition: all .5s ease .5s;
    }

    .appear-section-spa-enter {
        opacity: 0;
        transform: translateX(100vw);
    }

</style>
<style>
    .nested-section-view-enter-active, .nested-section-view-leave-active {
        transition: all .5s ease;
        position: absolute;
        width: 100%;
    }

    .nested-section-view-enter {
        opacity: 0;
        transform: translateX(100vw);
    }

    .nested-section-view-leave-to {
        opacity: 0;
        transform: translateX(-100vw);
    }
</style>
