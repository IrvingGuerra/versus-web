<template>
    <v-container>
        <v-row>
            <v-col>
                <div class="headline">{{ dataView.title }}</div>
            </v-col>
            <v-col cols="2">
                <v-btn block type="submit" form="saveUser" color="primary"
                       v-text="dataView.targetButton">
                </v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-card>
                    <v-card-text>
                        <ValidationObserver ref="userFormObserver" v-slot="{validation, reset}">
                            <v-form @submit.prevent="saveUser" id="saveUser" autocomplete="off">
                                <v-row>
                                    <v-col sm="4" md="4">
                                        <v-col>
                                            <v-btn color="primary" class="mb-5" v-if="tempSrc" rounded depressed
                                                   v-on:click="tempSrc=null">
                                                Cambiar
                                            </v-btn>
                                        </v-col>
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
                                    <v-col sm="8" md="8">
                                        <ValidationProvider v-slot="{ errors }" name="nombre" rules="required">
                                            <v-text-field v-model="user.nombre" id="inputNombre"
                                                          name="nombre"
                                                          :error-messages="errors" label="Nombre completo" required>
                                            </v-text-field>
                                        </ValidationProvider>
                                        <ValidationProvider v-slot="{ errors }" name="perfil" rules="required">
                                            <v-select v-model="user.perfil" :items="profiles" id="selectPerfil"
                                                      item-text="description" item-value="name"
                                                      :error-messages="errors"
                                                      label="Perfil"
                                                      required></v-select>
                                        </ValidationProvider>
                                        <ValidationProvider v-slot="{ errors }" name="usuario" rules="required">
                                            <v-text-field v-model="user.usuario"
                                                          id="inputUsuario"
                                                          :error-messages="errors"
                                                          name="username"
                                                          label="Usuario" required>
                                            </v-text-field>
                                        </ValidationProvider>
                                        <ValidationProvider v-slot="{ errors }" name="correo electrónico"
                                                            rules="required|email">
                                            <v-text-field v-model="user.correo" v-validate="'required|email'"
                                                          id="inputEmail"
                                                          :error-messages="errors"
                                                          name="email"
                                                          label="Correo electrónico"
                                                          required>
                                            </v-text-field>
                                        </ValidationProvider>
                                    </v-col>
                                </v-row>
                            </v-form>
                        </ValidationObserver>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <loader ref="refUsersLoader"></loader>
    </v-container>
</template>

<script>
    import validateMixin from '../../../mixins/validation';
    import {ValidationProvider, ValidationObserver} from 'vee-validate';
    import Loader from "../../../components/Utilities/Loaders/Loader";
    import {Profile} from "../../../../api/Profiles/Profile";

    export default {
        name: "UsersCreateEdit",
        mixins: [validateMixin],
        components: {
            ValidationProvider,
            ValidationObserver,
            Loader
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
                dataView: {
                    title: "",
                    targetButton: ""
                },
                tempSrc: null,
                photoFileUser: null
            };
        },
        created() {
            if (this.$router.currentRoute.name.includes("create")) {
                this.dataView.title = "Crear usuario";
                this.dataView.targetButton = "Crear";
            } else if (this.$router.currentRoute.name.includes("edit")) {
                this.dataView.title = "Editar usuario";
                this.dataView.targetButton = "Actualizar";
                const tempUser = this.$store.state.temporal.element;
                if (tempUser !== null) {
                    this.user = {
                        _id: tempUser._id,
                        nombre: tempUser.profile.nombre,
                        usuario: tempUser.username,
                        correo: tempUser.emails[0].address,
                        perfil: tempUser.profile.perfil,
                        path: tempUser.profile.path
                    };
                } else {
                    this.$router.push({name: 'home.users'});
                }
            }

        },
        mounted() {
            if (this.$router.currentRoute.name.includes("edit")) {
                this.renderImage();
            }
        },
        methods: {
            renderImage() {
                let pathImage = this.user.path + "/" + this.user.usuario + ".jpg";
                Meteor.call('getImageSrc', {assetPath: pathImage}, (err, src) => {
                    this.tempSrc = src;
                });
            },
            async saveUser() {
                const validation = await this.$refs.userFormObserver.validate();
                if (validation) {
                    this.$refs.refUsersLoader.activate('Guardando usuario ...');
                    Meteor.call("saveUser", {user: this.user, photoFileUser: this.photoFileUser},
                        (err, response) => {
                            this.$refs.refUsersLoader.desactivate();
                            if (err) {
                                this.$parent.$refs.refAlertUsers.showAlertSimple("error",
                                    "Ocurrió un error al crear el usuario.");
                            } else {
                                this.$parent.$refs.refAlertUsers.showAlertSimple("success",
                                    "Se ha guardado este usuario.");
                                this.$router.push({name: 'home.users'});
                            }
                        });
                } else {
                    this.$parent.$refs.refAlertUsers.showAlertSimple("error",
                        "Favor de llenar todos los campos obligatorios con valores válidos.");
                }
            }
        },
        meteor: {
            $subscribe: {
                'allProfiles': []
            },
            profiles() {
                return  Profile.find({}).fetch();
            }
        }
    }
</script>

<style scoped>

</style>
