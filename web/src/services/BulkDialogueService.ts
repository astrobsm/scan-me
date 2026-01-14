// Bulk Dialogue Upload Service
// Supports CSV, JSON, and plain text formats

export interface BulkDialogueEntry {
  participantName?: string;
  participantIndex?: number;
  text: string;
  emotion?: string;
  pauseAfter?: number;
  sceneNumber?: number;
}

export interface BulkUploadResult {
  success: boolean;
  entries: BulkDialogueEntry[];
  errors: string[];
  warnings: string[];
  format: 'csv' | 'json' | 'txt' | 'unknown';
}

export interface DialogueTemplate {
  id: string;
  name: string;
  category: 'health-talk' | 'advert' | 'educational' | 'custom';
  description: string;
  dialogues: BulkDialogueEntry[];
}

// Pre-built dialogue templates
export const DIALOGUE_TEMPLATES: DialogueTemplate[] = [
  {
    id: 'health-diabetes',
    name: 'Diabetes Awareness',
    category: 'health-talk',
    description: 'Educational dialogue about diabetes prevention and management',
    dialogues: [
      { participantIndex: 0, text: "Welcome to today's health talk. Today we'll be discussing diabetes - a condition that affects millions of Nigerians.", emotion: 'neutral' },
      { participantIndex: 1, text: "That's right, Doctor. Diabetes is becoming increasingly common. Can you tell us what exactly it is?", emotion: 'serious' },
      { participantIndex: 0, text: "Diabetes occurs when your body can't properly use or produce insulin, the hormone that regulates blood sugar.", emotion: 'neutral' },
      { participantIndex: 1, text: "What are the warning signs people should look out for?", emotion: 'concerned' },
      { participantIndex: 0, text: "Common symptoms include frequent urination, excessive thirst, unexplained weight loss, and blurred vision.", emotion: 'serious' },
      { participantIndex: 1, text: "How can our viewers prevent diabetes?", emotion: 'neutral' },
      { participantIndex: 0, text: "Prevention is key! Maintain a healthy weight, exercise regularly, eat a balanced diet, and limit sugar intake.", emotion: 'happy' },
      { participantIndex: 1, text: "Thank you, Doctor. Remember viewers, your health is your wealth!", emotion: 'happy' }
    ]
  },
  {
    id: 'health-malaria',
    name: 'Malaria Prevention',
    category: 'health-talk',
    description: 'Discussion about malaria prevention and treatment',
    dialogues: [
      { participantIndex: 0, text: "Good day everyone. Today we're discussing malaria, one of the leading causes of illness in Nigeria.", emotion: 'neutral' },
      { participantIndex: 1, text: "Doctor, malaria affects so many families. What causes it?", emotion: 'concerned' },
      { participantIndex: 0, text: "Malaria is caused by parasites transmitted through the bite of infected female Anopheles mosquitoes.", emotion: 'neutral' },
      { participantIndex: 1, text: "What can families do to protect themselves?", emotion: 'neutral' },
      { participantIndex: 0, text: "Sleep under insecticide-treated nets, use mosquito repellent, and eliminate stagnant water around your home.", emotion: 'serious' },
      { participantIndex: 1, text: "What are the symptoms to watch for?", emotion: 'concerned' },
      { participantIndex: 0, text: "Fever, chills, headache, muscle aches, and fatigue. If you experience these, seek medical care immediately!", emotion: 'serious' },
      { participantIndex: 1, text: "Early treatment saves lives. Thank you for watching and stay protected!", emotion: 'happy' }
    ]
  },
  {
    id: 'health-hygiene',
    name: 'Personal Hygiene',
    category: 'health-talk',
    description: 'Importance of personal hygiene and handwashing',
    dialogues: [
      { participantIndex: 0, text: "Hello everyone! Today's topic is personal hygiene - simple habits that prevent many diseases.", emotion: 'happy' },
      { participantIndex: 1, text: "Hygiene seems basic, but why is it so important?", emotion: 'neutral' },
      { participantIndex: 0, text: "Good hygiene prevents the spread of germs that cause diarrhea, respiratory infections, and skin diseases.", emotion: 'neutral' },
      { participantIndex: 1, text: "Let's talk about handwashing. When should we wash our hands?", emotion: 'neutral' },
      { participantIndex: 0, text: "Before eating, after using the toilet, after handling animals, and after coughing or sneezing.", emotion: 'serious' },
      { participantIndex: 1, text: "How should we properly wash our hands?", emotion: 'neutral' },
      { participantIndex: 0, text: "Wet your hands, apply soap, scrub for at least 20 seconds, rinse thoroughly, and dry with a clean towel.", emotion: 'neutral' },
      { participantIndex: 1, text: "Simple steps for a healthier life! Thank you all for watching!", emotion: 'happy' }
    ]
  },
  {
    id: 'advert-product',
    name: 'Product Advertisement',
    category: 'advert',
    description: 'Generic product advertisement template',
    dialogues: [
      { participantIndex: 0, text: "Are you tired of the same old problems every day?", emotion: 'concerned' },
      { participantIndex: 0, text: "Introducing the revolutionary solution you've been waiting for!", emotion: 'excited' },
      { participantIndex: 0, text: "Our product is designed with you in mind - quality you can trust!", emotion: 'happy' },
      { participantIndex: 0, text: "Join thousands of satisfied customers across Nigeria.", emotion: 'neutral' },
      { participantIndex: 0, text: "Don't wait! Visit our store today or call now to order!", emotion: 'excited' },
      { participantIndex: 0, text: "Quality. Affordable. Available near you.", emotion: 'happy' }
    ]
  },
  {
    id: 'advert-service',
    name: 'Service Advertisement',
    category: 'advert',
    description: 'Professional service advertisement template',
    dialogues: [
      { participantIndex: 0, text: "Looking for professional, reliable service?", emotion: 'neutral' },
      { participantIndex: 0, text: "We've been serving our community for over 10 years!", emotion: 'happy' },
      { participantIndex: 0, text: "Our team of experts is ready to help you succeed.", emotion: 'neutral' },
      { participantIndex: 0, text: "Fast, efficient, and always professional.", emotion: 'serious' },
      { participantIndex: 0, text: "Contact us today for a free consultation!", emotion: 'excited' }
    ]
  },
  {
    id: 'edu-intro',
    name: 'Educational Introduction',
    category: 'educational',
    description: 'Template for educational content',
    dialogues: [
      { participantIndex: 0, text: "Welcome to today's lesson! I'm excited to teach you something new.", emotion: 'happy' },
      { participantIndex: 0, text: "Today's topic is important for everyone to understand.", emotion: 'neutral' },
      { participantIndex: 0, text: "Let me break this down into simple, easy-to-follow steps.", emotion: 'neutral' },
      { participantIndex: 0, text: "First, let's understand the basic concept.", emotion: 'neutral' },
      { participantIndex: 0, text: "Now let's look at some practical examples.", emotion: 'neutral' },
      { participantIndex: 0, text: "Remember these key points as we move forward.", emotion: 'serious' },
      { participantIndex: 0, text: "Practice makes perfect! Try this at home.", emotion: 'happy' },
      { participantIndex: 0, text: "Thank you for learning with me today!", emotion: 'happy' }
    ]
  }
];

