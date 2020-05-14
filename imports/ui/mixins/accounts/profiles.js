import {Profile} from './../../../api/Profiles/Profile';

export default {
    meteor: {
        $subscribe: {
            'profiles': []
        },
        profiles() {
            return  Profile.find({}).fetch();
        }
    }
}