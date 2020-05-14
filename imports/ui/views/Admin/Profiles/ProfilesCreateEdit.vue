<template>
    <v-container>
        <v-row class="section-title">
            <v-col>
                <h3 v-text="dataView.title"></h3>
            </v-col>
        </v-row>
        <v-row class="section-body">
            <v-col>
                <v-form @submit="saveProfile" id="saveProfile" autocomplete="off">
                    <v-row>
                        <v-col md="6">
                            <v-text-field v-model="profile.name" v-validate="'required'" id="inputNombre" name="nombre"
                                          :state="validateState('nombre')" label="Nombre del perfil" required>
                            </v-text-field>
                        </v-col>
                        <v-col md="6">
                            <v-text-field v-model="profile.description" v-validate="'required'"
                                          id="inputDescriptionProfile" name="descriptionProfile"
                                          :state="validateState('descriptionProfile')"
                                          label="Descripción del perfil" required>
                            </v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-card>
                                <v-card-title>Permisos de este perfil</v-card-title>
                                <v-card-text>
                                    <v-text-field v-model="searchSelfPermission" placeholder="Buscar. . ."
                                                  id="inputSearchSelfPermission" name="descriptionProfile">
                                    </v-text-field>
                                </v-card-text>
                                <v-sheet
                                        id="scrolling-techniques-2"
                                        class="overflow-y-auto"
                                        max-height="500">
                                    <v-list style="height: 400px;">
                                        <v-list-item-group>
                                            <draggable :list="selfPermissions" group="permissions">
                                                <v-list-item v-for="(permission, index) in filteredSelfPermissions"
                                                             v-text="permission.name" :key="permission._id">
                                                </v-list-item>
                                            </draggable>
                                        </v-list-item-group>
                                    </v-list>
                                </v-sheet>
                            </v-card>
                        </v-col>
                        <v-col>
                            <v-card>
                                <v-card-title>
                                    Todos los permisos
                                </v-card-title>
                                <v-card-text>
                                    <v-text-field v-model="searchPermission" placeholder="Buscar. . ."
                                                  id="inputSearchPermission" name="inputSearchPermission">
                                    </v-text-field>
                                </v-card-text>
                                <v-sheet
                                        id="scrolling-techniques-3"
                                        class="overflow-y-auto"
                                        max-height="500">
                                    <v-list style="height: 400px;">
                                        <v-list-item-group>
                                            <draggable class="list-item-group" :list="allPermissions"
                                                       group="permissions">
                                                <v-list-item v-for="(permission, index) in filteredPermissions"
                                                             v-text="permission.name" :key="permission._id">
                                                </v-list-item>
                                            </draggable>
                                        </v-list-item-group>
                                    </v-list>
                                </v-sheet>
                            </v-card>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <v-btn block type="submit" form="saveProfile" color="primary"
                                   outlined v-text="dataView.targetButton">
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-form>
            </v-col>
        </v-row>
        <loader ref="refProfilesLoader"></loader>
    </v-container>
</template>

<script>
    import validateMixin from '../../../mixins/validation';
    import draggable from 'vuedraggable';
    import Loader from "../../../components/Utilities/Loaders/Loader";

    export default {
        name: 'ProfilesCreateEdit',
        mixins: [validateMixin],
        components: {
            draggable,
            Loader
        },
        data() {
            return {
                profile: {
                    _id: null,
                    name: null,
                    description: null,
                    permissions: []
                },
                dataView: {
                    title: '',
                    targetButton: ''
                },
                searchSelfPermission: '',
                searchPermission: '',
                selfPermissions: [],
                allPermissions: []
            };
        },
        created() {
            if (this.$router.currentRoute.name.includes('create')) {
                this.dataView.title = 'Crear perfil';
                this.dataView.targetButton = 'Crear';
                this.listAllPermissions();

            } else if (this.$router.currentRoute.name.includes('edit')) {
                this.dataView.title = 'Editar perfil';
                this.dataView.targetButton = 'Actualizar';
                const tempProfile = this.$store.state.temporal.element;
                if (tempProfile !== null) {
                    this.profile = tempProfile;
                    this.initPermissionLists();
                } else {
                    this.$router.push({name: 'home.profiles'});
                }
            }

        },
        methods: {
            async saveProfile(evt) {
                evt.preventDefault();
                console.log('Data entered: ', this.profile);
                this.updateProfilePermissions();
                const valid = await this.$validator.validateAll();
                if (!valid) {
                    this.$root.$emit('showNotification', {
                        title: 'Error en el formulario',
                        text: 'Por favor complete todos los campos obligatorios con valores válidos.'
                    }, 'is-danger');
                    return;
                }
                this.$refs.refProfilesLoader.activate('Guardando perfil ...');
                Meteor.call('saveProfile', {profile: this.profile}, (err, response) => {
                    this.$refs.refProfilesLoader.desactivate();
                    if (err) {
                        console.log('Client error: ', err);
                        this.$parent.$refs.refAlertProfiles.showAlertSimple("error",
                            "Ocurrió un error al crear el perfil.");
                    } else {
                        console.log('Profile has been created / updated successful', response);
                        this.$parent.$refs.refAlertProfiles.showAlertSimple("success",
                            "Se ha guardado este perfil.");
                        this.$router.push({name: 'home.profiles'});
                    }
                });
            },
            updateProfilePermissions() {
                this.profile.permissions = [];
                this.selfPermissions.forEach((permission) => {
                    this.profile.permissions.push(permission.name);
                });
            },
            initPermissionLists() {
                Meteor.call('listNotProfilePermissions', {idProfile: this.profile._id}, (err, response) => {
                    if (err) {
                        console.error('Error listing permissions: ', err);
                    } else {
                        this.allPermissions = response;
                    }
                });

                Meteor.call('listProfilePermissions', {idProfile: this.profile._id}, (err, response) => {
                    if (err) {
                        console.error('Error listing profile permissions: ', err);
                    } else {
                        this.selfPermissions = response;
                    }
                });
            },
            listAllPermissions() {
                Meteor.call('listPermissions', (err, response) => {
                    if (err) {
                        console.error('Error listing all permissions: ', err);
                    } else {
                        console.log(response);
                        this.allPermissions = response;
                    }
                });
            }

        },
        computed: {
            filteredSelfPermissions() {
                return this.selfPermissions.filter(permission => {
                    return permission.name.toLowerCase().includes(this.searchSelfPermission.toLowerCase());
                });
            },
            filteredPermissions() {
                return this.allPermissions.filter(permission => {
                    return permission["name"].toLowerCase().includes(this.searchPermission.toLowerCase());
                });
            }
        }
    };
</script>

<style scoped>

</style>
