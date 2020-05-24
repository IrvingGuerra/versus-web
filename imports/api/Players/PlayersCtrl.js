import {ValidatedMethod} from 'meteor/mdg:validated-method';
import UsersServ from "../Users/UsersServ";
import {check} from "meteor/check";
import {ResponseMessage} from "../../startup/server/BusinessClass/ResponseMessage";
import Utilities from "../../startup/server/Utilities";
import * as CryptoJS from 'crypto-js';

export const signupPlayerMethod = new ValidatedMethod({
    name: 'playerSignup',
    validate(player) {
        check(player.firstName, String);
        check(player.lastName, String);
        check(player.username, String);
        check(player.email, String);
        check(player.gender, String);
        check(player.birthday, String);
        check(player.phone, {
            lada: String,
            number: Number
        });
        check(player.password, String);
    },
    async run(player) {
        let responseMessage = new ResponseMessage();
        try {
            let playerData = {
                username: player.username,
                email: player.email,
                profile: {
                    perfil: "player",
                    firstName: player.firstName,
                    lastName: player.lastName,
                    gender: player.gender,
                    birthday: player.birthday,
                    phone: player.phone,
                    password: CryptoJS.AES.encrypt(player.password, "Versus team, the best developers").toString(),
                    createdAt: Utilities.currentLocalDate(),
                }
            };
            await UsersServ.createUser(playerData, null);
            responseMessage.create(true, "Jugador creado");

        } catch (err) {
            console.error("Error creating user: ", err);
            throw new Meteor.Error("500", "Error al crear el jugador", err);
        }
        return responseMessage;
    }
});
