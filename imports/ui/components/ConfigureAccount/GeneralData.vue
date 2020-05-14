<template>
    <ValidationObserver ref="dataFormObserver">
        <v-form @submit.prevent="saveUser">
            <v-card>
                <v-card-title>
                    <div class="subtitle-2">
                        DATOS GENERALES
                    </div>
                </v-card-title>
                <v-col>
                    <v-col>
                        <v-row class="justify-sm-space-between">
                            <v-btn color="primary" class="mb-5" rounded depressed
                                   v-on:click="tempSrc=null">
                                Cambiar
                            </v-btn>
                            <v-btn type="submit" color="primary" rounded depressed>
                                Guardar
                            </v-btn>
                        </v-row>
                    </v-col>
                    <v-col class="ml-1">
                        <v-image-input v-if="!tempSrc" v-model="photoFileUser"
                                       :image-width="100"
                                       :image-height="150"
                                       overlay-background-color="rgba(0,0,0,0.5)"
                                       overlay-boder-color="#fff"
                                       overlay-padding="0px"
                                       rotate-clockwise-icon="mdi-rotate-right"
                                       rotate-counter-clockwise-icon="mdi-rotate-left"
                                       upload-icon="cloud_upload"
                                       scaling-slider-color
                                       clearable image-format="jpg"/>
                        <img v-else id="face-preview" :src="tempSrc || 'img/user.png'"
                             :alt="user.nombre" width="100px">
                    </v-col>
                </v-col>
                <v-col>
                    <v-card-text>
                        <ValidationProvider v-slot="{ errors }" name="nombre" rules="required|alpha_spaces">
                            <v-text-field v-model="user.nombre" id="inputNombre" name="name"
                                          :error-messages="errors" disabled
                                          label="Nombre completo*" required>
                            </v-text-field>
                        </ValidationProvider>
                        <ValidationProvider v-slot="{ errors }" name="usuario" rules="required|alpha_dash">
                            <v-text-field v-model="user.usuario"
                                          id="inputUsuario"
                                          :error-messages="errors"
                                          name="username" disabled
                                          label="Usuario*" required>
                            </v-text-field>
                        </ValidationProvider>
                        <ValidationProvider v-slot="{errors}" name="correo electrónico" rules="required|email">
                            <v-text-field v-model="user.correo"
                                          id="inputEmail" name="email"
                                          :error-messages="errors" disabled
                                          label="Correo electrónico*"
                                          required>
                            </v-text-field>
                        </ValidationProvider>

                        <v-select v-model="user.perfil" :items="profiles" id="selectPerfil" disabled v-show="false"
                                  label="Perfil" required>
                        </v-select>
                    </v-card-text>
                </v-col>
            </v-card>

            <alert-message ref="refGeneralData"/>
        </v-form>
    </ValidationObserver>
</template>

<script>
    import validateMixin from '../../mixins/validation';
    import profilesMixin from '../../mixins/accounts/profiles';
    import {mapMutations} from 'vuex';
    import AlertMessage from "../Utilities/Alerts/AlertMessage";
    import {ValidationProvider, ValidationObserver} from 'vee-validate';

    export default {
        name: "GeneralData",
        mixins: [validateMixin, profilesMixin],
        components: {
            AlertMessage,
            ValidationProvider,
            ValidationObserver
        },
        data() {
            return {
                user: {
                    _id: null,
                    nombre: null,
                    usuario: null,
                    correo: null,
                    perfil: null
                },
                tempSrc: null,
                photoFileUser: null
            }
        },
        created() {
            const usuario = this.$store.state.auth.user;
            this.user = {
                _id: usuario._id,
                nombre: usuario.profile.nombre,
                usuario: usuario.username,
                correo: usuario.emails[0].address,
                perfil: usuario.profile.perfil,
                path: usuario.profile.path
            };
        },
        mounted() {
            this.renderImage();
        },
        methods: {
            renderImage() {
                let pathImage = this.user.path + "/" + this.user.usuario + ".jpg";
                Meteor.call('getImageSrc', {assetPath: pathImage}, (err, src) => {
                    this.tempSrc = src;
                });
            },
            ...mapMutations('auth', ['setUser']),
            async saveUser() {
                const validation = await this.$refs.dataFormObserver.validate();
                if (validation) {
                    Meteor.call("saveUser", {user: this.user, photoFileUser: this.photoFileUser},
                        (err, response) => {
                            if (err) {
                                console.error("Error to save user: ",err);
                                this.$refs.refGeneralData.showAlertSimple("error",
                                    "Ocurrió un error al guardar la configuración.");
                            } else {
                                this.setUser(Meteor.user());
                                this.$root.$emit("setUserLogged");
                                this.$refs.refGeneralData.showAlertSimple("success",
                                    "Se ha guardado la nueva configuración.");
                            }
                        });
                } else {
                    this.$refs.refGeneralData.showAlertSimple("error",
                        "Favor de llenar todos los campos obligatorios con valores válidos.");
                }
            },
        }
    }
</script>

<style scoped>

</style>
