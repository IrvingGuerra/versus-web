import {Meteor} from 'meteor/meteor';
import {StaticProfiles} from "../Profiles/Profile";

const playersPublication = new PublishEndpoint('players', function () {
    return Meteor.users.find({"profile.perfil": {$in: [StaticProfiles.player.name]} });
});