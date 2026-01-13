import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

interface Props {
  navigation: any;
}

export function HomeScreen({ navigation }: Props) {
  const handleScanPress = () => {
    navigation.navigate('Camera');
  };

  const handleImportPress = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      navigation.navigate('Editor', { imageUri: result.assets[0].uri });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Image 
            source={require('../../assets/icon.png')} 
            style={styles.logoImage}
          />
          <Text style={styles.logo}>CHARLES-DOUGLAS</Text>
          <Text style={styles.tagline}>
            Scan • Text-to-Speech • Speech-to-Text
          </Text>
        </View>

        {/* Main Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.primaryButton]}
            onPress={handleScanPress}
          >
            <Ionicons name="camera" size={48} color="#fff" />
            <Text style={styles.actionButtonText}>Scan Document</Text>
            <Text style={styles.actionButtonSubtext}>
              Use camera to capture handwriting
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={handleImportPress}
          >
            <Ionicons name="images" size={48} color="#2563eb" />
            <Text style={[styles.actionButtonText, styles.secondaryText]}>
              Import Image
            </Text>
            <Text style={[styles.actionButtonSubtext, styles.secondarySubtext]}>
              Select from gallery
            </Text>
          </TouchableOpacity>
        </View>

        {/* Features */}
        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>Features</Text>
          
          <View style={styles.featureRow}>
            <View style={styles.featureItem}>
              <Ionicons name="flash" size={24} color="#2563eb" />
              <Text style={styles.featureText}>Offline OCR</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="medical" size={24} color="#2563eb" />
              <Text style={styles.featureText}>Medical Mode</Text>
            </View>
          </View>
          
          <View style={styles.featureRow}>
            <View style={styles.featureItem}>
              <Ionicons name="document-text" size={24} color="#2563eb" />
              <Text style={styles.featureText}>Export PDF</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="lock-closed" size={24} color="#2563eb" />
              <Text style={styles.featureText}>Encrypted</Text>
            </View>
          </View>
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
  scrollContent: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  logoImage: {
    width: 80,
    height: 80,
    borderRadius: 16,
    marginBottom: 12,
  },
  tagline: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 8,
  },
  actionsContainer: {
    gap: 16,
    marginBottom: 40,
  },
  actionButton: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#2563eb',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#2563eb',
  },
  actionButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 12,
  },
  actionButtonSubtext: {
    fontSize: 14,
    color: '#bfdbfe',
    marginTop: 4,
  },
  secondaryText: {
    color: '#2563eb',
  },
  secondarySubtext: {
    color: '#64748b',
  },
  featuresContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
  },
  featureText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
});
