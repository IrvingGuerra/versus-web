import {Meteor} from 'meteor/meteor';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import AuthGuard from './../../middlewares/AuthGuard';
import {ResponseMessage} from '../../startup/server/BusinessClass/ResponseMessage';
import {check} from 'meteor/check'
import Utilities from "./../../startup/server/Utilities";
import fileHelper from './../../startup/server/FileOperations';
import UsersServ from "./UsersServ";

//Permisos
import Permissions from "../../startup/server/Permissions";

//Configuration for user-status
Accounts.onCreateUser((options, user) => {
    const customizedUser = Object.assign({
        status: {
            online: false
        },
    }, user);
    // We still want the default hook's 'profile' behavior.
    if (options.profile) {
        customizedUser.profile = options.profile;
    }
    return customizedUser;
});

export const saveUserMethod = new ValidatedMethod({
    name: 'saveUser',
    mixins: [MethodHooks],
    permissions: [Permissions.USERS.CREATE, Permissions.USERS.UPDATE],
    beforeHooks: [AuthGuard.checkPermission],
    validate({user}) {
        check(user.usuario, String);
        check(user.correo, String);
        check(user.perfil, String);
        check(user.nombre, String);
    },
    async run({user, photoFileUser}) {
        let responseMessage = new ResponseMessage();
        if (user._id !== null) {//Si existe entonces actualiza
            try {
                check(user._id, String);
                await UsersServ.updateUser(user, photoFileUser);
                responseMessage.create(true, "Usuario actualizado");
            } catch (err) {
                console.error("Error updating user: ", err);
                throw new Meteor.Error("500", "Error al actualizar el usuario.", err);
            }
        } else {//Sino entonces lo crea
            try {
                let userData = {
                    username: user.usuario,
                    email: user.correo,
                    profile: {
                        perfil: user.perfil,
                        nombre: user.nombre,
                        updated_at: Utilities.currentLocalDate()
                    }
                };
                await UsersServ.createUser(userData, photoFileUser);
                responseMessage.create(true, "Usuario creado");
            } catch (err) {
                console.error("Error creating user: ", err);
                throw new Meteor.Error("500", "Error al crear el usuario", err);
            }
        }
        return responseMessage;
    }
});

export const deleteUserMethod = new ValidatedMethod({
    name: 'deleteUser',
    mixins: [MethodHooks],
    permissions: [Permissions.USERS.DELETE],
    beforeHooks: [AuthGuard.checkPermission],
    validate({idUser}) {
        check(idUser, String);
    },
    run({idUser}) {
        let responseMessage = new ResponseMessage();
        try {
            let user = Meteor.users.findOne(idUser);
            UsersServ.deleteUser(user);
            responseMessage.create(true, "Se eliminó el usuario correctamente");
            return responseMessage;
        } catch (err) {
            throw new Meteor.Error('500', "Error al eliminar el usuario", err);
        }
    }
});

/**
 * Get image src as an asset
 * @param assetPath
 *
 */
export const getImageSrcMethod = new ValidatedMethod({
    name: 'getImageSrc',
    validate: null,
    run({assetPath}) {
        let result = fileHelper.loadAsset(assetPath);
        if (!result) {
            result = 'img/user.png';
        }
        return result;
    }
});


export const updatePersonalDataMethod = new ValidatedMethod({
    name: 'updatePersonalData',
    mixins: [MethodHooks],
    beforeHooks: [AuthGuard.isUserLogged],
    validate({user}) {
        check(user._id, String);
    },
    run({user}) {
        let responseMessage = new ResponseMessage();
        try {
            Meteor.users.update(user._id, {
                $set: {
                    username: user.usuario,
                    emails: [{
                        address: user.correo
                    }],
                    profile: {
                        perfil: user.perfil,
                        nombre: user.nombre,
                        updated_at: Utilities.currentLocalDate()
                    }
                }
            });
            responseMessage.create(true, "Se actualizó la información exitosamente");

        } catch (err) {
            console.error("Error updating user: ", err);
            throw new Meteor.Error("500", "Error al actualizar", err);
        }
        return responseMessage;
    }
});

