import {FriendRequest} from "./FriendRequest";
import {StaticProfiles} from "../Profiles/Profile";

const friendRequestPublication = new PublishEndpoint('friendRequest', function (userId) {
    console.log(userId);
    return FriendRequest.find({"idTargetPlayer": {$in: [userId]} });
});