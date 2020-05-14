const setUser = (state, user) => {
    state.user = user;
    state.isLogged = true;
    state.error = false;
    state.errorMessage = ''
};

const logout = (state) => {
    state.user = null;
    state.isLogged = false;
};

const authError = (state, error) => {

    if (error === 403) {
        state.errorMessage = 'Credenciales incorrectas';
    }

    state.error = true;
    state.user = null;
    state.isLogged = false;
};

export {
    setUser,
    logout,
    authError
}