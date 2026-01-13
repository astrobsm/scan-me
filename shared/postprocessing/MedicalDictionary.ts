/**
 * Medical Dictionary
 * Common medical terms, abbreviations, and drug names
 */

export class MedicalDictionary {
  private terms: Map<string, string>;
  private abbreviations: Map<string, string>;
  private drugNames: Set<string>;

  constructor() {
    this.terms = this.loadMedicalTerms();
    this.abbreviations = this.loadAbbreviations();
    this.drugNames = this.loadDrugNames();
  }

  /**
   * Check if a word is a medical term
   */
  isMedicalTerm(word: string): boolean {
    const normalized = word.toLowerCase();
    return this.terms.has(normalized) || 
           this.abbreviations.has(normalized.toUpperCase()) ||
           this.drugNames.has(normalized);
  }

  /**
   * Get correct spelling for a medical term
   */
  correctTerm(word: string): string | null {
    const normalized = word.toLowerCase();
    
    // Check exact matches
    if (this.terms.has(normalized)) {
      return this.terms.get(normalized)!;
    }
    
    // Check abbreviations
    if (this.abbreviations.has(word.toUpperCase())) {
      return word.toUpperCase();
    }
    
    // Find closest match using Levenshtein distance
    return this.findClosestMatch(word);
  }

  /**
   * Expand medical abbreviation
   */
  expandAbbreviation(abbr: string): string | null {
    return this.abbreviations.get(abbr.toUpperCase()) || null;
  }

  /**
   * Find closest matching term
   */
  private findClosestMatch(word: string): string | null {
    const normalized = word.toLowerCase();
    let bestMatch: string | null = null;
    let bestDistance = Infinity;
    const maxDistance = 2;

    for (const term of this.terms.keys()) {
      const distance = this.levenshteinDistance(normalized, term);
      if (distance < bestDistance && distance <= maxDistance) {
        bestDistance = distance;
        bestMatch = this.terms.get(term)!;
      }
    }

    return bestMatch;
  }

  /**
   * Calculate Levenshtein distance
   */
  private levenshteinDistance(a: string, b: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[b.length][a.length];
  }

  /**
   * Load common medical terms
   */
  private loadMedicalTerms(): Map<string, string> {
    return new Map([
      // Anatomy
      ['abdomen', 'Abdomen'],
      ['cardiac', 'Cardiac'],
      ['cerebral', 'Cerebral'],
      ['hepatic', 'Hepatic'],
      ['pulmonary', 'Pulmonary'],
      ['renal', 'Renal'],
      ['thoracic', 'Thoracic'],
      
      // Conditions
      ['hypertension', 'Hypertension'],
      ['diabetes', 'Diabetes'],
      ['pneumonia', 'Pneumonia'],
      ['bronchitis', 'Bronchitis'],
      ['arthritis', 'Arthritis'],
      ['anemia', 'Anemia'],
      ['asthma', 'Asthma'],
      
      // Procedures
      ['biopsy', 'Biopsy'],
      ['endoscopy', 'Endoscopy'],
      ['laparoscopy', 'Laparoscopy'],
      ['ultrasound', 'Ultrasound'],
      ['radiography', 'Radiography'],
      
      // Medications
      ['antibiotic', 'Antibiotic'],
      ['analgesic', 'Analgesic'],
      ['antihypertensive', 'Antihypertensive'],
      ['antipyretic', 'Antipyretic'],
    ]);
  }

  /**
   * Load medical abbreviations
   */
  private loadAbbreviations(): Map<string, string> {
    return new Map([
      ['BP', 'Blood Pressure'],
      ['HR', 'Heart Rate'],
      ['RR', 'Respiratory Rate'],
      ['T', 'Temperature'],
      ['O2', 'Oxygen'],
      ['SPO2', 'Oxygen Saturation'],
      ['BMI', 'Body Mass Index'],
      ['CBC', 'Complete Blood Count'],
      ['ECG', 'Electrocardiogram'],
      ['EKG', 'Electrocardiogram'],
      ['CT', 'Computed Tomography'],
      ['MRI', 'Magnetic Resonance Imaging'],
      ['IV', 'Intravenous'],
      ['IM', 'Intramuscular'],
      ['PO', 'Per Oral'],
      ['PRN', 'As Needed'],
      ['BID', 'Twice Daily'],
      ['TID', 'Three Times Daily'],
      ['QID', 'Four Times Daily'],
      ['QD', 'Once Daily'],
      ['STAT', 'Immediately'],
      ['NPO', 'Nothing By Mouth'],
      ['DNR', 'Do Not Resuscitate'],
      ['Rx', 'Prescription'],
      ['Dx', 'Diagnosis'],
      ['Hx', 'History'],
      ['Sx', 'Symptoms'],
      ['Tx', 'Treatment'],
    ]);
  }

  /**
   * Load common drug names
   */
  private loadDrugNames(): Set<string> {
    return new Set([
      'acetaminophen',
      'ibuprofen',
      'aspirin',
      'amoxicillin',
      'azithromycin',
      'metformin',
      'lisinopril',
      'atorvastatin',
      'omeprazole',
      'amlodipine',
      'metoprolol',
      'losartan',
      'gabapentin',
      'hydrochlorothiazide',
      'sertraline',
      'fluoxetine',
      'prednisone',
      'albuterol',
      'levothyroxine',
      'pantoprazole',
    ]);
  }
}
