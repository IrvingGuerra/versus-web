<template>
    <ValidationObserver ref="passwordFormObserver">
        <form @submit.prevent="updatePassword" ref="updatePasswordForm" data-vv-scope="update-password-form">

            <v-card>
                <v-card-title>
                    <div class="subtitle-2">
                        CAMBIO DE CONTRASEÑA
                    </div>
                </v-card-title>

                <v-card-text>
                    <ValidationProvider v-slot="{errors}" name="contraseña actual" rules="required">
                        <v-text-field v-model="password.old" id="inputPassword"
                                      :append-icon="showPass.old ? 'mdi-eye' : 'mdi-eye-off'"
                                      :type="showPass.old ? 'text' : 'password'"
                                      name="current_password"
                                      label="Contraseña actual"
                                      @click:append="showPass.old = !showPass.old"
                                      autocomplete="off"
                                      :error-messages="errors">
                        </v-text-field>
                    </ValidationProvider>
                    <ValidationProvider v-slot="{errors}" name="nueva contraseña"
                                        rules="required|min:8|strength_password"
                                        vid="password">
                        <v-text-field v-model="password.new" id="inputNewPassword"
                                      :append-icon="showPass.new ? 'mdi-eye' : 'mdi-eye-off'"
                                      :type="showPass.new ? 'text' : 'password'"
                                      name="password"
                                      label="Nueva contraseña"
                                      @click:append="showPass.new = !showPass.new"
                                      autocomplete="new-password"
                                      :error-messages="errors">
                        </v-text-field>
                    </ValidationProvider>
                    <ValidationProvider v-slot="{errors}" name="confirmar contraseña"
                                        rules="required|confirmed:password">
                        <v-text-field v-model="password.confirm" id="inputConfirmPassword"
                                      :append-icon="showPass.confirm ? 'mdi-eye' : 'mdi-eye-off'"
                                      :type="showPass.confirm ? 'text' : 'password'"
                                      name="password_confirmation"
                                      label="Confirmar contraseña"
                                      @click:append="showPass.confirm = !showPass.confirm"
                                      :error-messages="errors">
                        </v-text-field>
                    </ValidationProvider>
                </v-card-text>

                <v-card-actions>
                    <v-row justify="center">
                        <v-btn type="submit" color="primary" rounded depressed>Cambiar</v-btn>
                    </v-row>
                </v-card-actions>
            </v-card>
            <alert-message ref="refUpdatePassword"/>
        </form>
    </ValidationObserver>
</template>

<script>
    import Errors from '../../mixins/messages/errors';
    import validateMixin from '../../mixins/validation';
    import JsonHelper from '../../mixins/helpers/json';
    import AlertMessage from "../Utilities/Alerts/AlertMessage";
    import { ValidationProvider, ValidationObserver } from 'vee-validate';

    export default {
        name: "UpdatePassword",
        components: {
            AlertMessage,
            ValidationProvider,
            ValidationObserver
        },
        mixins: [Errors, validateMixin, JsonHelper],
        data() {
            return {
                password: {
                    old: null,
                    new: null,
                    confirm: null
                },
                showPass: {
                    old: false,
                    new: false,
                    confirm: false
                }
            };
        },
        methods: {
            async updatePassword() {
                const validation = await this.$refs.passwordFormObserver.validate();
                if (validation) {
                    Accounts.changePassword(this.password.old, this.password.new, async (err) => {
                        this.setNulls(this.password);
                        await this.$validator.reset({ scope: 'update-password-form' });
                        if (err) {
                            console.error("Error changing password: ", err);
                            this.$refs.refUpdatePassword.showAlertSimple("error",
                                "Ocurrió un error al cambiar la contraseña.");
                            $("#inputPassword").focus();
                        } else {
                            console.info("Changed password");
                            this.$refs.refUpdatePassword.showAlertSimple("success",
                                "Se ha cambiado la contraseña");
                        }
                    });
                } else {
                    this.$refs.refUpdatePassword.showAlertSimple("error",
                        "Favor de llenar todos los campos obligatorios con valores válidos.");
                }
            },
        }

    }
</script>

<style scoped>
    [data-group=password] {
        position: relative;
    }

    [data-group=password] .fa-eye, [data-group=password] .fa-eye-slash {
        position: absolute;
        right: 10px;
        color: var(--primary-color);
        top: 20px;
        cursor: pointer;
    }

    [data-group=password] .fa-eye:hover, [data-group=password] .fa-eye-slash:hover {
        color: var(--second-color);
    }
</style>
