import {Profile, StaticProfiles} from '../../api/Profiles/Profile';
import ProfilesServ from "../../api/Profiles/ProfilesServ";
import jsonHelper from '../../ui/mixins/helpers/json';

/**
 * Permissions used in the system
 * @type {string[]}
 */
const Permissions = {
    PERMISSIONS: {
        LIST: 'permissions-view'
    },
    USERS: {
        LIST: 'users-view',
        CREATE: 'users-create',
        UPDATE: 'users-edit',
        DELETE: 'users-delete'
    },
    PROFILES: {
        LIST: 'profiles-view',
        CREATE: 'profiles-create',
        UPDATE: 'profiles-edit',
        DELETE: 'profiles-delete'
    },
    CHAT: {
        LIST: 'messages-view',
        CREATE: 'messages-create'
    }
}

let permissionsArray = [];

permissionsArray=Object.keys(Permissions).reduce((accumulator, systemModule) => {
    return accumulator.concat(Object.values(Permissions[systemModule]))
}, []);

const currentRoles = Roles.getAllRoles().fetch();
permissionsArray.map(role => {
    if (!jsonHelper.methods.findObjectByValue(currentRoles, 'name', role)) {
        Roles.createRole(role);
    }
});

// console.log("Number of profiles: ",Profiles.find({}).count());

const profiles = Profile.find({}).fetch();
const adminProfile = jsonHelper.methods.findObjectByValue(profiles, 'name', StaticProfiles.admin.name);
if (adminProfile) {
    Profile.update({
        name: StaticProfiles.admin.name
    }, {
        $set: {
            permissions: permissionsArray
        }
    });
    ProfilesServ.updateProfileUsers(ProfilesServ.getUsersByProfile(adminProfile._id), adminProfile);
} else {
    Profile.insert({
        name: StaticProfiles.admin.name,
        description: StaticProfiles.admin.description,
        permissions: permissionsArray
    });
}
//Player
const playerProfile = jsonHelper.methods.findObjectByValue(profiles, 'name', StaticProfiles.player.name);
if (playerProfile) {
    Profile.update({
        name: StaticProfiles.player.name
    }, {
        $set: {
            permissions: permissionsArray
        }
    });
    ProfilesServ.updateProfileUsers(ProfilesServ.getUsersByProfile(playerProfile._id), playerProfile);
} else {
    Profile.insert({
        name: StaticProfiles.player.name,
        description: StaticProfiles.player.description,
        permissions: permissionsArray
    });
}



export default Permissions;