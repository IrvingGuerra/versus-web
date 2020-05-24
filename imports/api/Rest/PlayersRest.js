import Api from "./config";
import FileOperations from "../../startup/server/FileOperations";
import {ResponseMessage} from "../../startup/server/BusinessClass/ResponseMessage";
import {Meteor} from "meteor/meteor";
import Utilities from "../../startup/server/Utilities";
import UsersServ from "../Users/UsersServ";
import * as CryptoJS from 'crypto-js';

Api.addRoute('player/login' , {
    post: function () {
        let responseMessage = {
            statusCode: 400,
            body: {
                message: "Data is missing or user not found"
            },
            headers: {}
        };
        let user = Meteor.users.findOne({username: this.bodyParams.username});
        if(user){
            const decryptedPswSaved = JSON.parse(CryptoJS.AES.decrypt(user.profile.password, 'Versus team, the best developers').toString(CryptoJS.enc.Utf8));
            const decryptedPswSend= JSON.parse(CryptoJS.AES.decrypt(this.bodyParams.password, 'Versus team, the best developers').toString(CryptoJS.enc.Utf8));
            if(decryptedPswSaved === decryptedPswSend){
                responseMessage = {
                    statusCode: 201,
                    body: {
                        message: "Credenciales correctas"
                    },
                    headers: {
                        user: JSON.stringify(user)
                    }
                };
            }else{
                responseMessage = {
                    statusCode: 500,
                    body: {
                        message: "Credenciales incorrectas!"
                    },
                    headers: {}
                };
            }
        }
        return responseMessage;
    }
});

Api.addRoute('player/updatePersonalData', {
    post: async function () {
        let responseMessage = {
            statusCode: 400,
            body: {
                message: "Data is missing or user not found"
            },
            headers: {}
        };
        let file = null;
        if (this.request.files.length > 0) {
            file = this.request.files[0];
        }
        console.log(file)

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
                await UsersServ.updateUser(newUser, null);
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

