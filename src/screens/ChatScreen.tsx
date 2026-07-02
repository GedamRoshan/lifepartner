import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from 'react-native';
import { Send, Smile, Phone, MoreVertical, ChevronLeft } from 'lucide-react-native';
import { theme } from '../theme';

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  timestamp: string;
}

const INITIAL_MESSAGES: Message[] = [
  { id: '0', text: 'Today', sender: 'other', timestamp: '' },
  { id: '1', text: 'Hey! I liked your profile. Your bio really stood out 😊', sender: 'other', timestamp: '10:00 AM' },
  { id: '2', text: 'Thank you! Yours is great too. What do you enjoy doing on weekends?', sender: 'me', timestamp: '10:02 AM' },
  { id: '3', text: 'I love exploring new cafes and going for morning runs!', sender: 'other', timestamp: '10:05 AM' },
];

export const ChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');

  const validateMessage = (text: string) => {
    const phoneRegex = /\b\d{10}\b/;
    const numericDensity = (text.match(/\d/g) || []).length / text.length;

    if (phoneRegex.test(text)) {
      Alert.alert('Security Notice', 'Sharing mobile numbers is not allowed for your security.');
      return false;
    }

    if (numericDensity > 0.6 && text.length > 5) {
      Alert.alert('Security Notice', 'Sending purely numeric messages is restricted.');
      return false;
    }

    return true;
  };

  const sendMessage = () => {
    if (inputText.trim() === '') return;
    if (!validateMessage(inputText)) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'me',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
  };

  const renderMessage = ({ item }: { item: Message }) => {
    if (item.id === '0' || (item.text === 'Today' && !item.timestamp)) {
      return (
        <View style={styles.dateSeparator}>
          <View style={styles.dateLine} />
          <Text style={styles.dateText}>Today</Text>
          <View style={styles.dateLine} />
        </View>
      );
    }

    const isMe = item.sender === 'me';

    return (
      <View style={[styles.messageRow, isMe && styles.messageRowMe]}>
        {!isMe && (
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330' }}
            style={styles.messageAvatar}
          />
        )}
        <View style={[styles.messageBubble, isMe ? styles.myMessage : styles.otherMessage]}>
          <Text style={[styles.messageText, isMe && styles.myMessageText]}>
            {item.text}
          </Text>
          <Text style={[styles.timestamp, isMe && styles.timestampMe]}>
            {item.timestamp}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn}>
          <ChevronLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>

        <View style={styles.userInfo}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330' }}
            style={styles.headerAvatar}
          />
          <View>
            <Text style={styles.userName}>Ananya Sharma</Text>
            <View style={styles.onlineRow}>
              <View style={styles.onlineDot} />
              <Text style={styles.userStatus}>Online</Text>
            </View>
          </View>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerIconBtn}>
            <Phone size={20} color={theme.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIconBtn}>
            <MoreVertical size={20} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messageList}
        showsVerticalScrollIndicator={false}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.emojiBtn}>
            <Smile size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor={theme.colors.textMuted}
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendButton, inputText.trim() === '' && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={inputText.trim() === ''}
            activeOpacity={0.85}
          >
            <Send size={20} color={theme.colors.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundSoft,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backBtn: {
    padding: 6,
    marginRight: 4,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: theme.colors.primaryMuted,
  },
  userName: {
    fontFamily: theme.fonts.bold,
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
  },
  onlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: theme.colors.success,
  },
  userStatus: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: theme.colors.success,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 4,
  },
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageList: {
    padding: 16,
    paddingBottom: 8,
  },
  dateSeparator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    gap: 12,
  },
  dateLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
  },
  dateText: {
    fontFamily: theme.fonts.medium,
    fontSize: 12,
    color: theme.colors.textMuted,
    fontWeight: '600',
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 10,
    gap: 8,
  },
  messageRowMe: {
    justifyContent: 'flex-end',
  },
  messageAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  messageBubble: {
    maxWidth: '78%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
  },
  myMessage: {
    backgroundColor: theme.colors.chatMine,
    borderBottomRightRadius: 6,
  },
  otherMessage: {
    backgroundColor: theme.colors.chatOther,
    borderBottomLeftRadius: 6,
  },
  messageText: {
    fontFamily: theme.fonts.regular,
    fontSize: 15,
    lineHeight: 21,
    color: theme.colors.text,
  },
  myMessageText: {
    color: theme.colors.white,
  },
  timestamp: {
    fontFamily: theme.fonts.regular,
    fontSize: 10,
    color: theme.colors.textMuted,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  timestampMe: {
    color: 'rgba(255,255,255,0.65)',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    paddingBottom: Platform.OS === 'ios' ? 8 : 12,
    backgroundColor: theme.colors.white,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    gap: 8,
  },
  emojiBtn: {
    padding: 8,
    marginBottom: 2,
  },
  input: {
    flex: 1,
    fontFamily: theme.fonts.regular,
    minHeight: 42,
    maxHeight: 100,
    backgroundColor: theme.colors.surface,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: theme.colors.text,
    fontSize: 15,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 1,
    ...theme.shadows.sm,
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
});
