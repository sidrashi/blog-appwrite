import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activePosts: [],
  allPosts: [],
  activePostsNeedsRefresh: false,
  allPostsNeedsRefresh: false
};

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setActivePosts: (state, action) => {
      state.activePosts = action.payload;
    },
    setAllPosts: (state, action) => {
      state.allPosts = action.payload;
    },
    setActivePostsNeedsRefresh: (state, action) => {
      state.activePostsNeedsRefresh = action.payload;
    },
    setAllPostsNeedsRefresh: (state, action) => {
      state.allPostsNeedsRefresh = action.payload;
    },
    clearPosts: (state) => {
      ((state.activePosts = []), (state.allPosts = []));
    },
  },
});

export const { setActivePosts, setAllPosts,setActivePostsNeedsRefresh, setAllPostsNeedsRefresh, clearPosts } = postSlice.actions;

export default postSlice.reducer;
