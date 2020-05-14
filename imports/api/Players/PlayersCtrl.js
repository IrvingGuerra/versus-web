import {ValidatedMethod} from 'meteor/mdg:validated-method';
import UsersServ from "../Users/UsersServ";
import {check, Match} from "meteor/check";
import {ResponseMessage} from "../../startup/server/BusinessClass/ResponseMessage";
import Utilities from "../../startup/server/Utilities";

export const signupPlayerMethod = new ValidatedMethod({
    name: 'playerSignup',
    validate(player) {
        check(player.firstName, String);
        check(player.lastName, String);
        check(player.username, Match.Where((username) => {
            check(username, String);
            return username.indexOf(" ") === -1;
        }));
        check(player.email, String);
        check(player.gender, String);
        check(player.birthday, String);
        check(player.phone, {
            lada: String,
            number: Number
        });
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
                    createdAt: Utilities.currentLocalDate()
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