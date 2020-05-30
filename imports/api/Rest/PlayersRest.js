import Api from "./config";
import FileOperations from "../../startup/server/FileOperations";
import {ResponseMessage} from "../../startup/server/BusinessClass/ResponseMessage";
import {Meteor} from "meteor/meteor";
import UsersServ from "../Users/UsersServ";
import {check} from "meteor/check";
import * as CryptoJS from 'crypto-js';
import Utilities from "../../startup/server/Utilities";
import {StaticProfiles} from "../Profiles/Profile";

Api.addRoute('player/register' , {
    post: function () {
        this.response.setHeader('Content-Type','application/json');
        let response;
        try{
            check(this.bodyParams.firstName, String);
            check(this.bodyParams.lastName, String);
            check(this.bodyParams.username, String);
            check(this.bodyParams.email, String);
            check(this.bodyParams.gender, String);
            check(this.bodyParams.birthday, String);
            check(this.bodyParams.phone, {
                lada: String,
                number: Number
            });
            check(this.bodyParams.password, String);
            let user = Meteor.users.findOne({username: this.bodyParams.username});
            if(!user){
                try {
                    let playerData = {
                        username: this.bodyParams.username,
                        email: this.bodyParams.email,
                        profile: {
                            perfil: "player",
                            firstName: this.bodyParams.firstName,
                            lastName: this.bodyParams.lastName,
                            gender: this.bodyParams.gender,
                            birthday: this.bodyParams.birthday,
                            phone: this.bodyParams.phone,
                            password: CryptoJS.AES.encrypt(this.bodyParams.password, "Versus team, the best developers").toString(),
                            createdAt: Utilities.currentLocalDate(),
                        }
                    };
                        UsersServ.createUser(playerData, null);
                        console.log("Successfully registered player");
                        response = {
                            statusCode: 201,
                            body: {
                                message: "Successfully registered player"
                            },
                            headers: {}
                        };

                } catch (err) {
                    console.error("Player registration failed: ", err);
                    response = {
                        statusCode: 500,
                        body: {
                            message: "Player registration failed",
                            details: e
                        }
                    };
                }
            }else{
                console.log("Player already exists");
                response = {
                    statusCode: 401,
                    body: {
                        message: "Player already exists"
                    },
                    headers: {}
                };
            }
        }catch (e) {
            console.log("Data is missing: ", e);
            response = {
                statusCode: 400,
                body: {
                    message: "Data is missing",
                    info: e
                },
                headers: {}
            };
        }
        this.response.end(JSON.stringify(response));
        this.done();
    }
});

Api.addRoute('player/login' , {
    post: function () {
        this.response.setHeader('Content-Type','application/json');
        let response;
        try{
            check(this.bodyParams.username, String);
            check(this.bodyParams.password, String);
            let user = Meteor.users.findOne({username: this.bodyParams.username});
            if(user){
                const decryptedPassword = JSON.parse(CryptoJS.AES.decrypt(user.profile.password, 'Versus team, the best developers').toString(CryptoJS.enc.Utf8));
                if(decryptedPassword == this.bodyParams.password){
                    console.log("Login successful");
                    response = {
                        statusCode: 201,
                        body: {
                            message: "Login successful",
                            user: JSON.stringify(user)
                        },
                        headers: {}
                    };
                }else{
                    console.log("Incorrect password");
                    response = {
                        statusCode: 500,
                        body: {
                            message: "Incorrect password"
                        },
                        headers: {}
                    };
                }
            }else{
                console.log("Player doesn't exists");
                response = {
                    statusCode: 401,
                    body: {
                        message: "Player doesn't exists"
                    },
                    headers: {}
                };
            }
        }catch (e) {
            console.log("Data is missing: ", e);
            response = {
                statusCode: 400,
                body: {
                    message: "Data is missing",
                    info: e
                },
                headers: {}
            };
        }
        this.response.end(JSON.stringify(response));
        this.done();
    }
});

Api.addRoute('player/getPlayers' , {
    get: function () {
        this.response.setHeader('Content-Type','application/json');
        let response;
        let users = Meteor.users.find({"profile.perfil": {$in: [StaticProfiles.player.name]} }).fetch();
        if(users){
            console.log("Players found");
            response = {
                statusCode: 201,
                body: {
                    message: "Players found",
                    users: JSON.stringify(users)
                },
                headers: {}
            };
        }else{
            console.log("Players not found");
            response = {
                statusCode: 401,
                body: {
                    message: "Players not found"
                },
                headers: {}
            };
        }

        this.response.end(JSON.stringify(response));
        this.done();
    }
});

