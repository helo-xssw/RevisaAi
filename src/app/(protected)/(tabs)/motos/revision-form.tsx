import { Button } from '@/components/ui/Button';
import { TextInput } from '@/components/ui/TextInput';
import { useMotos } from '@/hooks/useMotos';
import { borderRadius, colors, spacing, typography } from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
    Alert,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// tipos auxiliares
type Mode = 'create' | 'edit';

type RevisionFormState = {
  type: string;
  service: string;
  date: string;
  time: string;
  km: string;
  autoReminderEnabled: boolean;
  autoReminderInterval: string;
};

// mock simples de "busca" de revisão por id (apenas para pré-preencher no modo edição)
const MOCK_EDIT_REVISION = {
  type: 'Troca',
  service: 'de Óleo',
  date: '24 de maio de 2026',
  time: '10:00',
  km: '20.500',
  autoReminderEnabled: true,
  autoReminderInterval: 'A cada três meses',
};

export default function RevisionFormScreen() {
  const navigation = useNavigation();
  const { motoId, mode, revisionId } = useLocalSearchParams<{
    motoId?: string;
    mode?: Mode;
    revisionId?: string;
  }>();

  const { motos } = useMotos();

  const isEdit: boolean = mode === 'edit';
  const moto = useMemo(
    () => motos.find((m) => m.id === motoId),
    [motos, motoId],
  );

  const [form, setForm] = useState<RevisionFormState>({
    type: '',
    service: '',
    date: '',
    time: '',
    km: '',
    autoReminderEnabled: false,
    autoReminderInterval: '',
  });

  const [saving, setSaving] = useState(false);

  // Ajusta título do header conforme o modo
  useEffect(() => {
    navigation.setOptions({
      title: isEdit ? 'Editar Revisão' : 'Adicionar Revisão',
    });
  }, [navigation, isEdit]);

  // Pré-preenche campos no modo edição (mock)
  useEffect(() => {
    if (isEdit && revisionId) {
      setForm(MOCK_EDIT_REVISION);
    }
  }, [isEdit, revisionId]);

  function updateField<K extends keyof RevisionFormState>(
    key: K,
    value: RevisionFormState[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleOpenSelect(field: 'type' | 'service' | 'autoReminderInterval') {
    // no futuro você pode abrir um modal/bottom sheet real;
    // por enquanto, só um Alert para indicar ação.
    Alert.alert(
      'Seleção não implementada',
      `Aqui você pode abrir um seletor para o campo "${field}".`,
    );
  }

  function handleSalvar() {
    // validações simples
    if (!form.type.trim()) {
      Alert.alert('Atenção', 'Selecione o tipo de revisão.');
      return;
    }
    if (!form.service.trim()) {
      Alert.alert('Atenção', 'Selecione o serviço.');
      return;
    }
    if (!form.date.trim() || !form.time.trim()) {
      Alert.alert('Atenção', 'Informe data e hora.');
      return;
    }
    if (!form.km.trim()) {
      Alert.alert('Atenção', 'Informe a quilometragem.');
      return;
    }

    setSaving(true);

    // simulação de request
    setTimeout(() => {
      setSaving(false);
      Alert.alert(
        'Sucesso',
        isEdit ? 'Revisão atualizada com sucesso.' : 'Revisão criada com sucesso.',
        [{ text: 'OK', onPress: () => navigation.goBack() }],
      );
    }, 600);
  }

  function handleExcluir() {
    Alert.alert(
      'Deseja excluir a revisão?',
      'Excluir a revisão não remove as decisões de manutenção já realizadas.',
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim',
          style: 'destructive',
          onPress: () => {
            // aqui você chamaria a API / contexto para remover
            navigation.goBack();
          },
        },
      ],
    );
  }

  return (
    <SafeAreaView
      style={styles.container}
      edges={['top', 'left', 'right']}
    >
      <View style={styles.content}>
        {moto && (
          <Text style={styles.subtitle}>
            {moto.name} • {moto.brand}
          </Text>
        )}

        {/* Tipo de Revisão */}
        {/* <SelectField
          label="Tipo de Revisão"
          placeholder="Tipo de Revisão"
          value={form.type}
          onPress={() => handleOpenSelect('type')}
        /> */}

        {/* Serviço */}
        {/* <SelectField
          label="Serviço"
          placeholder="Serviço"
          value={form.service}
          onPress={() => handleOpenSelect('service')}
        /> */}

        {/* Data e Hora */}
        <Text style={styles.label}>Data e Hora</Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.selectInput, styles.rowItem]}
            activeOpacity={0.7}
            onPress={() =>
              Alert.alert(
                'Seleção de data',
                'Aqui você pode abrir um date picker.',
              )
            }
          >
            <Ionicons
              name="calendar-outline"
              size={18}
              color={colors.textSecondary}
              style={{ marginRight: spacing.xs }}
            />
            <Text
              style={
                form.date
                  ? styles.selectTextValue
                  : styles.selectTextPlaceholder
              }
            >
              {form.date || 'Data'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.selectInput, styles.rowItem]}
            activeOpacity={0.7}
            onPress={() =>
              Alert.alert(
                'Seleção de hora',
                'Aqui você pode abrir um time picker.',
              )
            }
          >
            <Ionicons
              name="time-outline"
              size={18}
              color={colors.textSecondary}
              style={{ marginRight: spacing.xs }}
            />
            <Text
              style={
                form.time
                  ? styles.selectTextValue
                  : styles.selectTextPlaceholder
              }
            >
              {form.time || 'Hora'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Quilometragem */}
        <TextInput
          label="Quilometragem"
          value={form.km}
          onChangeText={(text) => updateField('km', text)}
          placeholder="Ex: 20.000"
          keyboardType="numeric"
        />

        {/* Lembrete Automático */}
        <View style={styles.switchRow}>
          <Text style={styles.label}>Lembrete Automático</Text>
          <Switch
            value={form.autoReminderEnabled}
            onValueChange={(value) =>
              updateField('autoReminderEnabled', value)
            }
            trackColor={{
              false: colors.borderLight,
              true: colors.primaryDisabled,
            }}
            thumbColor={
              form.autoReminderEnabled
                ? colors.primary
                : colors.background
            }
          />
        </View>

        <SelectField
          label=""
          placeholder="A cada três meses"
          value={form.autoReminderInterval}
          onPress={() => handleOpenSelect('autoReminderInterval')}
          disabled={!form.autoReminderEnabled}
        />

        {/* Botões */}
        <View style={styles.buttonsContainer}>
          {isEdit && (
            <Button
              variant="secondary"
              size="md"
              fullWidth
              onPress={handleExcluir}
            >
              Excluir
            </Button>
          )}

          <Button
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleSalvar}
            loading={saving}
            disabled={saving}
          >
            Salvar
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

