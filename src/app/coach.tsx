/**
 * Coach — the chat interface. A conversational nutrition assistant grounded in
 * the day's real totals from the store. Backend is out of scope: replies come
 * from a small local rules engine that reads the current day's nutrients, so the
 * conversation still reacts to what the user has logged. Suggested prompts seed
 * the conversation; messages stream into a scrolling thread with a composer.
 */
import React, { useMemo, useRef, useState, useEffect } from 'react';
import { View, ScrollView, Pressable, Platform } from 'react-native';
import { useTheme, MACRO_ORDER, MACRO_LABEL } from '@/theme';
import { Screen } from '@/components/layout';
import { useResponsive } from '@/theme';
import { Card, Text, Icon, Input, IconButton, Badge } from '@/components/ui';
import { BrandMark } from '@/components/layout';
import { useStore } from '@/data/store';
import { targetState, pct } from '@/data/nutrition';
import type { Nutrients, Targets } from '@/data/types';

interface Message {
  id: string;
  role: 'user' | 'coach';
  text: string;
  chips?: string[];
}

const SUGGESTIONS = [
  'How am I doing today?',
  'What should I eat next?',
  'Am I getting enough protein?',
  'Help me cut sodium',
];

/** Local rules engine — turns the day's numbers into a grounded reply. */
function coachReply(input: string, totals: Nutrients, targets: Targets): Message {
  const q = input.toLowerCase();
  const id = `c_${Date.now()}`;

  const proteinGap = Math.round(targets.protein - totals.protein);
  const calGap = Math.round(targets.kcal - totals.kcal);
  const sodiumOver = totals.sodium > targets.sodiumLimit;

  if (q.includes('protein')) {
    return {
      id,
      role: 'coach',
      text:
        proteinGap > 5
          ? `You're at ${Math.round(totals.protein)}g of ${targets.protein}g protein — about ${proteinGap}g short. Greek yogurt (17g), a chicken breast (37g), or edamame (18g) would close it.`
          : `You're at ${Math.round(totals.protein)}g of ${targets.protein}g — protein is on track today. Nicely done.`,
      chips: proteinGap > 5 ? ['Greek yogurt +17g', 'Chicken breast +37g', 'Edamame +18g'] : undefined,
    };
  }
  if (q.includes('sodium') || q.includes('salt')) {
    return {
      id,
      role: 'coach',
      text: sodiumOver
        ? `You're at ${(totals.sodium / 1000).toFixed(1)}g sodium, over your ${(targets.sodiumLimit / 1000).toFixed(1)}g limit. The biggest levers are processed items — sandwiches, canned soup, and pizza. Swapping one for a fresh option tomorrow helps most.`
        : `Sodium's at ${(totals.sodium / 1000).toFixed(1)}g, under your ${(targets.sodiumLimit / 1000).toFixed(1)}g limit. You've got room — just watch restaurant meals tonight.`,
    };
  }
  if (q.includes('next') || q.includes('eat') || q.includes('dinner') || q.includes('snack')) {
    const worst = MACRO_ORDER.map((k) => ({ k, gap: targets[k] - (totals as any)[k] })).sort((a, b) => b.gap - a.gap)[0];
    return {
      id,
      role: 'coach',
      text:
        calGap > 200
          ? `You have about ${calGap} kcal left. Your biggest gap is ${MACRO_LABEL[worst.k].toLowerCase()} (${Math.round(worst.gap)}g). A balanced plate — a lean protein, a whole grain, and vegetables — fits well here.`
          : `You're close to your calorie goal (${calGap > 0 ? `${calGap} left` : `${-calGap} over`}). A light, protein-forward snack is the safe call if you're hungry.`,
      chips: ['Salmon + quinoa', 'Tofu stir-fry', 'Greek yogurt + berries'],
    };
  }
  // default: status summary
  const calState = targetState(totals.kcal, targets.kcal);
  return {
    id,
    role: 'coach',
    text: `Here's today: ${totals.kcal.toLocaleString()} kcal (${pct(totals.kcal, targets.kcal)}% of goal), ${Math.round(
      totals.protein,
    )}g protein, ${Math.round(totals.carbs)}g carbs, ${Math.round(totals.fat)}g fat. ${
      calState === 'under' ? 'You have room left for the day.' : calState === 'over' ? 'You’re a touch over — an easy dinner keeps it close.' : 'Right on track.'
    }`,
    chips: ['What should I eat next?', 'Am I getting enough protein?'],
  };
}

