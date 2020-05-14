export class PermissionMiddleware extends PublishMiddleware {
    constructor(permissions) {
        super();
        this._permissions=permissions;
    }

    added(publish, collection, id, fields) {
        return super.added(...arguments);
    }

    changed(publish, collection, id, fields) {
        if(this.checkPermission(publish.userId)){
            return super.changed(...arguments);
        }
    }

    removed(publish, collection, id) {
        if(this.checkPermission(publish.userId)){
            return super.removed(...arguments);
        }
    }

    onReady(publish) {
        if(this.checkPermission(publish.userId)){
            return super.onReady(...arguments);
        }
    }

    onStop(publish) {
        return super.onStop(...arguments);
    }

    onError(publish, error) {
        return super.onError(...arguments);
    }

    checkPermission(idUser){
        const group = Roles.getGroupsForUser(idUser)[0];
        return  Roles.userIsInRole(idUser, this._permissions, group);
    }
}