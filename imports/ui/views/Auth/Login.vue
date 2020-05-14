<template>
    <div class="login-wrapper">
        <div class="title secondary--text">Bienvenido!</div>
        <div class="display-1 mb-0 secondary--text">Iniciar sesión</div>
        <v-form @submit.prevent="login" autocomplete="nope">
            <v-text-field id="inputUser" v-model="user.userOrEmail" autocomplete="off"
                          v-validate.persist="'required'" data-vv-as=" " required
                          :state="validateState('email')"
                          label="Usuario" name="email" prepend-icon="person" color="primary" type="text">
            </v-text-field>
            <v-text-field id="inputPassword" label="Contraseña" name="password" prepend-icon="lock"
                          data-vv-as="contraseña" v-model="user.password" v-validate.persist="'required'"
                          required :state="validateState('password')" type="password">
            </v-text-field>
            <div class="d-flex justify-end">
                <v-btn color="primary" text :to="{name:'olvideMiContrasena'}" small>¿Olvidé mi contraseña?</v-btn>
            </div>
            <div class="d-flex justify-start">
                <v-btn type="submit" rounded color="primary" transition="fade">Entrar</v-btn>
            </div>
        </v-form>
        <alert-message ref="refAlertLogin"/>
    </div>
</template>

<script>
    import { mapState, mapMutations } from 'vuex';
    import validateMixin from '../../mixins/validation'
    import AlertMessage from "../../components/Utilities/Alerts/AlertMessage";

    export default {
        mixins: [validateMixin],
        name: "Login",
        components: {
            AlertMessage
        },
        data() {
            return {
                user: {
                    userOrEmail: '',
                    password: ''
                },
                error: false,
            };
        },
        computed: {
            ...mapState('auth', ['errorMessage'])
        },
        methods: {
            ...mapMutations('auth', ['setUser', 'authError']),
            login() {
                Meteor.loginWithPassword(this.user.userOrEmail, this.user.password, (err) => {
                    if (err) {
                        this.authError(err.error);
                        this.error = true;
                        this.$refs.refAlertLogin.showAlertFull("mdi-close-circle","error", "Credenciales incorrectas",
                            '', 5000, "right", "bottom");
                    } else {
                        this.$refs.refAlertLogin.closeAlert();
                        this.setUser(Meteor.user());
                        this.$router.push({ name: 'home' });
                    }
                });
            },
        },
        async mounted() {
            await this.$validator.reset();
        }
    }
</script>

<style scoped>
    .login-wrapper {
        margin-top: 45px;
    }
    .title {
        color: var(--primary-color);
    }
</style>
