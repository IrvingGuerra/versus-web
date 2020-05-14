<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12" xs="12" sm="4" md="3" lg="2" xl="2">
                <v-card class="mx-auto"
                        max-width="300"
                        tile>
                    <v-list subheader>
                        <v-subheader>CONTACTOS</v-subheader>
                        <v-list-item-group v-model="contactTemp" color="primary">
                            <v-divider></v-divider>
                            <template v-for="(contact, i) in users">
                                <v-list-item :key="contact._id" :value="contact">
                                    <v-list-item-icon>
                                        <v-icon :color="contact.status.online?'green':'red'">
                                            mdi-checkbox-blank-circle
                                        </v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                        <v-list-item-title v-text="contact.profile.nombre">
                                        </v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </template>
                        </v-list-item-group>
                    </v-list>
                </v-card>
            </v-col>
            <v-col cols="12" xs="12" sm="8" md="9" lg="10" xl="10">
                <v-card class="mx-auto" v-if="contactTemp" height="70vh">
                    <v-list-item>
                        <v-list-item-avatar size="36px">
                            <img :src="'./api/getUserThumbnail/'+contactTemp._id" alt="Avatar">
                        </v-list-item-avatar>
                        <v-list-item-title class="headline">{{contactTemp.profile.nombre}}</v-list-item-title>
                    </v-list-item>
                    <v-card-text id='msgContainer' style="height: 70%" class="overflow-y-auto">
                        <v-row :class="msg.idReceiver===contactTemp._id? 'justify-end' : 'justify-start'"
                               v-for="msg in messages">
                            <v-col cols="7">
                                <v-card raised shaped
                                        :color="msg.idReceiver===contactTemp._id?'cyan lighten-5':'red lighten-5'">
                                    <v-card-text class="pb-1">
                                        {{msg.text}}
                                    </v-card-text>
                                    <v-card-subtitle class="text-right pt-1 pb-1">
                                        <v-tooltip left>
                                            <template v-slot:activator="{on}">
                                                <v-icon v-on="on" small>info_outlined</v-icon>
                                            </template>
                                            <span>{{msg.date.substring(0,10)}}</span>
                                        </v-tooltip>
                                        {{msg.date.split("T")[1].substring(0,5)}}
                                        <v-icon style="margin-right: -15px" v-if="msg.idReceiver===contactTemp._id"
                                                small :color="msg.read === true ?'red':'gray'">
                                            check
                                        </v-icon>
                                        <v-icon v-if="msg.idReceiver===contactTemp._id" small
                                                :color="msg.read === true ?'red':'gray'">
                                            check
                                        </v-icon>
                                    </v-card-subtitle>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <v-card-actions>
                        <v-text-field @focus="readAllMessages" id="inputMensaje" v-model="messageTemp.text"
                                      v-on:keyup.enter="sendMessage"
                                      name="inputMensaje" label="Introduce tu mensaje">
                        </v-text-field>
                        <v-btn class="mx-2" fab dark color="indigo" @click="sendMessage">
                            <v-icon dark>send</v-icon>
                        </v-btn>
                    </v-card-actions>
                </v-card>
                <v-card v-else height="70vh">
                    <h1>Bienvenido al Chat</h1>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import date from "../../mixins/helpers/date";
    import {Message} from "../../../api/Messages/Message";

    export default {
        name: "Chat",
        mixins: [date],
        data() {
            return {
                contactTemp: null,
                messageTemp: {
                    idSender: null,
                    idReceiver: null,
                    date: null,
                    text: null,
                    read: false,
                }
            }
        },
        updated() {
            const elem = this.$el.querySelector('#msgContainer')
            if (elem) {
                elem.scrollTop = elem.scrollHeight;
            }
        },
        methods: {
            sendMessage() {
                this.messageTemp.idSender = Meteor.userId();
                this.messageTemp.idReceiver = this.contactTemp._id;
                this.messageTemp.date = this.currentLocalDate().toISOString();
                console.log("message: ", this.messageTemp);
                Meteor.call("saveMessage", this.messageTemp, (error, result) => {
                    if (error) {
                        console.error("Hubo error: ", error);
                    } else {
                        this.messageTemp.text = null;
                    }
                });
            },
            readAllMessages() {
                Meteor.call("readMessages", this.messages.filter(msg => msg.read === false),
                    (error, result) => {
                    if (error) {
                        console.error("Hubo error: ", error);
                    } else {
                        this.messageTemp.text = null;
                    }
                });
            }
        },
        meteor: {
            $subscribe: {
                "users": [],
                "messages": function () {
                    return [this.contactTemp ? this.contactTemp._id : null]
                }
            },
            users() {
                return Meteor.users.find({_id: {$ne: Meteor.userId()}}).fetch();
            },
            messages() {
                return this.contactTemp ? Message.find({}, {
                    sort: {
                        date: 1
                    }
                }).fetch() : [];
            }
        }
    }
</script>

<style scoped>

</style>