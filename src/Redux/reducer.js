// reducer

const default_state = {
  data: [],
};

const main = (
  state = default_state,
  action
) => {
  switch (action.type) {
    case 'LOAD_INITIAL_DATA':
      return Object.assign({}, state, {
        data: action.data
      });
    default:
      return state;
  }
};

export default main;