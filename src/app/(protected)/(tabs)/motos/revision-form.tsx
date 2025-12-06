import { CreateRevisionInput } from '@/api/revisions';
import { Button } from '@/components/ui/Button';
import TextInput from '@/components/ui/TextInput';
import { useMotos } from '@/hooks/useMotos';
import { useNotifications } from '@/hooks/useNotifications';
import { useRevisions } from '@/hooks/useRevisions';
import { borderRadius, colors, spacing, typography } from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  Platform,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// tipos auxiliares
type Mode = 'create' | 'edit';

type RevisionFormState = {
  type: string;
  service: string;
  dateISO: string; // armazenando data como ISO real
  timeISO: string; // armazenando hora como ISO real
  km: string;
  autoReminderEnabled: boolean;
  autoReminderInterval: string;
};

type PickerField = 'type' | 'service' | 'autoReminderInterval';

// opções mockadas de selects
const TYPE_OPTIONS = ['Troca', 'Revisão Geral', 'Troca de Kit'];
const SERVICE_OPTIONS = [
  'Troca de óleo',
  'Revisão completa',
  'Troca de kit relação',
];

const REMINDER_OPTIONS = [
  'Uma semana',
  'Duas semanas',
  'Um mês',
  'Três meses',
  'Seis meses',
];

