import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {Message} from "./Message";
import {ResponseMessage} from "../../startup/server/BusinessClass/ResponseMessage";
import {Profile} from "../Profiles/Profile";

export const saveMessageMethod = new ValidatedMethod({
    name: 'saveMessage',
    validate:null,
    run(message) {
        const responseMessage=new ResponseMessage();
        try{
            Message.insert(message);
            responseMessage.create(true,"Se insertó el mensaje exitosamente");
        }catch (error) {
            console.error("Hubo error al insertar el mensaje",error)
            throw new Meteor.Error("500","Hubo error al insertar el mensaje",error);
        }
        return responseMessage;
    }
});

export const readMessagesMethod = new ValidatedMethod({
    name: 'readMessages',
    validate:null,
    run(messages) {
        const responseMessage=new ResponseMessage();
        try{
            messages.map(function (message) {
                if(message.idSender !== Meteor.userId()){
                    Message.update(message._id, {
                        $set: {
                            read: true,
                        }
                    });
                }
            });
            responseMessage.create(true,"Se actualizaron todos los mensajes exitosamente");
        }catch (error) {
            console.error("Hubo error al insertar el mensaje",error)
            throw new Meteor.Error("500","Hubo error al insertar el mensaje",error);
        }
        return responseMessage;
    }
});