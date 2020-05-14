const setPathAndTitle = (state, {path, title}) => {
	state.path = path;
	state.title = title;
};

const setId = (state, {_id}) => {
	state._id = _id;
};

const resetValues = (state) => {
	state.path = null;
	state.title = null;
};

export {
	setPathAndTitle,
	resetValues,
	setId
};
