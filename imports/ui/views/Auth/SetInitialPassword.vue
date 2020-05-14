<template>
    <div>
        <div class="title">Establecer contraseña</div>
        <ValidationObserver ref="setPasswordFormObserver">
            <v-form @submit.prevent="setPassword">
                <ValidationProvider v-slot="{errors}" name="nueva contraseña"
                                    rules="required|min:8|strength_password"
                                    vid="password">
                    <v-text-field v-model="user.password" id="inputNewPassword"
                                  :append-icon="showPass.new ? 'mdi-eye' : 'mdi-eye-off'"
                                  :type="showPass.new ? 'text' : 'password'"
                                  name="password"
                                  :error-messages="errors"
                                  label="Nueva contraseña"
                                  @click:append="showPass.new = !showPass.new"
                                  autocomplete="new-password">
                    </v-text-field>
                </ValidationProvider>
                <ValidationProvider v-slot="{errors}" name="confirmar contraseña" rules="required|confirmed:password">
                    <v-text-field v-model="user.confirmPassword" id="inputConfirmPassword"
                                  :append-icon="showPass.confirm ? 'mdi-eye' : 'mdi-eye-off'"
                                  :type="showPass.confirm ? 'text' : 'password'"
                                  :error-messages="errors"
                                  name="password_confirmation"
                                  label="Confirmar contraseña"
                                  @click:append="showPass.confirm = !showPass.confirm"
                                  required>
                    </v-text-field>
                </ValidationProvider>
                <div class="d-flex justify-start mt-2">
                    <v-btn type="submit" color="primary" rounded>Enviar</v-btn>
                </div>
            </v-form>
        </ValidationObserver>
        <alert-message ref="refSetInitialPasswordAlert">
        </alert-message>
    </div>
</template>

<script>
    import Errors from "../../mixins/messages/errors";
    import validateMixin from "../../mixins/validation";
    import JsonHelper from "../../mixins/helpers/json";
    import AlertMessage from "../../components/Utilities/Alerts/AlertMessage";
    import {ValidationProvider, ValidationObserver} from "vee-validate";

    export default {
        name: "SetInitialPassword",
        components: {
            AlertMessage,
            ValidationProvider,
            ValidationObserver
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
            async setPassword() {
                const validation = await this.$refs.setPasswordFormObserver.validate();
                console.log('Validation', validation);
                if (validation) {
                    const token = this.$route.params.token;
                    Accounts.resetPassword(token, this.user.password, (err) => {
                        if (err) {
                            console.error("An error occurred while setting the password\n", err);
                            this.$refs.refSetInitialPasswordAlert.showAlertSimple("error",
                                "Se produjo un error al establecer la contraseña");
                        } else {
                            console.info("Password set successfully");
                            this.$refs.refSetInitialPasswordAlert.showAlertSimple("success",
                                "Se estableció la contraseña exitosamente");
                            this.$router.push({name: 'login'});
                        }
                    });
                } else {
                    this.$refs.refSetInitialPasswordAlert.showAlertSimple("error",
                        "Favor de llenar todos los campos obligatorios con valores válidos");
                }
            }
        }
    }
</script>

<style scoped>

</style>