export class BulkDialogueService {
  
  // Parse uploaded file content
  parseFile(content: string, filename: string): BulkUploadResult {
    const extension = filename.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'csv':
        return this.parseCSV(content);
      case 'json':
        return this.parseJSON(content);
      case 'txt':
        return this.parseTXT(content);
      default:
        // Try to auto-detect format
        return this.autoDetectAndParse(content);
    }
  }
  
  // Parse CSV format
  private parseCSV(content: string): BulkUploadResult {
    const result: BulkUploadResult = {
      success: false,
      entries: [],
      errors: [],
      warnings: [],
      format: 'csv'
    };
    
    try {
      const lines = content.split('\n').filter(line => line.trim());
      if (lines.length === 0) {
        result.errors.push('File is empty');
        return result;
      }
      
      // Check for header row
      const firstLine = lines[0].toLowerCase();
      const hasHeader = firstLine.includes('text') || firstLine.includes('dialogue') || 
                       firstLine.includes('participant') || firstLine.includes('speaker');
      
      const startIndex = hasHeader ? 1 : 0;
      const headers = hasHeader ? this.parseCSVLine(lines[0]) : ['participant', 'text', 'emotion', 'pause'];
      
      // Map header indices
      const participantIdx = headers.findIndex(h => 
        h.toLowerCase().includes('participant') || h.toLowerCase().includes('speaker') || h.toLowerCase().includes('name')
      );
      const textIdx = headers.findIndex(h => 
        h.toLowerCase().includes('text') || h.toLowerCase().includes('dialogue') || h.toLowerCase().includes('content')
      );
      const emotionIdx = headers.findIndex(h => 
        h.toLowerCase().includes('emotion') || h.toLowerCase().includes('mood') || h.toLowerCase().includes('feeling')
      );
      const pauseIdx = headers.findIndex(h => 
        h.toLowerCase().includes('pause') || h.toLowerCase().includes('delay') || h.toLowerCase().includes('wait')
      );
      const sceneIdx = headers.findIndex(h => 
        h.toLowerCase().includes('scene') || h.toLowerCase().includes('section')
      );
      
      for (let i = startIndex; i < lines.length; i++) {
        const values = this.parseCSVLine(lines[i]);
        if (values.length === 0 || values.every(v => !v.trim())) continue;
        
        const entry: BulkDialogueEntry = {
          text: ''
        };
        
        // Get text (required)
        if (textIdx >= 0 && values[textIdx]) {
          entry.text = values[textIdx].trim();
        } else if (!hasHeader && values.length >= 2) {
          entry.text = values[1].trim();
        } else if (values.length === 1) {
          entry.text = values[0].trim();
        }
        
        if (!entry.text) {
          result.warnings.push(`Line ${i + 1}: Empty text, skipping`);
          continue;
        }
        
        // Get participant
        if (participantIdx >= 0 && values[participantIdx]) {
          const participant = values[participantIdx].trim();
          const numMatch = participant.match(/\d+/);
          if (numMatch) {
            entry.participantIndex = parseInt(numMatch[0]) - 1;
          } else {
            entry.participantName = participant;
          }
        } else if (!hasHeader && values.length >= 2) {
          const participant = values[0].trim();
          const numMatch = participant.match(/\d+/);
          if (numMatch) {
            entry.participantIndex = parseInt(numMatch[0]) - 1;
          } else {
            entry.participantName = participant;
          }
        }
        
        // Get emotion
        if (emotionIdx >= 0 && values[emotionIdx]) {
          entry.emotion = values[emotionIdx].trim().toLowerCase();
        }
        
        // Get pause
        if (pauseIdx >= 0 && values[pauseIdx]) {
          const pause = parseInt(values[pauseIdx]);
          if (!isNaN(pause)) {
            entry.pauseAfter = pause;
          }
        }
        
        // Get scene
        if (sceneIdx >= 0 && values[sceneIdx]) {
          const scene = parseInt(values[sceneIdx]);
          if (!isNaN(scene)) {
            entry.sceneNumber = scene;
          }
        }
        
        result.entries.push(entry);
      }
      
      result.success = result.entries.length > 0;
      if (!result.success) {
        result.errors.push('No valid dialogue entries found');
      }
      
    } catch (error) {
      result.errors.push(`CSV parsing error: ${error}`);
    }
    
    return result;
  }
  
  // Parse a single CSV line handling quoted values
  private parseCSVLine(line: string): string[] {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    values.push(current.trim());
    return values;
  }
  
  // Parse JSON format
  private parseJSON(content: string): BulkUploadResult {
    const result: BulkUploadResult = {
      success: false,
      entries: [],
      errors: [],
      warnings: [],
      format: 'json'
    };
    
    try {
      const data = JSON.parse(content);
      
      // Handle array format
      const dialogues = Array.isArray(data) ? data : (data.dialogues || data.lines || data.entries || [data]);
      
      for (let i = 0; i < dialogues.length; i++) {
        const item = dialogues[i];
        
        if (typeof item === 'string') {
          result.entries.push({ text: item });
          continue;
        }
        
        const entry: BulkDialogueEntry = {
          text: item.text || item.dialogue || item.content || item.line || ''
        };
        
        if (!entry.text) {
          result.warnings.push(`Entry ${i + 1}: No text found, skipping`);
          continue;
        }
        
        // Get participant
        if (item.participant !== undefined || item.speaker !== undefined) {
          const participant = item.participant ?? item.speaker;
          if (typeof participant === 'number') {
            entry.participantIndex = participant;
          } else {
            entry.participantName = participant;
          }
        } else if (item.participantIndex !== undefined) {
          entry.participantIndex = item.participantIndex;
        }
        
        // Get emotion
        if (item.emotion || item.mood) {
          entry.emotion = (item.emotion || item.mood).toLowerCase();
        }
        
        // Get pause
        if (item.pauseAfter !== undefined || item.pause !== undefined || item.delay !== undefined) {
          entry.pauseAfter = item.pauseAfter ?? item.pause ?? item.delay;
        }
        
        // Get scene
        if (item.scene !== undefined || item.sceneNumber !== undefined) {
          entry.sceneNumber = item.scene ?? item.sceneNumber;
        }
        
        result.entries.push(entry);
      }
      
      result.success = result.entries.length > 0;
      if (!result.success) {
        result.errors.push('No valid dialogue entries found');
      }
      
    } catch (error) {
      result.errors.push(`JSON parsing error: ${error}`);
    }
    
    return result;
  }
  
  // Parse plain text format
  private parseTXT(content: string): BulkUploadResult {
    const result: BulkUploadResult = {
      success: false,
      entries: [],
      errors: [],
      warnings: [],
      format: 'txt'
    };
    
    try {
      const lines = content.split('\n').filter(line => line.trim());
      let currentParticipant = 0;
      let currentScene = 1;
      
      for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        
        // Check for scene marker
        const sceneMatch = line.match(/^(?:scene|section)\s*(\d+)/i);
        if (sceneMatch) {
          currentScene = parseInt(sceneMatch[1]);
          continue;
        }
        
        // Skip comments
        if (line.startsWith('#') || line.startsWith('//')) {
          continue;
        }
        
        const entry: BulkDialogueEntry = {
          text: '',
          sceneNumber: currentScene
        };
        
        // Check for speaker prefix (e.g., "Speaker 1:" or "Dr. Adaeze:")
        const speakerMatch = line.match(/^([^:]+):\s*(.+)$/);
        if (speakerMatch) {
          const speaker = speakerMatch[1].trim();
          entry.text = speakerMatch[2].trim();
          
          const numMatch = speaker.match(/\d+/);
          if (numMatch) {
            entry.participantIndex = parseInt(numMatch[0]) - 1;
          } else {
            entry.participantName = speaker;
          }
        } else {
          // No speaker prefix - alternate between participants
          entry.text = line;
          entry.participantIndex = currentParticipant;
          currentParticipant = (currentParticipant + 1) % 2;
        }
        
        // Check for emotion in brackets
        const emotionMatch = entry.text.match(/\[([^\]]+)\]/);
        if (emotionMatch) {
          entry.emotion = emotionMatch[1].toLowerCase();
          entry.text = entry.text.replace(/\[[^\]]+\]/, '').trim();
        }
        
        if (entry.text) {
          result.entries.push(entry);
        }
      }
      
      result.success = result.entries.length > 0;
      if (!result.success) {
        result.errors.push('No valid dialogue entries found');
      }
      
    } catch (error) {
      result.errors.push(`Text parsing error: ${error}`);
    }
    
    return result;
  }
  
  // Auto-detect format and parse
  private autoDetectAndParse(content: string): BulkUploadResult {
    const trimmed = content.trim();
    
    // Check if it starts with JSON
    if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
      return this.parseJSON(content);
    }
    
    // Check if it looks like CSV (has commas and consistent columns)
    const lines = trimmed.split('\n');
    if (lines.length > 1) {
      const firstLineCommas = (lines[0].match(/,/g) || []).length;
      const secondLineCommas = (lines[1].match(/,/g) || []).length;
      if (firstLineCommas > 0 && firstLineCommas === secondLineCommas) {
        return this.parseCSV(content);
      }
    }
    
    // Default to plain text
    return this.parseTXT(content);
  }
  
  // Generate sample CSV content
  generateSampleCSV(): string {
    return `Participant,Text,Emotion,Pause
1,"Welcome to today's health discussion!",happy,500
2,"Thank you for having me. What are we discussing today?",neutral,500
1,"We'll be talking about the importance of regular exercise.",neutral,500
2,"That's a great topic! Many people don't exercise enough.",concerned,500
1,"Exactly. Just 30 minutes of walking daily can make a huge difference.",serious,500
2,"What are the main benefits of regular exercise?",neutral,500
1,"It improves heart health, mental well-being, and helps maintain a healthy weight.",happy,500
2,"Thank you for these valuable insights. Stay healthy, everyone!",excited,0`;
  }
  
  // Generate sample JSON content
  generateSampleJSON(): string {
    return JSON.stringify({
      dialogues: [
        { participant: 1, text: "Welcome to today's health discussion!", emotion: "happy", pauseAfter: 500 },
        { participant: 2, text: "Thank you for having me. What are we discussing today?", emotion: "neutral", pauseAfter: 500 },
        { participant: 1, text: "We'll be talking about the importance of regular exercise.", emotion: "neutral", pauseAfter: 500 },
        { participant: 2, text: "That's a great topic! Many people don't exercise enough.", emotion: "concerned", pauseAfter: 500 },
        { participant: 1, text: "Exactly. Just 30 minutes of walking daily can make a huge difference.", emotion: "serious", pauseAfter: 500 },
        { participant: 2, text: "What are the main benefits of regular exercise?", emotion: "neutral", pauseAfter: 500 },
        { participant: 1, text: "It improves heart health, mental well-being, and helps maintain a healthy weight.", emotion: "happy", pauseAfter: 500 },
        { participant: 2, text: "Thank you for these valuable insights. Stay healthy, everyone!", emotion: "excited", pauseAfter: 0 }
      ]
    }, null, 2);
  }
  
  // Generate sample TXT content
  generateSampleTXT(): string {
    return `# Health Talk Script
# Lines starting with # are comments

Scene 1

Speaker 1: Welcome to today's health discussion! [happy]
Speaker 2: Thank you for having me. What are we discussing today? [neutral]
Speaker 1: We'll be talking about the importance of regular exercise. [neutral]
Speaker 2: That's a great topic! Many people don't exercise enough. [concerned]

Scene 2

Speaker 1: Exactly. Just 30 minutes of walking daily can make a huge difference. [serious]
Speaker 2: What are the main benefits of regular exercise? [neutral]
Speaker 1: It improves heart health, mental well-being, and helps maintain a healthy weight. [happy]
Speaker 2: Thank you for these valuable insights. Stay healthy, everyone! [excited]`;
  }
  
  // Get template by ID
  getTemplate(id: string): DialogueTemplate | undefined {
    return DIALOGUE_TEMPLATES.find(t => t.id === id);
  }
  
  // Get templates by category
  getTemplatesByCategory(category: string): DialogueTemplate[] {
    return DIALOGUE_TEMPLATES.filter(t => t.category === category);
  }
}

export const bulkDialogueService = new BulkDialogueService();
