// Import server startup through a single index entry point

import './MailServ';
import './Utilities';
import './Permissions';
import '../../api/Users/User';
import '../../api/Users/UsersCtrl';
import '../../api/Users/UsersPubs';
import '../../api/Rest/UsersRest';

import '../../api/Permissions/PermissionsCtrl';
import '../../api/Permissions/PermissionsPubs';

import '../../api/Profiles/Profile';
import '../../api/Profiles/ProfilesServ';
import '../../api/Profiles/ProfilesCtrl';
import '../../api/Profiles/ProfilesPubs';

import '../../api/SystemOptions/SystemOption';
import '../../api/SystemOptions/SystemOptionsCtrl';

import '../../api/Messages/Message';
import '../../api/Messages/MessagesCtrl';
import '../../api/Messages/MessagesPubs';

import '../../api/Players/PlayersCtrl';
import '../../api/Players/PlayersPubs';
import '../../api/Rest/PlayersRest';

import '../../api/FriendRequests/FriendRequest';
import '../../api/FriendRequests/FriendRequestsCtrl';
import '../../api/FriendRequests/FriendRequestsPubs';