/**
 * Campo visualmente igual a um "select", com seta para baixo,
 * usado para Tipo de Revisão, Serviço e Intervalo do Lembrete.
 */
type SelectFieldProps = {
  label?: string;
  placeholder: string;
  value: string;
  onPress: () => void;
  disabled?: boolean;
};

function SelectField({
  label,
  placeholder,
  value,
  onPress,
  disabled,
}: SelectFieldProps) {
  return (
    <View style={{ marginBottom: spacing.md }}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TouchableOpacity
        style={[
          styles.selectInput,
          disabled && styles.selectInputDisabled,
        ]}
        activeOpacity={0.7}
        onPress={!disabled ? onPress : undefined}
      >
        <Text
          style={
            value
              ? styles.selectTextValue
              : styles.selectTextPlaceholder
          }
        >
          {value || placeholder}
        </Text>
        <Ionicons
          name="chevron-down-outline"
          size={18}
          color={colors.textSecondary}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  subtitle: {
    fontFamily: typography.fontFamily.inter,
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.arimo,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  rowItem: {
    flex: 1,
  },
  selectInput: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectInputDisabled: {
    backgroundColor: colors.backgroundDisabled,
  },
  selectTextPlaceholder: {
    fontFamily: typography.fontFamily.inter,
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
  },
  selectTextValue: {
    fontFamily: typography.fontFamily.inter,
    fontSize: typography.fontSize.md,
    color: colors.textPrimary,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  buttonsContainer: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
});
