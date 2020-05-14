import { Mongo } from 'meteor/mongo';

export const Profile = new Mongo.Collection('profiles');

export const StaticProfiles = {
    admin: {
        name: 'admin',
        description: "Administrador",
        permissions: []
    },
    player: {
        name: 'player',
        description: "Jugador",
        permissions: []
    }
};