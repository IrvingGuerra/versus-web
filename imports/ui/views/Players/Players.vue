<template>
    <v-container>
        <v-row justify="center">
            <v-col xs="12" sm="12" md="10" lg="8" xl="5">
                <transition name="nested-section-view">
                    <div v-if="activeMainView">


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
                    </div>
                </transition>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    export default {
        name: 'Players',
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
                    firstName: '',
                    lastName: '',
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
                        value: 'profile.firstName', text: 'Primer Nombre', sortable: true, filter: value => {
                            return value != null &&
                                typeof value === 'string' &&
                                value.toString().toLocaleLowerCase()
                                    .indexOf(this.headersData.firstName.toLocaleLowerCase()) !== -1;
                        }
                    },
                    {
                        value: 'profile.lastName', text: 'Primer Nombre', sortable: true, filter: value => {
                            return value != null &&
                                typeof value === 'string' &&
                                value.toString().toLocaleLowerCase()
                                    .indexOf(this.headersData.lastName.toLocaleLowerCase()) !== -1;
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
                    }
                ];
            }
        },
        meteor: {
            $subscribe: {
                'players': []
            },
            users() {
                return Meteor.users.find({_id: {$ne: Meteor.userId()}}).fetch();
            }
        }
    };
</script>

<style scoped>

</style>
