<template>
    <v-container>
        <transition name="nested-section-view">
            <div v-show="activeMainView">
                <v-row justify="center">
                    <v-col cols="12" sm="8" md="6" lg="5">
                        <v-data-table :headers="fields" :items="profiles" sort-by="description" class="elevation-1">
                            <template v-slot:top>
                                <v-toolbar flat color="white">
                                    <v-toolbar-title>Perfiles registrados</v-toolbar-title>
                                    <v-divider class="mx-3" inset vertical></v-divider>
                                    <v-spacer></v-spacer>
                                    <v-tooltip bottom transition="fab-transition">
                                        <template v-slot:activator="{on}">
                                            <v-btn color="success" v-on="on" dark class="mb-2" outlined
                                                   :to="{name:'home.profiles.create'}">
                                                <v-icon>add_circle_outline</v-icon>
                                            </v-btn>
                                        </template>
                                        <span>Agregar perfil</span>
                                    </v-tooltip>
                                    <v-spacer></v-spacer>
                                </v-toolbar>
                            </template>
                            <template v-slot:item.action="{ item }">
                                <v-tooltip bottom transition="fab-transition">
                                    <template v-slot:activator="{on}">
                                        <v-icon color="warning" v-on="on" small class="mr-2"
                                                @click="openEditProfile(item)">
                                            edit
                                        </v-icon>
                                    </template>
                                    <span>Editar</span>
                                </v-tooltip>
                                <v-tooltip bottom transition="fab-transition">
                                    <template v-slot:activator="{on}">
                                        <v-icon color="error" v-on="on" small @click="openRemoveModal(item)">
                                            delete
                                        </v-icon>
                                    </template>
                                    <span>Eliminar</span>
                                </v-tooltip>
                            </template>
                        </v-data-table>
                    </v-col>
                </v-row>

                <!-- Modal Component -->
                <modal-remove ref="refModalRemove" v-bind:modalData="profileTemp"
                              @id_element="deleteProfile">
                </modal-remove>
            </div>
        </transition>
        <transition name="nested-section-view">
            <router-view name="profilesOptionsView"></router-view>
        </transition>
        <alert-message ref="refAlertProfiles"></alert-message>
    </v-container>
</template>

<script>
    import ModalRemove from './../../../components/Utilities/Modals/ModalRemove';
    import {mapMutations} from 'vuex';
    import profilesMixin from '../../../mixins/accounts/profiles';
    import AlertMessage from "../../../components/Utilities/Alerts/AlertMessage";

    export default {
        name: 'Profiles',
        mixins: [profilesMixin],
        components: {
            ModalRemove,
            AlertMessage
        },
        data() {
            return {
                // Note `isActive` is left out and will not appear in the rendered table
                fields: [
                    {value: 'description', text: 'Nombre del perfil', sortable: true},
                    {value: 'action', text: 'Opciones', sortable: false}],
                profileTemp: {
                    preposition: 'el',
                    typeElement: 'perfil',
                    mainNameElement: '',
                    _id: null,
                    element: {}
                },
                activeMainView: true
            };
        },
        watch: {
            '$route'() {
                this.updateMainView();
            }
        },
        mounted() {
            this.updateMainView();
        },
        methods: {
            ...mapMutations('temporal', ['setElement']),
            updateMainView() {
                const currentRoute = this.$router.currentRoute.name.split('.').pop();
                this.activeMainView = (currentRoute === 'profiles');
            },
            openRemoveModal(profile) {
                profile._rowVariant = 'danger';
                this.profileTemp.element = profile;
                this.profileTemp._id = profile._id;
                this.profileTemp.element.removed = false;
                this.profileTemp.mainNameElement = profile.description;
                this.$refs.refModalRemove.dialog = true;
            },
            openEditProfile(profile) {
                this.setElement(profile);
                this.$router.push({name: 'home.profiles.edit'});
            },
            deleteProfile(idProfile) {
                Meteor.call('deleteProfile', {idProfile}, (err, response) => {
                    if (err) {
                        this.$refs.refAlertProfiles.showAlertSimple("error",
                            "Ocurrió un error al eliminar el perfil.");
                    } else {
                        this.$refs.refAlertProfiles.showAlertSimple("success",
                            "Se ha eliminado el perfil.");
                    }
                });

            }
        }
    };
</script>

<style scoped>

</style>
