import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Profile {
  id: string;
  name: string;
  age: number;
  profession: string;
  religion: string;
  bio: string;
  location: string;
  image: string;
  isVerified: boolean;
}

interface ProfileState {
  profiles: Profile[];
  likedProfiles: string[];
  dislikedProfiles: string[];
  matches: string[];
}

const initialState: ProfileState = {
  profiles: [],
  likedProfiles: [],
  dislikedProfiles: [],
  matches: [],
};

const profileSlice = createSlice({
  name: 'profiles',
  initialState,
  reducers: {
    setProfiles: (state, action: PayloadAction<Profile[]>) => {
      state.profiles = action.payload;
    },
    likeProfile: (state, action: PayloadAction<string>) => {
      if (!state.likedProfiles.includes(action.payload)) {
        state.likedProfiles.push(action.payload);
      }
    },
    dislikeProfile: (state, action: PayloadAction<string>) => {
      if (!state.dislikedProfiles.includes(action.payload)) {
        state.dislikedProfiles.push(action.payload);
      }
    },
    addMatch: (state, action: PayloadAction<string>) => {
      if (!state.matches.includes(action.payload)) {
        state.matches.push(action.payload);
      }
    },
  },
});

export const { 
  setProfiles, 
  likeProfile, 
  dislikeProfile, 
  addMatch 
} = profileSlice.actions;

export default profileSlice.reducer;
