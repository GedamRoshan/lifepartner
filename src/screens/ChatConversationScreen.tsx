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
import { Send, Smile, Phone, MoreVertical, ChevronLeft, Crown, Plus, Mic, CheckCheck, User, ChevronRight, Heart } from 'lucide-react-native';
import { theme } from '../theme';
import { useAppSelector } from '../store/hooks';

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

export const ChatConversationScreen = ({ navigation, route }: any) => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const isPro = useAppSelector(state => state.subscription.isPro);

  const validateMessage = (text: string) => {
    const phoneRegex = /\b\d{10}\b/;
    const numericDensity = (text.match(/\d/g) || []).length / text.length;

    if (!isPro && phoneRegex.test(text)) {
      Alert.alert(
        '🔒 Pro Feature',
        'Sharing mobile numbers is a Pro feature. Upgrade to LifePartner Pro for ₹250/month to share your number directly in chat.',
        [
          { text: 'Not Now', style: 'cancel' },
          { text: 'Upgrade to Pro', style: 'default' },
        ],
      );
      return false;
    }

    if (!isPro && numericDensity > 0.6 && text.length > 5) {
      Alert.alert('Security Notice', 'Sending purely numeric messages is restricted for free users.');
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
    const hasHeart = item.id === '3'; // Just hardcoding the heart reaction for the mockup

    return (
      <View style={[styles.messageRow, isMe && styles.messageRowMe]}>
        {!isMe && (
          <View style={styles.messageAvatarContainer}>
            <User size={16} color={theme.colors.primary} />
          </View>
        )}
        <View style={styles.messageBubbleContainer}>
          <View style={[styles.messageBubble, isMe ? styles.myMessage : styles.otherMessage]}>
            <Text style={[styles.messageText, isMe && styles.myMessageText]}>
              {item.text}
            </Text>
            <View style={styles.timeRow}>
              <Text style={[styles.timestamp, isMe && styles.timestampMe]}>
                {item.timestamp}
              </Text>
              {isMe && <CheckCheck size={14} color="rgba(255,255,255,0.8)" style={styles.checkIcon} />}
            </View>
          </View>
          {hasHeart && (
            <View style={styles.reactionBadge}>
              <Heart size={10} color="#FF2D55" fill="#FF2D55" />
              <Text style={styles.reactionText}>1</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>

        <View style={styles.userInfo}>
          <View style={styles.headerAvatarContainer}>
            <User size={24} color={theme.colors.primary} />
          </View>
          <View>
            <Text style={styles.userName}>{route.params?.chatName || 'Connection Request'}</Text>
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

      {!isPro && (
        <View style={styles.proHint}>
          <Crown size={14} color="#B8860B" />
          <Text style={styles.proHintText}>
            Upgrade to Pro to share your phone number in chat
          </Text>
          <ChevronRight size={16} color="#B8860B" />
        </View>
      )}

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
          <TouchableOpacity style={styles.plusBtn}>
            <Plus size={24} color={theme.colors.primary} />
          </TouchableOpacity>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              placeholderTextColor={theme.colors.textMuted}
              value={inputText}
              onChangeText={setInputText}
              multiline
            />
            <TouchableOpacity style={styles.smileBtn}>
              <Smile size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>
          {inputText.trim() === '' ? (
            <TouchableOpacity style={styles.micBtn}>
              <Mic size={24} color={theme.colors.primary} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.sendButton}
              onPress={sendMessage}
              activeOpacity={0.85}
            >
              <Send size={20} color={theme.colors.white} />
            </TouchableOpacity>
          )}
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
  headerAvatarContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: 'rgba(156, 39, 176, 0.2)',
    backgroundColor: '#F3E8F7',
    justifyContent: 'center',
    alignItems: 'center',
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
  messageAvatarContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F3E8F7',
    borderWidth: 1,
    borderColor: 'rgba(156, 39, 176, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageBubbleContainer: {
    position: 'relative',
  },
  messageBubble: {
    maxWidth: 240,
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
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
    gap: 4,
  },
  timestamp: {
    fontFamily: theme.fonts.regular,
    fontSize: 10,
    color: theme.colors.textMuted,
  },
  timestampMe: {
    color: 'rgba(255,255,255,0.65)',
  },
  checkIcon: {
    marginLeft: 2,
  },
  reactionBadge: {
    position: 'absolute',
    bottom: -10,
    left: 10,
    backgroundColor: theme.colors.white,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  reactionText: {
    fontFamily: theme.fonts.medium,
    fontSize: 10,
    color: theme.colors.textSecondary,
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
  plusBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F3E8F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 22,
    paddingRight: 12,
  },
  input: {
    flex: 1,
    fontFamily: theme.fonts.regular,
    minHeight: 42,
    maxHeight: 100,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: theme.colors.text,
    fontSize: 15,
  },
  smileBtn: {
    padding: 4,
  },
  micBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
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
  proHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,215,0,0.10)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,215,0,0.25)',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  proHintText: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: '#B8860B',
    flex: 1,
  },
});
