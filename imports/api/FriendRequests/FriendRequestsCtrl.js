import {ValidatedMethod} from "meteor/mdg:validated-method";
import {check} from "meteor/check";
import {ResponseMessage} from "../../startup/server/BusinessClass/ResponseMessage";
import Utilities from "../../startup/server/Utilities";
import {FriendRequest} from './FriendRequest';
import {Meteor} from "meteor/meteor";
import {Message} from "../Messages/Message";

export const sendFriendRequestMethod = new ValidatedMethod({
    name: 'sendFriendRequest',
    validate(request) {
        check(request.idSender, String);
        check(request.idTargetPlayer, String);
    },
    run(request) {
        let responseMessage = new ResponseMessage();
        try {
            FriendRequest.insert({
                idSender: request.idSender,
                idTargetPlayer: request.idTargetPlayer,
                datetimeSend: Utilities.currentLocalDate(),
                accept: false,
            });
            responseMessage.create(true, "Invitacion de amistad enviada!");
        } catch (err) {
            console.error("Error creating user: ", err);
            throw new Meteor.Error("500", "Error al enviar la invitacion", err);
        }
        return responseMessage;
    }
});

export const answerFriendRequestMethod = new ValidatedMethod({
    name: 'answerFriendRequest',
    validate(idFriendRequest) {
        check(idFriendRequest, String);
    },
    run(idFriendRequest) {
        let responseMessage = new ResponseMessage();
        try {
            FriendRequest.update(idFriendRequest, {
                $set: {
                    accept: true,
                }
            });
            responseMessage.create(true, "Invitacion de amistad aceptada!");
        } catch (err) {
            console.error("Error creating user: ", err);
            throw new Meteor.Error("500", "Error al aceptar la invitacion", err);
        }
        return responseMessage;
    }
});