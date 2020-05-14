import {Meteor} from 'meteor/meteor';
import {Profile, StaticProfiles} from './Profile';
import {PermissionMiddleware} from "../../middlewares/PermissionMiddleware";
import Permissions from "../../startup/server/Permissions";

const profilesPublication=new PublishEndpoint('profiles',function () {
    return Profile.find({name: {$nin: [StaticProfiles.admin.name, StaticProfiles.player.name]} });
});

profilesPublication.use(new PermissionMiddleware([Permissions.PROFILES.LIST]));

const allProfilesPublication=new PublishEndpoint('allProfiles',function () {
    return Profile.find({});
});