<template>
    <v-menu offset-y>
        <template v-slot:activator="{on}">
            <v-avatar color="indigo" class="mt-2 mr-5">
                <v-icon dark v-if="tempSrc==null">mdi-account-circle</v-icon>
                <img v-else id="face-preview" :src="tempSrc || 'img/user.png'"
                     :alt="user.username">
            </v-avatar>
            <v-btn color="default" dark text v-on="on" class="mr-5">
                <v-icon>keyboard_arrow_down</v-icon>
                {{user.profile.nombre}}
            </v-btn>
        </template>
        <v-list>
            <v-list-item :to="{name:'home.account'}">Cuenta</v-list-item>
            <v-list-item  href="#" v-on:click="closeSession()">Cerrar sesión</v-list-item>
        </v-list>
    </v-menu>
</template>

<script>
    import { mapMutations } from 'vuex';

    export default {
        name: "UserLogged",
        data() {
            return {
                user: {
                    emails: null,
                    profile: {},
                    username: null
                },
                tempSrc:null
            };
        },
        methods: {
            ...mapMutations('auth', ['logout']),
            closeSession() {
                Meteor.logout();
                this.logout();
                this.$router.push('/login');
            },
            setSession() {
                if (Meteor.userId() !== null) {
                    this.user = this.$store.state.auth.user;
                    const pathImage=this.user.profile.path + "/" + this.user.username + ".jpg";
                    if(this.user.profile.path != undefined){
                        Meteor.call('getImageSrc', {assetPath: pathImage},(err, src) => {
                            this.tempSrc=src;
                        });
                    }

                } else {
                    this.closeSession();
                }
            }
        },
        created() {
            // console.log("Loading data By vuex",this.$store.state.auth.user);
            this.setSession();

        },
        mounted() {
            this.$root.$on('setUserLogged', () => {
                this.setSession();
            });
        }
    }
</script>

<style>
    [role=menu] {
        font-size: 14px;
    }
</style>
