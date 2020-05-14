import { Meteor } from 'meteor/meteor';
import {check} from "meteor/check";
import { Accounts } from 'meteor/accounts-base';
import { Email } from 'meteor/email';

const name = 'Scaffold Meteor+Vuetify';
const email = '<support@antware.mx>';
const from = `${ name } ${ email }`;

Accounts.emailTemplates.siteName = name;
Accounts.emailTemplates.from = from;
const emailTemplates = Accounts.emailTemplates;

// Reset Password
emailTemplates.resetPassword = {
	subject() {
		return `[${ name }] Restablece tu contraseña`;
	},
	text(user, url) {
		const userEmail = user.emails[0].address;
		if (Meteor.isDevelopment) console.info(`Password reset link: ${ url }`);
		return `Un reseteo de contraseña ha sido solicitado para la cuenta relacionada a esta dirección de correo:
     ${ userEmail }. Para resetear la contraseña, visita el siguinte link:
    \n\n${ url }\n\n Si no solicitaste este reseteo, por favor ignora este correo.`;
	},
};

// Enroll Account
emailTemplates.enrollAccount = {
	subject() {
		return `Bienvenido a ${ name }`;
	},
	text(user, url) {
		if (Meteor.isDevelopment) console.info(`Password reset link: ${ url }`);
		return `Enhorabuena, se ha creado tu cuenta para el sistema antware-meteor-vue. 
        Para establecer una contraseña, 
        visita el siguiente link: \n\n${ url }\n\n`;
	},
};

// Verify Email
emailTemplates.verifyEmail = {
	subject() {
		return `[${ name }] Restablece tu contraseña`;
	},
	text(user, url) {
		return `Hola ${ user }! Verifica tu correo siguiendo este link: ${ url }`;
	},
};

export default {
	sendEmail(to, subject, text) {
		check([to, subject, text], [String]);
		// Let other method calls from the same client start running, without
		// waiting for the email sending to complete.
		//this.unblock();

		Email.send({to, email, subject, text});
	},
};

//Activate the service of Mails.
if (Meteor.isDevelopment) {
	if (Meteor.settings.private && Meteor.settings.private.MAIL_URL) {
		process.env.MAIL_URL = Meteor.settings.private.MAIL_URL;
		process.env.ROOT_URL = Meteor.settings.private.ROOT_URL;
	} else {
		console.warn('[Scaffold Meteor + Vue] - Email settings are not configured. Emails will not be sent. ');
	}
}
