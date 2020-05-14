<template>
    <div>
        <div class="d-flex flex-row justify-start">
            <v-btn color="primary" icon :to="{name:'login'}">
                <v-icon>arrow_back</v-icon>
            </v-btn>
            <div class="title">Olvidé mi contraseña</div>
        </div>
        <v-form @submit.prevent="forgotPassword">
            <v-text-field v-model="user.email"
                          id="inputEmail" name="email"
                          label="Correo electrónico*"
                          required>
            </v-text-field>
            <v-btn type="submit" color="primary" rounded>Recuperar</v-btn>
        </v-form>
        <alert-message ref="refForgotPasswordAlert">
        </alert-message>
    </div>
</template>

<script>
    import validateMixin from '../../mixins/validation';
    import AlertMessage from "../../components/Utilities/Alerts/AlertMessage";

    export default {
        name: "ForgotPassword",
        mixins: [validateMixin],
        components: {
            AlertMessage
        },
        data() {
            return {
                user: {
                    email: null
                }
            };
        },
        methods: {
            async forgotPassword() {
                if (await this.isFormValid()) {
                    Accounts.forgotPassword(this.user, (err) => {
                        if (err) {
                            console.error("Error sending email", err);
                            this.$refs.refForgotPasswordAlert.showAlertSimple("error",
                                "Ocurrió un error al enviar el correo.");
                        } else {
                            console.info("Email sent");
                            this.$refs.refForgotPasswordAlert.showAlertSimple("success",
                                "Correo enviado! Por favor abra su correo electrónico y haga click en el link del " +
                                "mensaje que le enviamos.");
                            setTimeout(() => {
                                this.$router.push({name: 'login'});
                            }, 5000);
                        }
                    });

                }
            }
        }
    }
</script>

<style scoped>
    .top-login {
        margin-top: 5%;
    }

    h1 {
        font-size: 4rem;
        color: var(--primary-color);
        font-weight: bolder;
    }

    .brand-section {
        margin-bottom: 80px;
    }

    h4 {
        font-family: 'Raleway-Light', sans-serif;
        text-align: center;
        color: var(--primary-color);
        font-size: 2rem;
        font-weight: bold;
    }

    #groupUser {
        float: right;
    }

    input {
        -webkit-box-shadow: inset 1px 1px 5px transparent;
        -moz-box-shadow: inset 1px 1px 5px transparent;
        box-shadow: inset 1px 1px 5px transparent;
        background-color: rgba(255, 255, 255, .5);
        transition: background-color .3s ease;
    }

    input:focus {
        background-color: #ffffff !important;
    }

    .card {
        font-weight: bold;
    }

</style>
