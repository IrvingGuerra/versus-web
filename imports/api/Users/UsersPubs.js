import {Meteor} from 'meteor/meteor';
import {PermissionMiddleware} from './../../middlewares/PermissionMiddleware';
import Permissions from "../../startup/server/Permissions";
import {StaticProfiles} from "../Profiles/Profile";

const usersPublication = new PublishEndpoint('users', function () {
    return Meteor.users.find({"profile.perfil": {$nin: [StaticProfiles.player.name]} });
});

usersPublication.use(new PermissionMiddleware([Permissions.USERS.LIST]));