import {Meteor} from 'meteor/meteor';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {Profile} from './Profile';
import AuthGuard from './../../middlewares/AuthGuard';
import {ResponseMessage} from '../../startup/server/BusinessClass/ResponseMessage';
import {check} from "meteor/check";
import ProfilesServ from "./ProfilesServ";

//Permisos
import Permissions from "../../startup/server/Permissions";

export const saveProfileMethod = new ValidatedMethod({
    name: 'saveProfile',
    mixins: [MethodHooks],
    permissions: [Permissions.PROFILES.CREATE, Permissions.PROFILES.UPDATE],
    beforeHooks: [AuthGuard.checkPermission],
    afterHooks: [],
    validate({profile}){
        check(profile.name, String);
        check(profile.description, String);
        check(profile.permissions, [String]);
    },
    /**
     * Crea un nuevo perfil de usuario. Si ya existe lo actualiza.
     * @param profile Información del perfil a crear.
     */
    run({profile}) {
        let responseMessage = new ResponseMessage();
        if (profile._id !== null) {//Si existe entonces lo actualiza
            check(profile._id, String);
            let users = ProfilesServ.getUsersByProfile(profile._id);
            try {
                Profile.update(profile._id, {
                    $set: {
                        name: profile.name,
                        description: profile.description,
                        permissions: profile.permissions
                    }
                });
                ProfilesServ.updateProfileUsers(users, profile);
                responseMessage.create(true, "Se actualizó el perfil exitosamente");
            } catch (err) {
                console.error("Error updating profile: ", err);
                throw new Meteor.Error("500", "Error al actualizar el perfil", err);
            }
        } else { //Sino entonces lo crea
            try {
                Profile.insert({
                    name: profile.name,
                    description: profile.description,
                    permissions: profile.permissions
                });
                responseMessage.create(true, "Se creó el perfil exitosamente");
            } catch (err) {
                console.error("Error updating profile: ", err);
                throw new Meteor.Error("500", "Error al crear el perfil", err);
            }
        }
        return responseMessage;
    }
});


export const deleteProfileMethod = new ValidatedMethod({
    name: 'deleteProfile',
    validate: null,
    mixins: [MethodHooks],
    permissions: [Permissions.PROFILES.DELETE],
    beforeHooks: [AuthGuard.checkPermission],
    /**
     * Elimina un perfil de la base de datos
     * @param idProfile Id del perfil a eliminar
     * @returns {any} Si es exitoso no regresa nada, de lo contrario regresa un mensaje de error.
     */
    run({idProfile}) {
        let responseMessage = new ResponseMessage();
        if (idProfile) {
            try {
                let users = ProfilesServ.getUsersByProfile(idProfile);
                if (users.length > 0) {
                    throw new Meteor.Error('500', "No se puede eliminar el perfil porque hay usuarios usandolo.");
                } else {
                    Profile.remove(idProfile);
                    responseMessage.create(true, "Perfil eliminado");
                }
            } catch (err) {
                throw new Meteor.Error("500", err.message);
            }
        } else {
            throw new Meteor.Error('500', "No se ha proporcionado un identificador de perfil");
        }
        return responseMessage;
    }
});
