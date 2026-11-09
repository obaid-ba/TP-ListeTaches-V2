import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '../components/AppButton';
import StatsRow from '../components/StatsRow';
import { colors } from '../constants/theme';
import { useTasks } from '../context/TaskContext';

export default function ProfileScreen() {
  const { stats, refreshing, refresh } = useTasks();
  const completion =
    stats.total === 0 ? 0 : Math.round((stats.done / stats.total) * 100);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={40} color={colors.primary} />
        </View>
        <Text style={styles.title}>Mon profil</Text>
        <Text style={styles.subtitle}>{completion} % des tâches terminées</Text>
      </View>

      <StatsRow stats={stats} />

      <View style={styles.info}>
        <Ionicons name="cloud-done-outline" size={22} color={colors.primary} />
        <Text style={styles.infoText}>
          Vos tâches sont enregistrées en ligne sur Supabase et restent
          disponibles après la fermeture de l’application.
        </Text>
      </View>

      <AppButton
        title="Actualiser les tâches"
        icon="refresh"
        loading={refreshing}
        onPress={refresh}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
    gap: 20,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    gap: 6,
    marginTop: 16,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: 44,
    height: 88,
    justifyContent: 'center',
    width: 88,
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800',
    marginTop: 6,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 15,
  },
  info: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 14,
  },
  infoText: {
    color: colors.text,
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});
