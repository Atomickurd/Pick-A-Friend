import React, { useEffect, useState, useRef } from 'react';
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
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { orderBy, limit } from 'firebase/firestore';
import { fsQuery, fsSet } from '../../services/firebase/firestore';
import { useUserStore } from '../../store/user';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import type { Message } from '../../types';

export default function ChatScreen() {
  const { channelId } = useLocalSearchParams<{ channelId: string }>();
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    if (!channelId) return;
    const unsub = fsQuery<Message>(
      `message_channels/${channelId}/messages`,
      [orderBy('createdAt', 'desc'), limit(100)],
      (items) => setMessages(items),
    );
    return unsub;
  }, [channelId]);

  async function handleSend() {
    if (!text.trim() || !user || !channelId) return;
    setSending(true);
    const msgId = `${Date.now()}`;
    const msg: Message = {
      id: msgId,
      channelId,
      senderUid: user.uid,
      type: 'text',
      text: text.trim(),
      imageURL: null,
      eventRef: null,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setText('');
    try {
      await fsSet(`message_channels/${channelId}/messages/${msgId}`, msg);
    } finally {
      setSending(false);
    }
  }

  const reversed = [...messages].reverse();

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={88}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.back}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Chat</Text>
        </View>

        {/* Messages */}
        <FlatList
          ref={listRef}
          data={reversed}
          keyExtractor={(m) => m.id}
          contentContainerStyle={styles.list}
          renderItem={({ item: msg }) => {
            const isMine = msg.senderUid === user?.uid;
            return (
              <View style={[styles.bubbleRow, isMine && styles.bubbleRowMine]}>
                <View style={[styles.bubble, isMine ? styles.bubbleMine : styles.bubbleOther]}>
                  <Text style={[styles.bubbleText, isMine && styles.bubbleTextMine]}>
                    {msg.text}
                  </Text>
                </View>
              </View>
            );
          }}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        />

        {/* Input */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Say woof..."
            placeholderTextColor={COLORS.textLight}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!text.trim() || sending) && styles.sendBtnDisabled]}
            onPress={handleSend}
            disabled={!text.trim() || sending}
          >
            <Text style={styles.sendIcon}>🐾</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  back: { fontSize: 28, color: COLORS.primary, fontWeight: '600' },
  title: { fontSize: 17, fontWeight: '700', color: COLORS.text },
  list: { padding: SPACING.md, gap: SPACING.sm },
  bubbleRow: { flexDirection: 'row' },
  bubbleRowMine: { justifyContent: 'flex-end' },
  bubble: {
    maxWidth: '72%',
    borderRadius: 18,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  bubbleMine: { backgroundColor: COLORS.primary },
  bubbleOther: { backgroundColor: COLORS.surface },
  bubbleText: { fontSize: 15, color: COLORS.text },
  bubbleTextMine: { color: '#fff' },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: SPACING.sm,
    padding: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  input: {
    flex: 1,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: 15,
    color: COLORS.text,
    maxHeight: 100,
    backgroundColor: COLORS.background,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: { opacity: 0.5 },
  sendIcon: { fontSize: 20 },
});
