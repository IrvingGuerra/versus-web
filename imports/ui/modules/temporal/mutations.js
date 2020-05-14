const setElement = (state, element) => {
    state.element = element;
};

const setStatus = (state, status) => {
    state.status = status;
};

const clearElement = (state) => {
    state.element = null;
    state.status = null;
};

export {
    setElement,
    setStatus,
    clearElement
}