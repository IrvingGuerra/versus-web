import Api from "./config";
import FileOperations from "../../startup/server/FileOperations";
import {ResponseMessage} from "../../startup/server/BusinessClass/ResponseMessage";
import {Meteor} from "meteor/meteor";
import Utilities from "../../startup/server/Utilities";
import UsersServ from "../Users/UsersServ";
import {check} from "meteor/check";

Api.addRoute('player/updatePersonalData', {
    post: async function () {
        let responseMessage = {
            statusCode: 400,
            body: {
                message: "Data is missing or user not found"
            },
            headers: {}
        };
        function validate(player) {
            check(player.idUser, String);
            check(player.firstName, String);
            check(player.lastName, String);
            check(player.email, String);
            check(player.gender, String);
            check(player.birthday, String);
            check(player.phoneLada, String);
            check(player.phoneNumber, String);
        }
        validate(this.queryParams);
        let file = null;
        if (this.request.files !== undefined && this.request.files.length > 0) {
            file = this.request.files[0];
        }
        let user = Meteor.users.findOne(this.queryParams.idUser);
        if (user) {
            try {
                let newUser = {
                    _id: this.queryParams.idUser,
                    correo: this.queryParams.email,
                    usuario: user.username,
                    perfil: 'player',
                    profile: {
                        perfil: 'player',
                        firstName: this.queryParams.firstName,
                        lastName: this.queryParams.lastName,
                        gender: this.queryParams.gender,
                        birthday: this.queryParams.birthday,
                        phone: {
                            lada: this.queryParams.phoneLada,
                            number: this.queryParams.phoneNumber
                        }
                    }
                };
                await UsersServ.updateUser(newUser, file);
                console.log("Usuario actualizado con exito");
                responseMessage = {
                    statusCode: 201,
                    body: {
                        message: "Usuario actualizado!"
                    },
                    headers: {}
                };
            } catch (err) {
                console.error("Error updating user: ", err);
                responseMessage = {
                    statusCode: 500,
                    body: {
                        message: "Error updating user",
                        details: e
                    }
                };
            }
        }
        return responseMessage;
    }
});

Api.addRoute('player/:idPlayer', {
    get: function () {
        let responseMessage = {
            statusCode: 400,
            body: {
                message: "Data is missing or user not found"
            },
            headers: {}
        };
        function validate(idPlayer) {
            check(idPlayer, String);
        }
        validate(this.urlParams.idPlayer);
        let user = Meteor.users.findOne(this.urlParams.idPlayer);
        if (user) {
            let file = null;
            let filename = `${user.username}.jpg`;
            try {
                file = FileOperations.getFile(user.profile.path + "/" + filename);
                responseMessage.statusCode = 200;
                responseMessage.body = file.data;
                responseMessage.headers["Content-disposition"] = "filename=" + filename;
                responseMessage.headers["Content-length"] = file.data.length;
                responseMessage.headers["Content-Type"] = file.meta.mime;
            } catch (error) {
                console.error("Thumbnail not found ");
                responseMessage.statusCode = 302;
                responseMessage.headers["Content-Type"] = 'text/plain';
                responseMessage.headers["Location"] = '/img/user.png';
                responseMessage.body = 'Location: /img/user.png';
            }
        }
        return responseMessage;
    }
});
