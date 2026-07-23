import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SubscriptionState {
  isPro: boolean;
  subscribedAt: string | null;
}

const initialState: SubscriptionState = {
  isPro: false,
  subscribedAt: null,
};

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    activatePro: (state) => {
      state.isPro = true;
      state.subscribedAt = new Date().toISOString();
    },
    cancelPro: (state) => {
      state.isPro = false;
      state.subscribedAt = null;
    },
  },
});

export const { activatePro, cancelPro } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
