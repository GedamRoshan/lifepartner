import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: string;
  chatId: string;
}

interface ChatState {
  messages: Record<string, Message[]>; // chatId -> messages
  activeChatId: string | null;
}

const initialState: ChatState = {
  messages: {},
  activeChatId: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setActiveChat: (state, action: PayloadAction<string>) => {
      state.activeChatId = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      const { chatId } = action.payload;
      if (!state.messages[chatId]) {
        state.messages[chatId] = [];
      }
      state.messages[chatId].push(action.payload);
    },
    setMessages: (state, action: PayloadAction<{ chatId: string; messages: Message[] }>) => {
      state.messages[action.payload.chatId] = action.payload.messages;
    },
  },
});

export const { setActiveChat, addMessage, setMessages } = chatSlice.actions;

export default chatSlice.reducer;
