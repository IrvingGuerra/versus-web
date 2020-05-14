import {Meteor} from 'meteor/meteor';
import {Profile} from "./Profile";
import {ResponseMessage} from "../../startup/server/BusinessClass/ResponseMessage";
import {check} from "meteor/check";

export default {
    getUsersByProfile(idProfile) {
        let profile = Profile.findOne(idProfile);
        let filter = {};
        filter["roles." + profile.name] = {$exists: true};
        let users = Meteor.users.find(filter).fetch();
        return users;
    },
    updateProfileUsers(users, profile) {
        let filter = {};
        let permissionsProfile = {};
        permissionsProfile["roles." + profile.name] = profile.permissions;
        filter["roles." + profile.name] = {$exists: true};
        users.forEach((user) => {
            Meteor.users.update(user._id, {
                $set: permissionsProfile
            });
        });
    },
    validateProfileData(profile) {
        let responseMessage = new ResponseMessage();
        try {
            check(profile.name, String);
            check(profile.description, String);
            check(profile.permissions, [String]);
            responseMessage.create(true, "All data is correct");
        } catch (exception) {
            console.error("There was an error in user validation: ", exception);
            responseMessage.create(false, exception.message, null, exception);
        }
        return responseMessage;
    }
}