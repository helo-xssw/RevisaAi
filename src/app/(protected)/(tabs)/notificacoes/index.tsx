import { Notification } from '@/api/notifications';
import { useNotifications } from '@/hooks/useNotifications';
import { borderRadius, colors, spacing, typography } from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotificacoesScreen() {
  const {
    notifications,
    loading,
    error,
    markAsCompleted,
  } = useNotifications();

  function handlePress(notification: Notification) {
    if (notification.completed) return;

    Alert.alert(
      'Deseja marcar como concluída?',
      '',
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim',
          style: 'destructive',
          onPress: () => markAsCompleted(notification.id),
        },
      ],
    );
  }

  const isEmpty = !loading && notifications.length === 0;

  return (
    <SafeAreaView
      style={styles.container}
      edges={['top', 'left', 'right']}
    >
      <View style={styles.content}>
        {loading && (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.loadingText}>Carregando...</Text>
          </View>
        )}

        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}

        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => (
            <View style={{ height: spacing.sm }} />
          )}
          renderItem={({ item }) => (
            <NotificationItem
              notification={item}
              onPress={() => handlePress(item)}
            />
          )}
          ListEmptyComponent={
            isEmpty ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>
                  Nenhuma notificação
                </Text>
                <Text style={styles.emptyText}>
                  Você verá aqui avisos de revisões e serviços das suas
                  motos.
                </Text>
              </View>
            ) : null
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

type NotificationItemProps = {
  notification: Notification;
  onPress: () => void;
};

function NotificationItem({
  notification,
  onPress,
}: NotificationItemProps) {
  const { motoName, description, completed } = notification;
  return (
    <TouchableOpacity
      style={[
        styles.notificationCard,
        completed && styles.notificationCardCompleted,
      ]}
      activeOpacity={0.8}
      onPress={onPress}
      disabled={completed}
      accessibilityRole="button"
      accessibilityLabel={`${motoName}: ${description}${
        completed ? ' (concluída)' : ''
      }`}
    >
      <View style={styles.notificationLeft}>
        <Ionicons
          name="construct-outline"
          size={20}
          color={colors.textPrimary}
          style={styles.icon}
        />
        <Text
          style={[
            styles.notificationText,
            completed && styles.notificationTextCompleted,
          ]}
        >
          <Text style={styles.notificationMoto}>{motoName}</Text>
          <Text>: {description}</Text>
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const CARD_BORDER = 1.3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  listContent: {
    paddingBottom: spacing.lg,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  loadingText: {
    fontFamily: typography.fontFamily.inter,
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  errorText: {
    fontFamily: typography.fontFamily.inter,
    fontSize: typography.fontSize.sm,
    color: colors.textError,
    marginBottom: spacing.sm,
  },
  notificationCard: {
    borderRadius: borderRadius.lg,
    borderWidth: CARD_BORDER,
    borderColor: colors.borderLight,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background,
  },
  notificationCardCompleted: {
    backgroundColor: colors.backgroundPressed,
  },
  notificationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: spacing.sm,
  },
  notificationText: {
    flexShrink: 1,
    fontFamily: typography.fontFamily.inter,
    fontSize: typography.fontSize.md,
    color: colors.textPrimary,
  },
  notificationTextCompleted: {
    color: colors.textPrimary,
    
  },
  notificationMoto: {
    fontFamily: typography.fontFamily.arimo,
    fontWeight: typography.fontWeight.semibold,
  },
  emptyState: {
    marginTop: spacing.xl,
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  emptyTitle: {
    fontFamily: typography.fontFamily.arimo,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  emptyText: {
    fontFamily: typography.fontFamily.inter,
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
