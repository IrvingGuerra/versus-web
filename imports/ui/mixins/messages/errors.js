export default {
    methods: {
        getErrorMessage(error) {
            let message = error.reason;
            if (error.reason === "Incorrect password") {
                message = "Contraseña incorrecta.";
            }
            return message;
        }
    }
}
