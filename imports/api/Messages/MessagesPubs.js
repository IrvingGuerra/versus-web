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