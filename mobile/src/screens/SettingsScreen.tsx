import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export function SettingsScreen() {
  const [settings, setSettings] = useState({
    medicalMode: false,
    offlineMode: true,
    darkMode: false,
    autoProcess: true,
    highQuality: true,
    saveHistory: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>

        {/* OCR Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>OCR Settings</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="medical" size={24} color="#2563eb" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Medical Mode</Text>
                <Text style={styles.settingDescription}>
                  Enhanced recognition for medical terms
                </Text>
              </View>
            </View>
            <Switch
              value={settings.medicalMode}
              onValueChange={() => toggleSetting('medicalMode')}
              trackColor={{ false: '#e2e8f0', true: '#93c5fd' }}
              thumbColor={settings.medicalMode ? '#2563eb' : '#f4f4f5'}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="cloud-offline" size={24} color="#2563eb" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Offline Mode</Text>
                <Text style={styles.settingDescription}>
                  Process images without internet
                </Text>
              </View>
            </View>
            <Switch
              value={settings.offlineMode}
              onValueChange={() => toggleSetting('offlineMode')}
              trackColor={{ false: '#e2e8f0', true: '#93c5fd' }}
              thumbColor={settings.offlineMode ? '#2563eb' : '#f4f4f5'}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="flash" size={24} color="#2563eb" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Auto Process</Text>
                <Text style={styles.settingDescription}>
                  Start OCR automatically after capture
                </Text>
              </View>
            </View>
            <Switch
              value={settings.autoProcess}
              onValueChange={() => toggleSetting('autoProcess')}
              trackColor={{ false: '#e2e8f0', true: '#93c5fd' }}
              thumbColor={settings.autoProcess ? '#2563eb' : '#f4f4f5'}
            />
          </View>
        </View>

        {/* Quality Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quality</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="sparkles" size={24} color="#2563eb" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>High Quality</Text>
                <Text style={styles.settingDescription}>
                  Better accuracy, slower processing
                </Text>
              </View>
            </View>
            <Switch
              value={settings.highQuality}
              onValueChange={() => toggleSetting('highQuality')}
              trackColor={{ false: '#e2e8f0', true: '#93c5fd' }}
              thumbColor={settings.highQuality ? '#2563eb' : '#f4f4f5'}
            />
          </View>
        </View>

        {/* Privacy Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="time" size={24} color="#2563eb" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Save History</Text>
                <Text style={styles.settingDescription}>
                  Keep scanned documents locally
                </Text>
              </View>
            </View>
            <Switch
              value={settings.saveHistory}
              onValueChange={() => toggleSetting('saveHistory')}
              trackColor={{ false: '#e2e8f0', true: '#93c5fd' }}
              thumbColor={settings.saveHistory ? '#2563eb' : '#f4f4f5'}
            />
          </View>

          <TouchableOpacity style={styles.dangerButton}>
            <Ionicons name="trash" size={20} color="#ef4444" />
            <Text style={styles.dangerButtonText}>Clear All Data</Text>
          </TouchableOpacity>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>Version</Text>
            <Text style={styles.aboutValue}>1.0.0</Text>
          </View>
          
          <TouchableOpacity style={styles.linkRow}>
            <Text style={styles.linkText}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.linkRow}>
            <Text style={styles.linkText}>Terms of Service</Text>
            <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#64748b',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: '#1e293b',
  },
  settingDescription: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    marginTop: 12,
    borderRadius: 8,
    backgroundColor: '#fef2f2',
    gap: 8,
  },
  dangerButtonText: {
    color: '#ef4444',
    fontWeight: 'bold',
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  aboutLabel: {
    fontSize: 16,
    color: '#1e293b',
  },
  aboutValue: {
    fontSize: 16,
    color: '#94a3b8',
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  linkText: {
    fontSize: 16,
    color: '#2563eb',
  },
});
