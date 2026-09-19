import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  comments: [],
  currentComment: null,
  loading: false
}


const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    setComments: (state, action) => {
      state.comments = action.payload;
    },

    setCurrentComment: (state, action) => {
      state.currentComment = action.payload;
    },

    addComment: (state, action) => {
      state.comments.unshift(action.payload);
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    clearComment: (state, action) => {
      state.comments = [];
    },

    clearCurrentComment: (state, action) => {
      state.currentComment = null;
    }
  }
});

export const { setComments, setCurrentComment, clearCurrentComment, clearComment, setLoading } = commentSlice.actions;

export default commentSlice.reducer;