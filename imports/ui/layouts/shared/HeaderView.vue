<template>
    <v-app-bar app class="primary" dark dense
               src="https://i.picsum.photos/id/846/1920/1080.jpg">
        <template v-slot:img="{ props }">
            <v-img v-bind="props"
                   gradient="to top right, rgba(100,115,201,.7), rgba(25,32,72,.7)">
            </v-img>
        </template>
        <v-toolbar-title>Scaffold Meteor + Vue</v-toolbar-title>
        <v-spacer></v-spacer>
        <user-logged></user-logged>
        <template v-slot:extension>
            <v-tabs v-model="optionSelected" align-with-title>
                <v-tab v-for="option in options" @click="saveNavigation(option)" :key="option.title"
                       v-text="option.title">
                </v-tab>
            </v-tabs>
        </template>
    </v-app-bar>
</template>

<script>
    import UserLogged from "../../components/UserLogged/UserLogged";
    import {mapMutations, mapState} from 'vuex';

    export default {
        name: "HeaderView",
        components: {
            UserLogged
        },
        data() {
            return {
                options: [],
                optionSelected: 0
            };
        },
        created() {
            Meteor.call('getSystemOptions', (err, response) => {
                if (err) {
                    console.error('Failed to get system options:', err);
                } else {
                    this.options = response;
                    this.updateSelectedOption();
                }
            });
        },
        methods: {
            ...mapMutations('navigation', ['setPathAndTitle', 'resetValues']),
            saveNavigation(navigation) {
                if (!navigation.subOptions) {
                    this.setPathAndTitle({
                        path: navigation.namePath,
                        title: navigation.title
                    });
                    this.$router.push({name: navigation.namePath});
                }
            },
            updateSelectedOption(){
                let optionSelected=this.options.filter(option => option.namePath === this.$route.name);
                if(optionSelected.length>0){
                    this.optionSelected = this.options.indexOf(optionSelected[0]);
                }
            }
        },
        computed: {
            ...mapState('navigation', ['path', 'title'])
        },
        watch: {
            '$route'() {
                this.updateSelectedOption();
            }
        }
    }
</script>

<style scoped>

</style>
