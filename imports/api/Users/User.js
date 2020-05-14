import { Meteor } from 'meteor/meteor';

Meteor.users.allow({
    insert: () => false,
    update: () => false,
    remove: () => false
});

Meteor.users.deny({
    insert: () => true,
    update: () => true,
    remove: () => true
});

/*const User = new Mongo.Collection('user');

export default User;
*/