export default function RevisionFormScreen() {
  const navigation = useNavigation();
  const { motoId, mode, revisionId } = useLocalSearchParams<{
    motoId?: string;
    mode?: Mode;
    revisionId?: string;
  }>();

  const { motos } = useMotos();
  const { getById, create, update, remove } = useRevisions();
  const { create: createNotification, removeByRevisionId } = useNotifications();

  const isEdit: boolean = mode === 'edit';
  const moto = useMemo(
    () => motos.find((m) => m.id === motoId),
    [motos, motoId],
  );

  const revision = useMemo(
    () => getById(revisionId),
    [getById, revisionId],
  );

  const [form, setForm] = useState<RevisionFormState>({
    type: '',
    service: '',
    dateISO: '',
    timeISO: '',
    km: '',
    autoReminderEnabled: false,
    autoReminderInterval: '',
  });

  const [saving, setSaving] = useState(false);

  // Controle do DateTimePicker
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [timePickerVisible, setTimePickerVisible] = useState(false);

  // Controle do modal de opções
  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerField, setPickerField] = useState<PickerField | null>(null);

  // Ajusta título do header conforme o modo
  useEffect(() => {
    navigation.setOptions({
      title: isEdit ? 'Editar Revisão' : 'Adicionar Revisão',
    });
  }, [navigation, isEdit]);

  // Pré-preenche campos no modo edição (dados reais do contexto)
  useEffect(() => {
    if (isEdit && revision) {
      setForm({
        type: revision.title,
        service: revision.service,
        dateISO: revision.date,
        timeISO: revision.time,
        km: revision.km ? revision.km.toString() : '',
        autoReminderEnabled: revision.autoReminderEnabled,
        autoReminderInterval: revision.autoReminderInterval ?? '',
      });
    }
  }, [isEdit, revision]);

  function updateField<K extends keyof RevisionFormState>(
    key: K,
    value: RevisionFormState[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function openPicker(field: PickerField) {
    if (field === 'autoReminderInterval' && !form.autoReminderEnabled) return;
    setPickerField(field);
    setPickerVisible(true);
  }

  function closePicker() {
    setPickerVisible(false);
    setPickerField(null);
  }

  function openDate() {
    setDatePickerVisible(true);
  }

  function openTime() {
    setTimePickerVisible(true);
  }

  // Handlers do DateTimePicker
  function onDateSelected(e: DateTimePickerEvent, selected?: Date) {
    setDatePickerVisible(false);
    if (!selected) return;

    const iso = selected.toISOString();
    updateField('dateISO', iso);
  }

  function onTimeSelected(e: DateTimePickerEvent, selected?: Date) {
    setTimePickerVisible(false);
    if (!selected) return;

    const iso = selected.toISOString();
    updateField('timeISO', iso);
  }

  const pickerTitle =
    pickerField === 'type'
      ? 'Tipo de Revisão'
      : pickerField === 'service'
      ? 'Serviço'
      : 'Lembrete Automático';

  const pickerOptions =
    pickerField === 'type'
      ? TYPE_OPTIONS
      : pickerField === 'service'
      ? SERVICE_OPTIONS
      : REMINDER_OPTIONS;

  const pickerSelectedValue =
    pickerField === 'type'
      ? form.type
      : pickerField === 'service'
      ? form.service
      : form.autoReminderInterval;

  async function handleSalvar() {
    if (!isEdit && !form.type.trim()) {
      Alert.alert('Atenção', 'Selecione o tipo de revisão.');
      return;
    }
    if (!isEdit && !form.service.trim()) {
      Alert.alert('Atenção', 'Selecione o serviço.');
      return;
    }
    if (!form.dateISO) {
      Alert.alert('Atenção', 'Selecione a data.');
      return;
    }
    if (!form.timeISO) {
      Alert.alert('Atenção', 'Selecione a hora.');
      return;
    }
    if (!form.km.trim()) {
      Alert.alert('Atenção', 'Informe a quilometragem.');
      return;
    }

    if (!motoId) {
      Alert.alert('Erro', 'Moto não encontrada.');
      return;
    }

    const kmNumber = Number(form.km.replace(/\./g, '').replace(',', '.'));

    setSaving(true);

    try {
      if (isEdit && revisionId) {
        await update(revisionId, {
          date: form.dateISO,
          time: form.timeISO,
          km: isNaN(kmNumber) ? undefined : kmNumber,
          autoReminderEnabled: form.autoReminderEnabled,
          autoReminderInterval: form.autoReminderInterval || undefined,
        });
      } else {
        const input: CreateRevisionInput = {
          motoId,
          title: form.type.trim(),
          service: form.service.trim(),
          details: '',
          date: form.dateISO,
          time: form.timeISO,
          km: isNaN(kmNumber) ? undefined : kmNumber,
          autoReminderEnabled: form.autoReminderEnabled,
          autoReminderInterval: form.autoReminderInterval || undefined,
        };

        const created = await create(input);

        // Cria notificação automaticamente ao criar revisão
        if (moto) {
          await createNotification({
            motoId: motoId!,
            revisionId: created.id,
            title: `${moto.name}: ${created.title}`,
            description: created.service,
          });
        }
      }

      Alert.alert(
        'Sucesso',
        isEdit ? 'Revisão atualizada.' : 'Revisão criada.',
        [{ text: 'OK', onPress: () => navigation.goBack() }],
      );
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível salvar a revisão.');
    } finally {
      setSaving(false);
    }
  }

  function handleExcluir() {
    if (!revisionId) return;

    Alert.alert('Deseja excluir a revisão?', '', [
      { text: 'Não', style: 'cancel' },
      {
        text: 'Sim',
        style: 'destructive',
        onPress: async () => {
          try {
            await remove(revisionId);
            await removeByRevisionId(revisionId);
            navigation.goBack();
          } catch {
            Alert.alert('Erro', 'Não foi possível excluir.');
          }
        },
      },
    ]);
  }

  const dateLabel = form.dateISO
    ? new Date(form.dateISO).toLocaleDateString('pt-BR')
    : 'Data';

  const timeLabel = form.timeISO
    ? new Date(form.timeISO).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Hora';

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.content}>
        {moto && (
          <Text style={styles.subtitle}>
            {moto.name} • {moto.brand}
          </Text>
        )}

        {/* Tipo de Revisão - apenas no modo criação */}
        {!isEdit && (
          <SelectField
            label="Tipo de Revisão"
            placeholder="Tipo de Revisão"
            value={form.type}
            onPress={() => openPicker('type')}
          />
        )}

        {/* Serviço - apenas no modo criação */}
        {!isEdit && (
          <SelectField
            label="Serviço"
            placeholder="Serviço"
            value={form.service}
            onPress={() => openPicker('service')}
          />
        )}

        {/* Data e Hora */}
        <Text style={styles.label}>Data e Hora</Text>

        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.selectInput, styles.rowItem]}
            onPress={openDate}
          >
            <Ionicons
              name="calendar-outline"
              size={18}
              color={colors.textSecondary}
              style={{ marginRight: spacing.xs }}
            />
            <Text
              style={
                form.dateISO
                  ? styles.selectTextValue
                  : styles.selectTextPlaceholder
              }
            >
              {dateLabel}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.selectInput, styles.rowItem]}
            onPress={openTime}
          >
            <Ionicons
              name="time-outline"
              size={18}
              color={colors.textSecondary}
              style={{ marginRight: spacing.xs }}
            />
            <Text
              style={
                form.timeISO
                  ? styles.selectTextValue
                  : styles.selectTextPlaceholder
              }
            >
              {timeLabel}
            </Text>
          </TouchableOpacity>
        </View>

        {/* DateTimePicker para Data */}
        {datePickerVisible && (
          <DateTimePicker
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            value={form.dateISO ? new Date(form.dateISO) : new Date()}
            onChange={onDateSelected}
            accentColor={colors.primary}
            textColor={colors.primary}
          />
        )}

        {/* DateTimePicker para Hora */}
        {timePickerVisible && (
          <DateTimePicker
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            value={form.timeISO ? new Date(form.timeISO) : new Date()}
            onChange={onTimeSelected}
            accentColor={colors.primary}
            textColor={colors.primary}
          />
        )}

        {/* Quilometragem */}
        <TextInput
          label="Quilometragem"
          value={form.km}
          onChangeText={(text: string) => updateField('km', text)}
          placeholder="Ex: 20.000"
          keyboardType="numeric"
        />

        {/* Lembrete Automático */}
        <View style={styles.switchRow}>
          <Text style={styles.label}>Lembrete Automático</Text>
          <Switch
            value={form.autoReminderEnabled}
            onValueChange={(value) => updateField('autoReminderEnabled', value)}
            trackColor={{
              false: colors.borderLight,
              true: colors.primaryDisabled,
            }}
            thumbColor={
              form.autoReminderEnabled ? colors.primary : colors.background
            }
          />
        </View>

        <SelectField
          placeholder="Selecione o intervalo"
          value={form.autoReminderInterval}
          disabled={!form.autoReminderEnabled}
          onPress={() => openPicker('autoReminderInterval')}
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
            loading={saving}
            disabled={saving}
            onPress={handleSalvar}
          >
            Salvar
          </Button>
        </View>
      </View>

      {/* Modal de opções para Tipo, Serviço e Intervalo */}
      <OptionPickerModal
        visible={pickerVisible}
        title={pickerTitle}
        options={pickerOptions}
        selectedValue={pickerSelectedValue}
        onSelect={(v) => {
          if (pickerField === 'type') updateField('type', v);
          if (pickerField === 'service') updateField('service', v);
          if (pickerField === 'autoReminderInterval')
            updateField('autoReminderInterval', v);

          closePicker();
        }}
        onClose={closePicker}
      />
    </SafeAreaView>
  );
}

