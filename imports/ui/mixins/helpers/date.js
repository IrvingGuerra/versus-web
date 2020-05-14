export default {
	data() {
		return {
			currentDate: new Date(),
			monthNames: [
				'Enero',
				'Febrero',
				'Marzo',
				'Abril',
				'Mayo',
				'Junio',
				'Julio',
				'Agosto',
				'Septiembre',
				'Octubre',
				'Noviembre',
				'Diciembre'
			]
		};
	},
	methods: {

		/**
		 * Get current date with format: DIA XX de MES del AÑO
		 * @return {string}
		 */
		getCurrentDate() {
			const date = new Date();
			const weekday = this.$_.capitalize(date.toLocaleDateString('es-MX', {weekday: 'long'}));
			const month = date.toLocaleDateString('es-MX', {month: 'long'});

			return `${ weekday } ${ date.getDate() } de ${ month } del ${ date.getFullYear() }`;
		},

		getCurrentDateTime() {
			const date = new Date();
			const month = date.toLocaleDateString('es-MX', {month: 'short'});
			return `${ date.getDate() } ${ month } ${ date.getFullYear() } a las ${ date.getHours() }:${ date.getMinutes() }:${ date.getSeconds() }`;
		},
		currentLocalDate() {
			const date = new Date();
			const offsetMs = date.getTimezoneOffset() * 60 * 1000;
			const msLocal = date.getTime() - offsetMs;
			const dateLocal = new Date(msLocal);
			return dateLocal;
		},
		currentLocalISODate() {
			const date = new Date();
			const offsetMs = date.getTimezoneOffset() * 60 * 1000;
			const msLocal = date.getTime() - offsetMs;
			const dateLocal = new Date(msLocal);
			const iso = dateLocal.toISOString();
			const isoLocal = iso.substring(0, 10);
			return isoLocal;
		},
		currentStringTime() {
			const currentTime = this.currentLocalDate();
			const hours = currentTime.getUTCHours() < 10 ? '0' + currentTime.getUTCHours() : currentTime.getUTCHours();
			const minutes = currentTime.getUTCMinutes() < 10 ? '0' + currentTime.getUTCMinutes() : currentTime.getUTCMinutes();
			const seconds = currentTime.getUTCSeconds() < 10 ? '0' + currentTime.getUTCSeconds() : currentTime.getUTCSeconds();
			return hours + ':' + minutes + ':' + seconds;
		},
		analyzeReceiveSeismicAlert(dateLocalISOString) {
			const datimeSeismicAlert = new Date(dateLocalISOString);
			const currentTime = this.currentLocalDate();
			const oneMinuteAgo = this.currentLocalDate();
			oneMinuteAgo.setUTCMinutes(oneMinuteAgo.getUTCMinutes() - 1);
			let isOk = false;
			isOk = datimeSeismicAlert.getTime() >= oneMinuteAgo.getTime() && datimeSeismicAlert.getTime() <= currentTime.getTime();
			return isOk;
		}
	}
};
