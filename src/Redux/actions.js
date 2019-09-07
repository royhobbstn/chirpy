export function loadInitialData(data) {
  return {
    type: "LOAD_INITIAL_DATA",
    data
  };
}

export function clearData() {
  return {
    type: "CLEAR_DATA"
  };
}