/**
 * Campo visualmente igual a um "select", com seta para baixo.
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
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        style={[styles.selectInput, disabled && styles.selectInputDisabled]}
        onPress={disabled ? undefined : onPress}
      >
        <Text
          style={value ? styles.selectTextValue : styles.selectTextPlaceholder}
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

/**
 * Modal genérico para seleção de opções.
 */
type OptionPickerModalProps = {
  visible: boolean;
  title: string;
  options: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
  onClose: () => void;
};

function OptionPickerModal({
  visible,
  title,
  options,
  selectedValue,
  onSelect,
  onClose,
}: OptionPickerModalProps) {
  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalBackdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{title}</Text>

              {options.map((opt) => {
                const isSelected = opt === selectedValue;
                return (
                  <TouchableOpacity
                    key={opt}
                    style={styles.modalOption}
                    onPress={() => onSelect(opt)}
                  >
                    <Text
                      style={[
                        styles.modalOptionText,
                        isSelected && styles.modalOptionTextSelected,
                      ]}
                    >
                      {opt}
                    </Text>
                  </TouchableOpacity>
                );
              })}

              <Button variant="secondary" size="md" fullWidth onPress={onClose}>
                Cancelar
              </Button>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, padding: spacing.md },
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
  rowItem: { flex: 1 },
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
  selectInputDisabled: { backgroundColor: colors.backgroundDisabled },
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
  buttonsContainer: { marginTop: spacing.lg, gap: spacing.sm },

  // Modal styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  modalContent: {
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
    padding: spacing.md,
    gap: spacing.sm,
  },
  modalTitle: {
    fontFamily: typography.fontFamily.arimo,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  modalOption: { paddingVertical: spacing.sm },
  modalOptionText: {
    fontFamily: typography.fontFamily.inter,
    fontSize: typography.fontSize.md,
    color: colors.textPrimary,
  },
  modalOptionTextSelected: {
    fontWeight: typography.fontWeight.semibold,
  },
});
