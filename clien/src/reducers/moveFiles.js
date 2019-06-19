const initialState = {
  currentFolder:{},
  list:[]
};

export const actionsTypes = {
  GET_FOLDER_LIST:"GET_FOLDER_LIST",
  RESPONSE_FOLDER_LIST: "RESPONSE_FOLDER_LIST",
}

export const actions = {
  select_folder: (folder_id) => ({
    type: actionsTypes.GET_FOLDER_LIST,
    folder_id
  })
}

export function reducer(state = initialState, action) {

  switch (action.type) {
    default:
      return state
  }
}