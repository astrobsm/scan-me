import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  Main: undefined;
  Camera: undefined;
  Editor: { imageUri: string };
};

type Props = NativeStackScreenProps<RootStackParamList, 'Editor'>;

export function EditorScreen({ navigation, route }: Props) {
  const { imageUri } = route.params;
  const [recognizedText, setRecognizedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(true);
  const [confidence, setConfidence] = useState(0);
  const [showImage, setShowImage] = useState(true);

  useEffect(() => {
    processImage();
  }, [imageUri]);

  const processImage = async () => {
    setIsProcessing(true);
    try {
      // Simulate OCR processing
      // In production, use the actual OCR engine
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Placeholder result - replace with actual OCR
      const placeholderText = `This is a sample of recognized text from your handwritten document.

The OCR engine is processing the image and extracting text with high accuracy.

Features:
- Cursive handwriting support
- Medical terminology recognition
- Multi-language support

Please edit the text above if needed, then export to your preferred format.`;
      
      setRecognizedText(placeholderText);
      setConfidence(0.92);
    } catch (error) {
      Alert.alert('Error', 'Failed to process image');
      console.error('OCR error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = async () => {
    await Clipboard.setStringAsync(recognizedText);
    Alert.alert('Copied!', 'Text copied to clipboard');
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: recognizedText,
        title: 'Scanned Text from SCAN ME',
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const handleExport = () => {
    Alert.alert('Export', 'Choose export format', [
      { text: 'PDF', onPress: () => exportAs('pdf') },
      { text: 'Word', onPress: () => exportAs('docx') },
      { text: 'Text', onPress: () => exportAs('txt') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const exportAs = (format: string) => {
    // Export logic will be implemented
    Alert.alert('Exporting...', `Exporting as ${format.toUpperCase()}`);
  };

  if (isProcessing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Processing handwriting...</Text>
        <Text style={styles.loadingSubtext}>
          This may take a few seconds
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView}>
        {/* Image Preview Toggle */}
        <TouchableOpacity
          style={styles.imageToggle}
          onPress={() => setShowImage(!showImage)}
        >
          <Ionicons
            name={showImage ? 'eye-off' : 'eye'}
            size={20}
            color="#64748b"
          />
          <Text style={styles.imageToggleText}>
            {showImage ? 'Hide Original' : 'Show Original'}
          </Text>
        </TouchableOpacity>

        {/* Original Image */}
        {showImage && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: imageUri }} style={styles.image} />
          </View>
        )}

        {/* Confidence Score */}
        <View style={styles.confidenceContainer}>
          <Text style={styles.confidenceLabel}>Confidence:</Text>
          <View style={styles.confidenceBar}>
            <View
              style={[styles.confidenceFill, { width: `${confidence * 100}%` }]}
            />
          </View>
          <Text style={styles.confidenceValue}>
            {(confidence * 100).toFixed(0)}%
          </Text>
        </View>

        {/* Editable Text */}
        <View style={styles.textContainer}>
          <Text style={styles.textLabel}>Recognized Text</Text>
          <TextInput
            style={styles.textInput}
            value={recognizedText}
            onChangeText={setRecognizedText}
            multiline
            textAlignVertical="top"
            placeholder="Recognized text will appear here..."
          />
        </View>
      </ScrollView>

      {/* Action Bar */}
      <View style={styles.actionBar}>
        <TouchableOpacity style={styles.actionButton} onPress={handleCopy}>
          <Ionicons name="copy" size={24} color="#2563eb" />
          <Text style={styles.actionButtonText}>Copy</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
          <Ionicons name="share-social" size={24} color="#2563eb" />
          <Text style={styles.actionButtonText}>Share</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.exportButton]}
          onPress={handleExport}
        >
          <Ionicons name="download" size={24} color="#fff" />
          <Text style={[styles.actionButtonText, styles.exportButtonText]}>
            Export
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 20,
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 8,
  },
  imageToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    gap: 8,
  },
  imageToggleText: {
    color: '#64748b',
    fontSize: 14,
  },
  imageContainer: {
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#e2e8f0',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    gap: 8,
  },
  confidenceLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  confidenceBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    backgroundColor: '#22c55e',
    borderRadius: 4,
  },
  confidenceValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#22c55e',
  },
  textContainer: {
    margin: 16,
  },
  textLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    lineHeight: 24,
    minHeight: 300,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  actionBar: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  exportButton: {
    backgroundColor: '#2563eb',
  },
  exportButtonText: {
    color: '#fff',
  },
});