export default function CoachScreen() {
  const { theme, space, radius, font } = useTheme();
  const { isPhone } = useResponsive();
  const { today, totalsFor, targets } = useStore();
  const totals = totalsFor(today);

  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: 'welcome',
      role: 'coach',
      text: `Hi — I'm your Lovage coach. I can see today's log: ${totals.kcal.toLocaleString()} kcal so far. Ask me anything, or tap a suggestion below.`,
    },
  ]);
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const t = setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 60);
    return () => clearTimeout(t);
  }, [messages, typing]);

  const send = (text: string) => {
    const clean = text.trim();
    if (!clean) return;
    const userMsg: Message = { id: `u_${Date.now()}`, role: 'user', text: clean };
    setMessages((prev) => [...prev, userMsg]);
    setDraft('');
    setTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, coachReply(clean, totals, targets)]);
      setTyping(false);
    }, 650);
  };

  const dayChip = (
    <View style={{ flexDirection: 'row', gap: space.xs, flexWrap: 'wrap' }}>
      <Badge label={`${totals.kcal.toLocaleString()} kcal`} icon="flame" tint={theme.color.surfaceSunken} ink={theme.color.textSecondary} />
      {MACRO_ORDER.map((k) => (
        <Badge
          key={k}
          label={`${Math.round((totals as any)[k])}g ${MACRO_LABEL[k].toLowerCase()}`}
          tint={theme.color.macro[k].tint}
          ink={theme.color.macro[k].base}
        />
      ))}
    </View>
  );

  return (
    <Screen title="Coach" subtitle="Grounded in what you’ve logged today" toolbar={dayChip} scroll={false}>
      <Card padding="none" style={{ flex: 1, overflow: 'hidden', maxHeight: isPhone ? undefined : 640 }}>
        {/* Thread */}
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: space.lg, gap: space.md }}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((m) => (
            <MessageBubble key={m.id} message={m} onChip={send} />
          ))}
          {typing && <TypingBubble />}
        </ScrollView>

        {/* Suggestions */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: space.sm, paddingHorizontal: space.lg, paddingBottom: space.sm }}
        >
          {SUGGESTIONS.map((s) => (
            <Pressable
              key={s}
              onPress={() => send(s)}
              style={({ pressed }) => ({
                paddingVertical: space.sm,
                paddingHorizontal: space.md,
                borderRadius: radius.pill,
                borderWidth: 1,
                borderColor: theme.color.border,
                backgroundColor: pressed ? theme.color.surfaceSunken : theme.color.surface,
                ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
              })}
            >
              <Text variant="caption" style={{ color: theme.color.brand, fontFamily: font.bodyMedium }}>
                {s}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Composer */}
        <View
          style={{
            flexDirection: 'row',
            gap: space.sm,
            padding: space.md,
            borderTopWidth: 1,
            borderTopColor: theme.color.divider,
            alignItems: 'center',
          }}
        >
          <View style={{ flex: 1 }}>
            <Input
              id="coach-input"
              value={draft}
              onChangeText={setDraft}
              placeholder="Ask about today’s intake…"
              rightSlot={null}
            />
          </View>
          <IconButton name="send" size={48} tone="brand" accessibilityLabel="Send message" onPress={() => send(draft)} />
        </View>
      </Card>
    </Screen>
  );
}

function MessageBubble({ message, onChip }: { message: Message; onChip: (t: string) => void }) {
  const { theme, space, radius, font } = useTheme();
  const isUser = message.role === 'user';

  return (
    <View style={{ flexDirection: 'row', gap: space.sm, alignSelf: isUser ? 'flex-end' : 'flex-start', maxWidth: '86%' }}>
      {!isUser && (
        <View
          style={{
            width: 30,
            height: 30,
            borderRadius: radius.pill,
            backgroundColor: theme.color.brand,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 2,
          }}
        >
          <Icon name="leaf" size={16} color={theme.color.onBrand} />
        </View>
      )}
      <View style={{ gap: space.sm, flexShrink: 1 }}>
        <View
          style={{
            paddingVertical: space.sm,
            paddingHorizontal: space.md,
            borderRadius: radius.lg,
            borderTopLeftRadius: isUser ? radius.lg : radius.xs,
            borderTopRightRadius: isUser ? radius.xs : radius.lg,
            backgroundColor: isUser ? theme.color.brand : theme.color.surfaceSunken,
          }}
        >
          <Text
            variant="footnote"
            style={{ color: isUser ? theme.color.onBrand : theme.color.text, lineHeight: 21 }}
          >
            {message.text}
          </Text>
        </View>
        {message.chips && (
          <View style={{ flexDirection: 'row', gap: space.xs, flexWrap: 'wrap' }}>
            {message.chips.map((c) => (
              <Pressable
                key={c}
                onPress={() => onChip(c)}
                style={({ pressed }) => ({
                  paddingVertical: 5,
                  paddingHorizontal: space.sm,
                  borderRadius: radius.pill,
                  backgroundColor: pressed ? theme.color.brandTint : theme.color.surface,
                  borderWidth: 1,
                  borderColor: theme.color.border,
                  ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
                })}
              >
                <Text variant="caption" style={{ color: theme.color.textSecondary, fontFamily: font.bodyMedium }}>
                  {c}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

function TypingBubble() {
  const { theme, space, radius } = useTheme();
  return (
    <View style={{ flexDirection: 'row', gap: space.sm, alignSelf: 'flex-start' }}>
      <View
        style={{
          width: 30,
          height: 30,
          borderRadius: radius.pill,
          backgroundColor: theme.color.brand,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon name="leaf" size={16} color={theme.color.onBrand} />
      </View>
      <View
        style={{
          flexDirection: 'row',
          gap: 4,
          paddingVertical: space.md,
          paddingHorizontal: space.md,
          borderRadius: radius.lg,
          borderTopLeftRadius: radius.xs,
          backgroundColor: theme.color.surfaceSunken,
          alignItems: 'center',
        }}
      >
        {[0, 1, 2].map((i) => (
          <View key={i} style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: theme.color.textMuted }} />
        ))}
      </View>
    </View>
  );
}
