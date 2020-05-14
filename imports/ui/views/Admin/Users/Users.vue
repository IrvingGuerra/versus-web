<template>
    <v-container>
        <v-row justify="center">
            <v-col xs="12" sm="12" md="10" lg="8" xl="5">
                <transition name="nested-section-view">
                    <div v-if="activeMainView">
                        <div class="d-flex flex-row-reverse mb-5">
                            <v-tooltip bottom transition="fab-transition">
                                <template v-slot:activator="{on}">
                                    <v-btn color="success" v-on="on" fab dark :to="{name:'home.users.create'}">
                                        <v-icon>add</v-icon>
                                    </v-btn>
                                </template>
                                <span>Agregar usuario</span>
                            </v-tooltip>
                        </div>

                        <v-data-table :headers="headers" :items="users" sort-by="profile" class="elevation-1">
                            <template v-slot:item.profile.path="{item}">
                                <v-avatar size="36px">
                                    <img :src="'./api/getUserThumbnail/'+item._id || '/img/user.png'" alt="Avatar">
                                </v-avatar>
                            </template>
                            <template v-slot:item.status.online="{item}">
                                <v-icon :color="item.status.online?'green':'red'">
                                    mdi-checkbox-blank-circle
                                </v-icon>
                            </template>
                            <template v-slot:item.action="{ item }">
                                <v-tooltip bottom transition="fab-transition">
                                    <template v-slot:activator="{on}">
                                        <v-icon color="info" v-on="on" small class="mr-2" @click="openEditUser(item)">
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
                            <template v-slot:body.append="{isMobile}">
                                <tr v-if="!isMobile">
                                    <td>
                                    </td>
                                    <td>
                                    </td>
                                    <td>
                                        <v-text-field v-model="headersData.fullname" type="text"
                                                      label="Nombre"></v-text-field>
                                    </td>
                                    <td>
                                        <v-text-field v-model="headersData.username" type="text"
                                                      label="Usuario"></v-text-field>
                                    </td>
                                    <td>
                                        <v-text-field v-model="headersData.email" type="email"
                                                      label="Correo"></v-text-field>
                                    </td>
                                    <td></td>
                                </tr>
                            </template>
                        </v-data-table>

                        <!-- Modal Component -->
                        <modal-remove ref="refModalRemove" v-bind:modalData="userTemp"
                                      @id_element="deleteUser"></modal-remove>

                    </div>
                </transition>
                <transition name="nested-section-view">
                    <router-view name="usersOptionsView"></router-view>
                </transition>
                <alert-message ref="refAlertUsers"></alert-message>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import ModalRemove from './../../../components/Utilities/Modals/ModalRemove';
    import AlertMessage from "../../../components/Utilities/Alerts/AlertMessage";
    import {mapMutations} from 'vuex';

    export default {
        name: 'Users',
        components: {
            ModalRemove,
            AlertMessage
        },
        data() {
            return {
                // Note `isActive` is left out and will not appear in the rendered table
                userTemp: {
                    preposition: 'al',
                    typeElement: 'usuario',
                    mainNameElement: '',
                    _id: null,
                    element: {}
                },
                search: '',
                headersData: {
                    path: '',
                    status: {},
                    fullname: '',
                    username: '',
                    email: ''
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
                let currentRoute = this.$router.currentRoute.name.split('.').pop();
                this.activeMainView = (currentRoute === 'users');
            },
            openRemoveModal(user) {
                user._rowVariant = 'danger';
                this.userTemp.element = user;
                this.userTemp._id = user._id;
                this.userTemp.element.removed = false;
                this.userTemp.mainNameElement = user.profile.nombre;
                this.$refs.refModalRemove.dialog = true;
            },
            openEditUser(user) {
                this.setElement(user);
                this.$router.push({name: 'home.users.edit'});
            },
            deleteUser(idUser) {
                Meteor.call('deleteUser', {idUser}, (err, response) => {
                    if (err) {
                        console.error("Error to delete user: ",err);
                        this.$refs.refAlertUsers.showAlertSimple("error",
                            "Ocurrió un error al eliminar el usuario.");
                    } else {
                        this.$refs.refAlertUsers.showAlertSimple("success",
                            "Se ha eliminado el usuario.");
                    }
                });
            }
        },
        computed: {
            headers() {
                return [
                    {
                        value: 'profile.path', text: 'Imagen', sortable: false
                    },
                    {
                        value: "status.online", text: 'En línea', sortable: true
                    },
                    {
                        value: 'profile.nombre', text: 'Nombre completo', sortable: true, filter: value => {
                            return value != null &&
                                typeof value === 'string' &&
                                value.toString().toLocaleLowerCase()
                                    .indexOf(this.headersData.fullname.toLocaleLowerCase()) !== -1;
                        }
                    },
                    {
                        value: 'username', text: 'Usuario', sortable: true, filter: value => {
                            return value != null &&
                                typeof value === 'string' &&
                                value.toString().toLocaleLowerCase()
                                    .indexOf(this.headersData.username.toLocaleLowerCase()) !== -1;
                        }
                    },
                    {
                        value: 'emails[0].address', text: 'Correo electrónico', sortable: true, filter: value => {
                            return value != null &&
                                typeof value === 'string' &&
                                value.toString().indexOf(this.headersData.email) !== -1;
                        }
                    },
                    {value: 'action', text: 'Opciones', sortable: false}];
            }
        },
        meteor: {
            $subscribe: {
                'users': []
            },
            users() {
                return Meteor.users.find({_id: {$ne: Meteor.userId()}}).fetch();
            }
        }
    };
</script>

<style scoped>

</style>
