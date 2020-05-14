import Permissions from "../../startup/server/Permissions";
/**
 * Arreglo de opciones del sistema
 * @type {*[]}
 */
const systemOptions = [
	{
		icon: 'person',
		title: 'Usuarios',
		description: null,
		permission: Permissions.USERS.LIST,
		namePath: 'home.users'
	},
	{
		icon: 'user-tag',
		title: 'Perfiles',
		description: null,
		permission: Permissions.PROFILES.LIST,
		namePath: 'home.profiles'
	},
	{
		icon: 'chat',
		title: 'Chat',
		description: null,
		permission: Permissions.CHAT.LIST,
		namePath: 'home.chat'
	},
	{
		icon: 'person',
		title: 'Jugadores',
		description: null,
		namePath: 'home.players'
	}
];

/**
 * Verifica si un permiso se encuentra dentro del conjunto de perfiles
 * @param permission Permiso a evualuar
 * @param roles Conjunto de perfiles de permisos
 * @returns {boolean} true si el permiso se encuentra en alguno de los perfiles / false de lo contrario
 */
const verifyPermission = function(permission, roles) {
	if (typeof permission !== 'string') {
		console.error('Permission value is not valid', permission);
		return false;
	}
	if (!roles) {
		console.error('Roles value is not valid', roles);
		return false;
	}
	let profiles = Object.keys(roles);
	let hasPermission = false;
	for(let profile of profiles){
		for(let perm of roles[profile]){
			if (perm === permission) {
				hasPermission = true;
				break;
			}
		}
		if (hasPermission) {
			break;
		}
	}
	return hasPermission;

};

/**
 * Obtiene las opciones del sistema permitidas a un usuario
 * @param roles Perfiles/Permisos de un usuario
 * @returns {Array}
 */
const getSystemOptionsByUserRoles = function(roles) {
	let optionsForUser = [];
	if (roles) {
		systemOptions.forEach((option, index)=> {
			if (option.permission) {
				let hasPermission = verifyPermission(option.permission, roles);
				if (hasPermission) {
					optionsForUser.push(option);
				}
			} else {
				optionsForUser.push(option);
			}
		});
	}
	return optionsForUser;
};

export default {getSystemOptionsByUserRoles};