Api.addRoute('player/updatePlayerData' , {
    post: function () {
        this.response.setHeader('Content-Type','application/json');
        let response;
        try{
            check(this.bodyParams.idUser, String);
            check(this.bodyParams.firstname, String);
            check(this.bodyParams.lastname, String);
            check(this.bodyParams.username, String);
            check(this.bodyParams.email, String);
            check(this.bodyParams.gender, String);
            check(this.bodyParams.birthday, String);
            check(this.bodyParams.phone, {
                lada: String,
                number: Number
            });
            let user = Meteor.users.findOne(this.bodyParams.idUser);
            if(user){
                //Update photo
                if (this.request.files !== undefined && this.request.files.length > 0) {
                    let file = null;
                    file = this.request.files[0];
                    try {
                        let filename = `${user.username}_thumb.jpg`;
                        let successSavedFile = FileOperations.saveFile(file.data, filename, "users/"+user.username);
                        if (successSavedFile) {
                            console.log("Finished file saved");
                        } else {
                            console.log("Error saving file");
                        }
                    } catch (e) {
                        console.error("Error saving file: ", e);
                        response = {
                            statusCode: 500,
                            body: {
                                message: "Error saving file"
                            },
                            headers: {}
                        };

                    }
                }
                //Update info
                try {
                    let newUser = {
                        _id: this.bodyParams.idUser,
                        correo: this.bodyParams.email,
                        usuario: this.bodyParams.username,
                        perfil: 'player',
                        profile: {
                            perfil: 'player',
                            firstName: this.bodyParams.firstName,
                            lastName: this.bodyParams.lastName,
                            gender: this.bodyParams.gender,
                            birthday: this.bodyParams.birthday,
                            phone: {
                                lada: this.bodyParams.phone.lada,
                                number: this.bodyParams.phone.number
                            },
                            password: user.profile.password,
                            createdAt: user.profile.createdAt,
                            updateAt: Utilities.currentLocalDate(),
                        }
                    };
                    UsersServ.updateUser(newUser, null);
                    console.log("Player successfully updated");
                    response = {
                        statusCode: 201,
                        body: {
                            message: "Player successfully updated"
                        },
                        headers: {}
                    };

                } catch (err) {
                    console.log("Player update failed");
                    response = {
                        statusCode: 500,
                        body: {
                            message: "Player update failed"
                        },
                        headers: {}
                    };
                }

            }else{
                console.log("Player id incorrect");
                response = {
                    statusCode: 401,
                    body: {
                        message: "Player id incorrect"
                    },
                    headers: {}
                };
            }
        }catch (e) {
            console.log("Data is missing: ", e);
            response = {
                statusCode: 400,
                body: {
                    message: "Data is missing",
                    info: e
                },
                headers: {}
            };
        }
        this.response.end(JSON.stringify(response));
        this.done();
    }
});

Api.addRoute('player/removePlayer' , {
    post: function () {
        this.response.setHeader('Content-Type','application/json');
        let response;
        try{
            check(this.bodyParams.idUser, String);
            let user = Meteor.users.findOne(this.bodyParams.idUser);
            if(user){
                try {
                    Meteor.users.remove(this.bodyParams.idUser);
                    console.log("Player successfully removed");
                    response = {
                        statusCode: 201,
                        body: {
                            message: "Player successfully removed"
                        },
                        headers: {}
                    };
                } catch (err) {
                    console.log("Player removed failed");
                    response = {
                        statusCode: 500,
                        body: {
                            message: "Player removed failed"
                        },
                        headers: {}
                    };
                }

            }else{
                console.log("Player id incorrect");
                response = {
                    statusCode: 401,
                    body: {
                        message: "Player id incorrect"
                    },
                    headers: {}
                };
            }
        }catch (e) {
            console.log("Data is missing: ", e);
            response = {
                statusCode: 400,
                body: {
                    message: "Data is missing",
                    info: e
                },
                headers: {}
            };
        }
        this.response.end(JSON.stringify(response));
        this.done();
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
        validate(this.request.data);
        let user = Meteor.users.findOne(this.request.data.idUser);
        if (user) {
            if (this.request.files !== undefined && this.request.files.length > 0) {
                let file = null;
                file = this.request.files[0];
                try {
                    let filename = `${user.username}_thumb.jpg`;
                    let successSavedFile = FileOperations.saveFile(file.data, filename, "users/"+user.username);
                    if (successSavedFile) {
                        console.log("Finished file saved");
                    } else {
                        console.log("Error saving file");
                    }
                } catch (e) {
                    console.error("Error saving file: ", e);
                    responseMessage = {
                        statusCode: 500,
                        body: {
                            message: "Error saving file",
                            details: e
                        }
                    };
                }
            }
            try {
                let newUser = {
                    _id: this.request.data.idUser,
                    correo: this.request.data.email,
                    usuario: user.username,
                    perfil: 'player',
                    profile: {
                        perfil: 'player',
                        firstName: this.request.data.firstName,
                        lastName: this.request.data.lastName,
                        gender: this.request.data.gender,
                        birthday: this.request.data.birthday,
                        phone: {
                            lada: this.request.data.phoneLada,
                            number: this.request.data.phoneNumber
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

Api.addRoute('getPlayerThumbnail/:idPlayer', {
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
            let filename = `${user.username}_thumb.jpg`;
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
