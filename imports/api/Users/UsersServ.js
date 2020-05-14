import {Meteor} from 'meteor/meteor';
import {Profile} from "../Profiles/Profile";
import {ResponseMessage} from "../../startup/server/BusinessClass/ResponseMessage";
import fileHelper from "../../startup/server/FileOperations";
import Utilities from "../../startup/server/Utilities";
import {check} from 'meteor/check'

const PATH_USER_FILES = "users/";
const EXTENSION_LOGO_IMAGE = ".jpg";

export default {
    setUserRoles(idUser, perfil) {
        let permisos = Profile.findOne({name: perfil}).permissions;
        Meteor.users.update(idUser, {
            $set: {
                roles: {}
            }
        });
        Roles.setUserRoles(idUser, permisos, perfil);
    },
    isAvailableNewUsername(oldUsername, newUsername) {
        let targetUsername = [];
        let isAvailable = false;
        if (oldUsername !== newUsername) {
            targetUsername = Meteor.users.find({username: newUsername}).fetch();
            if (targetUsername.length === 0) {
                isAvailable = true;
            }
        }
        return isAvailable;
    },
    isAvailableNewEmail(oldEmail, newEmail) {
        let targetEmail = [];
        let isAvailable = false;
        if (oldEmail !== newEmail) {
            targetEmail = Meteor.users.find({"emails.address": newEmail}).fetch();
            if (targetEmail.length === 0) {
                isAvailable = targetEmail;
            }
        }
        return isAvailable;
    },
    validateUserData(user) {
        let responseMessage = new ResponseMessage();
        try {
            check(user.usuario, String);
            check(user.correo, String);
            check(user.perfil, String);
            check(user.nombre, String);
            responseMessage.create(true, "All data is correct");
        } catch (exception) {
            console.error("There was an error in user validation: ", exception);
            responseMessage.create(false, exception.message, null, exception);
        }
        return responseMessage;
    },
    async createUser(userData, photoFileUser) {
        let responseMessage = new ResponseMessage();
        if (photoFileUser) {
            userData.profile["path"] = "users/" + userData.username;
        }
        let idUser = Accounts.createUser(userData);
        if (idUser) {
            responseMessage.data = {idUser};
            this.setUserRoles(idUser, userData.profile.perfil);
            Accounts.sendEnrollmentEmail(idUser, userData.email);
        }
        if (photoFileUser) {
            let base64Image = photoFileUser.split(";base64,").pop();
            let isError = await fileHelper.saveFileFromBase64(base64Image,
                userData.username + EXTENSION_LOGO_IMAGE, userData.profile.path);
            if (isError) {
                throw new Meteor.Error('500', 'Error al subir la foto.', isError);
            } else {
                let error = await fileHelper.createThumbnail(userData.profile.path, userData.username
                    + EXTENSION_LOGO_IMAGE);
                if (error) {
                    console.error('There was an error creating the thumbnail', error);
                }
            }
        }else{

        }
        responseMessage.isStatus = true;
        responseMessage.message = "User created successful";
        return responseMessage;
    },
    async updateUser(newUser, photoFileUsers) {
        let responseMessage = new ResponseMessage();

        let currentUser = Meteor.users.findOne(newUser._id);
        let isAvailableNewEmail = this.isAvailableNewEmail(currentUser.emails[0].address, newUser.correo);
        let isAvailableNewUsername = this.isAvailableNewUsername(currentUser.username, newUser.usuario);

        if (currentUser.emails[0].address !== newUser.correo && !isAvailableNewEmail) {
            throw new Meteor.Error("500", "El nuevo email ya se encuentra en uso");
        }
        if (currentUser.username !== newUser.usuario && !isAvailableNewUsername) {
            throw new Meteor.Error("500", "El nuevo nombre de usuario ya se encuentra en uso");
        }

        if (currentUser.emails[0].address !== newUser.correo) {
            Accounts.removeEmail(newUser._id, currentUser.emails[0].address);
            Accounts.addEmail(newUser._id, newUser.correo);
        }

        if (currentUser.username !== newUser.usuario) {
            Accounts.setUsername(newUser._id, newUser.usuario);
            if(fileHelper.existsUserDirectory(currentUser.username)){
                let isSuccessChangeFoldername = await fileHelper.updateUserFoldername(currentUser.username, newUser.usuario);
                if (!isSuccessChangeFoldername) {
                    throw new Meteor.Error("500", "Hubo error al actualizar el directorio del usuario");
                }
                let isSucessChangeResourceFilesUser = await fileHelper.updateLogoAndThumbnailNamesOfUser(
                    currentUser.username + EXTENSION_LOGO_IMAGE, newUser.usuario + EXTENSION_LOGO_IMAGE,
                    PATH_USER_FILES + newUser.usuario);
                if (!isSucessChangeResourceFilesUser) {
                    throw new Meteor.Error("500", "Hubo error al actualizar los recursos del usuario");
                }
            }
        }
        if(newUser.profile.perfil === 'player'){
            Meteor.users.update(newUser._id, {
                $set: {
                    profile: {
                        perfil: newUser.profile.perfil,
                        firstName: newUser.profile.firstName,
                        lastName: newUser.profile.lastName,
                        gender: newUser.profile.gender,
                        birthday: newUser.profile.birthday,
                        phone: newUser.profile.phone,
                        updated_at: Utilities.currentLocalDate(),
                        path: PATH_USER_FILES + newUser.usuario
                    }
                }
            });
        }else{
            Meteor.users.update(newUser._id, {
                $set: {
                    profile: {
                        perfil: newUser.perfil,
                        nombre: newUser.nombre,
                        updated_at: Utilities.currentLocalDate(),
                        path: PATH_USER_FILES + newUser.usuario
                    }
                }
            });
        }
        this.setUserRoles(newUser._id, newUser.perfil);

        if (photoFileUsers) {
            newUser["path"] = PATH_USER_FILES + newUser.usuario;
            let base64Image = photoFileUsers.split(";base64,").pop();
            let isError = await fileHelper.saveFileFromBase64(base64Image,
                newUser.usuario + EXTENSION_LOGO_IMAGE, newUser.path);
            if (isError) {
                throw new Meteor.Error('500', 'Error al guardar los recursos del usuario. (1)', isError);
            } else {
                let error = await fileHelper.updateThumbnail(newUser.path, newUser.usuario + EXTENSION_LOGO_IMAGE);
                if (error) {
                    console.log('There was an error creating the thumbnail', error);
                    throw new Meteor.Error('500', 'Error al guardar los recursos del usuario. (2)');
                }
            }
        }
        responseMessage.isStatus = true;
        responseMessage.message = "User updated successful";
        return responseMessage;
    },
    deleteUser(user) {
        let responseMessage = new ResponseMessage();
        Meteor.users.remove(user._id);
        fileHelper.remove(user.profile.path);
        responseMessage.create(true, "User removed!");
        return responseMessage;
    }
}