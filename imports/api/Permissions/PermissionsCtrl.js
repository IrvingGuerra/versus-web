import {Meteor} from "meteor/meteor";
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import AuthGuard from "../../middlewares/AuthGuard";
import {Profile} from "../Profiles/Profile";

//Permisos
import Permissions from "../../startup/server/Permissions";

export const listPermissionsMethod = new ValidatedMethod({
    name: 'listPermissions',
    mixins: [MethodHooks],
    permissions: [Permissions.PERMISSIONS.LIST],
    beforeHooks: [AuthGuard.checkPermission],
    validate: null,
    /**
     * Lista todos los permisos del sistema
     */
    run() {
        let permissions = [];
        permissions = Meteor.roles.find({}).fetch();
        return permissions;
    }
});

export const listProfilePermissionsMethod = new ValidatedMethod({
    name: 'listProfilePermissions',
    mixins: [MethodHooks],
    permissions: [Permissions.PERMISSIONS.LIST],
    beforeHooks: [AuthGuard.checkPermission],
    validate: null,
    /**
     * Lista los permisos asociados a un perfil
     * @param idProfile
     */
    run({idProfile}) {
        let permissions = [];
        if (idProfile) {
            let profile = Profile.findOne(idProfile);
            permissions = Meteor.roles.find({name: {$in: profile.permissions}}).fetch();
        }
        return permissions;
    }
});

export const listNotProfilePermissionsMethod = new ValidatedMethod({
    name: 'listNotProfilePermissions',
    mixins: [MethodHooks],
    permissions: [Permissions.PERMISSIONS.LIST],
    beforeHooks: [AuthGuard.checkPermission],
    validate: null,
    /**
     * Lista los permisos que no están asociados a un perfil
     * @param idProfile
     */
    run({idProfile}) {
        let permissions = [];
        if (idProfile) {
            let profile = Profile.findOne(idProfile);
            permissions = Meteor.roles.find({name: {$not: {$in: profile.permissions}}}).fetch();
        }
        return permissions;
    }
});