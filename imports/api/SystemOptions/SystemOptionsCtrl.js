import {Meteor} from 'meteor/meteor';
import SystemOptions from './SystemOption';
import {ValidatedMethod} from 'meteor/mdg:validated-method';

/**
 * Regresa las opciones del sistema asociadas a un usuario dependiendo de sus permisos.
 */
export const getSystemOptionsMethod = new ValidatedMethod({
    name: 'getSystemOptions',
    validate: null,
    run() {
        let data = {};
        if (this.userId) {
            let userLogged = Meteor.users.findOne(this.userId);
            data = SystemOptions.getSystemOptionsByUserRoles(userLogged.roles);
        } else {
            data = [];
        }
        return data;
    }
});