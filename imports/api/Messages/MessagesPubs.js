import {Message} from "./Message";

const messagesPublication = new PublishEndpoint('messages', function (idContact = null) {
    const idUserlogged = this.userId;
    return Message.find({
        $or: [{idSender: idUserlogged, idReceiver: idContact},
            {idSender: idContact, idReceiver: idUserlogged}],
    }, {
        limit: 20,
        sort: {
            date: -1
        }
    });
});

const msnPublication = new PublishEndpoint('messagesPlayers', function (idA = null, idB = null) {
    return Message.find({
        $or: [{idSender: idA, idReceiver: idB},
            {idSender: idB, idReceiver: idA}],
    }, {
        limit: 20,
        sort: {
            date: -1
        }
    });
});
