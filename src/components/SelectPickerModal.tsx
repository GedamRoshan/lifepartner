import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { X } from 'lucide-react-native';
import { theme } from '../theme';

export interface SelectPickerModalProps {
  visible: boolean;
  title: string;
  options: string[];
  selectedValue?: string;
  onSelect: (option: string) => void;
  onClose: () => void;
}

export const SelectPickerModal: React.FC<SelectPickerModalProps> = ({
  visible,
  title,
  options,
  selectedValue,
  onSelect,
  onClose,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} onPress={onClose} activeOpacity={1} />
      <View style={styles.dropdownSheet}>
        <View style={styles.dropdownHeader}>
          <Text style={styles.dropdownTitle}>{title}</Text>
          <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <X size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
        <FlatList
          data={options}
          keyExtractor={item => item}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const isSelected = selectedValue === item;
            return (
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
              >
                <Text style={[styles.dropdownItemText, isSelected && styles.dropdownItemTextSelected]}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  dropdownSheet: {
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: '60%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...theme.shadows.lg,
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  dropdownTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 18,
    color: theme.colors.text,
    fontWeight: '700',
  },
  dropdownItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  dropdownItemText: {
    fontFamily: theme.fonts.medium,
    fontSize: 16,
    color: theme.colors.text,
  },
  dropdownItemTextSelected: {
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
  },
});
