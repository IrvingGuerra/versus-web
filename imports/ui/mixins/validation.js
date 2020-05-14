export default {
	methods: {
		validateState(ref) {
			let keys = ref.split('.');
			let result = null;
			if (keys.length === 2) {
				const scope = '$' + keys[0];
				const field = keys[1];
				if (this.veeFields[scope]) {
					if (this.veeFields[scope][field] && (this.veeFields[scope][field].dirty || this.veeFields[scope][field].validated)) {
						result = !this.errors.has(field, scope.substr(1)) ? 'valid' : 'invalid';
					}
				}
			} else if (keys.length === 1) {
				if (this.veeFields[ref] && (this.veeFields[ref].dirty || this.veeFields[ref].validated)) {
					result = !this.errors.has(ref) ? 'valid' : 'invalid';
				}
			}
			return result;
		},
		async isFormValid(scope = null) {
			let valid;
			if (scope) {
				valid = await this.$validator.validate(scope + '.*');
			} else {
				valid = await this.$validator.validateAll();
			}
			if (!valid) {
				this.$root.$emit('showNotification', {
					title: 'Error en el formulario',
					text: 'Por favor complete todos los campos obligatorios con valores válidos.'
				}, 'is-danger');
			}
			return valid;
		},
		/**
		 * Validación de un objeto json con ciertas reglas.
		 * @param object
		 * @param rules
		 * @returns {boolean}
		 */
		validateFields(object, rules) {

			let valid = true, found;

			// Check the object has all the mandatory fields
			rules.forEach((rule) => {
				if (rule.required && !object.hasOwnProperty(rule.field)) {
					valid = false;
					console.log(`Object does not have the mandatory field ${ rule.field }`);
				}
			});

			// Validate the field values, and remove extra fields.
			if (valid) {

				for (let key in object) {

					found = false;

					rules.some((rule) => {
						if (key === rule.field) {
							found = true;
							if (object[key] !== null && object[key] !== undefined  &&
								object[key].constructor === rule.type) {

								if (rule.type === Array) {
									object[key].some((item) => {
										return !(valid = this.validateFields(item, rule.itemRules));
									});
								} else if (rule.type === Object) {
									valid = this.validateFields(object, rule.itemRules);
								} else if (rule.type === String || rule.type === Number) {
									valid = true;
								}

							} else {
								valid = false;
							}
							//console.log('Field: ', rule.field, 'Value', object[key], 'valid', valid);
							return true;
						}
					});

					if (found === false) {
						delete object[key];
						//console.log(`An extra field has been removed: ${ key }`);
					} else if (valid === false) {
						break;
					}
				}
			}

			return valid;
		}
	}
};
