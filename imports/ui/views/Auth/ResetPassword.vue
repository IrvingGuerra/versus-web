<template>
    <div>
        <div class="title">Resetear contraseña</div>
        <v-form @submit.prevent="resetPassword">
            <v-text-field v-model="user.password" id="inputNewPassword"
                          :append-icon="showPass.new ? 'mdi-eye' : 'mdi-eye-off'"
                          :type="showPass.new ? 'text' : 'password'"
                          name="password"
                          label="Nueva contraseña"
                          @click:append="showPass.new = !showPass.new"
                          autocomplete="new-password"
                          required>
            </v-text-field>
            <v-text-field v-model="user.confirmPassword" id="inputConfirmPassword"
                          :append-icon="showPass.confirm ? 'mdi-eye' : 'mdi-eye-off'"
                          :type="showPass.confirm ? 'text' : 'password'"
                          name="password_confirmation"
                          label="Confirmar contraseña"
                          @click:append="showPass.confirm = !showPass.confirm"
                          required>
            </v-text-field>
            <div class="d-flex start">
                <v-btn type="submit" color="primary" rounded>Resetear</v-btn>
            </div>
        </v-form>
        <alert-message ref="refResetPasswordAlert">
        </alert-message>
    </div>
</template>

<script>
    import Errors from "../../mixins/messages/errors";
    import validateMixin from "../../mixins/validation";
    import JsonHelper from "../../mixins/helpers/json";
    import AlertMessage from "../../components/Utilities/Alerts/AlertMessage";
    import {ValidationProvider} from "vee-validate";

    export default {
        name: "ResetPassword",
        components: {
            AlertMessage,
            ValidationProvider
        },
        mixins: [Errors, validateMixin, JsonHelper],
        data() {
            return {
                user: {
                    password: null,
                    confirmPassword: null
                },
                showPass: {
                    new: false,
                    confirm: false
                }
            };
        },
        methods: {
            resetPassword() {
                //    TODO: Validar campos
                const token = this.$route.params.token;
                Accounts.resetPassword(token, this.user.password, (err) => {
                    if (err) {
                        console.error("An error occurred while resetting the password", err);
                        this.$refs.refResetPasswordAlert.showAlertSimple("error",
                            "Se produjo un error al resetear la contraseña");
                    } else {
                        console.info("Password was successfully reset");
                        this.$refs.refResetPasswordAlert.showAlertSimple("success",
                            "Se reseteó la contraseña exitosamente");
                        this.$router.push({name: 'login'});
                    }
                });
            }
        }
    }
</script>

<style scoped>

</style>
