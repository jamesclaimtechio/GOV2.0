import { createHash } from 'crypto'

/**
 * File processing and text extraction service
 * Handles PDF/DOCX uploads with security checks
 */

export interface FileUploadResult {
  originalName: string
  storageUrl: string
  checksum: string
  sizeBytes: number
  extractedText?: string
  metadata?: Record<string, any>
}

export interface ExtractionResult {
  text: string
  metadata: {
    pageCount?: number
    wordCount: number
    language?: string
    extractionMethod: 'pdf-parse' | 'docx-parse' | 'ocr-fallback'
  }
}

export class FileExtractionService {
  private readonly MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB as per setup.mdc
  private readonly ALLOWED_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']

  /**
   * Validate file before processing
   */
  validateFile(file: File): { valid: boolean; error?: string } {
    // Size check
    if (file.size > this.MAX_FILE_SIZE) {
      return { valid: false, error: 'File size exceeds 10MB limit' }
    }

    // Type check
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      return { valid: false, error: 'Only PDF and DOCX files are supported' }
    }

    return { valid: true }
  }

  /**
   * Generate SHA-256 checksum for file integrity
   */
  async generateChecksum(buffer: ArrayBuffer): Promise<string> {
    const hash = createHash('sha256')
    hash.update(Buffer.from(buffer))
    return hash.digest('hex')
  }

  /**
   * Extract text from PDF file
   */
  async extractFromPDF(buffer: ArrayBuffer): Promise<ExtractionResult> {
    try {
      // TODO: Implement PDF text extraction
      // Will use pdf2pic or similar library
      const mockText = 'PDF text extraction will be implemented with pdf-parse library'
      
      return {
        text: mockText,
        metadata: {
          wordCount: mockText.split(' ').length,
          extractionMethod: 'pdf-parse',
        },
      }
    } catch (error) {
      console.error('PDF extraction failed:', error)
      throw new Error('Failed to extract text from PDF')
    }
  }

  /**
   * Extract text from DOCX file
   */
  async extractFromDOCX(buffer: ArrayBuffer): Promise<ExtractionResult> {
    try {
      // TODO: Implement DOCX text extraction
      // Will use mammoth.js or similar library
      const mockText = 'DOCX text extraction will be implemented with mammoth.js library'
      
      return {
        text: mockText,
        metadata: {
          wordCount: mockText.split(' ').length,
          extractionMethod: 'docx-parse',
        },
      }
    } catch (error) {
      console.error('DOCX extraction failed:', error)
      throw new Error('Failed to extract text from DOCX')
    }
  }

  /**
   * Process uploaded file with security checks
   */
  async processFile(file: File): Promise<FileUploadResult> {
    // Validate file
    const validation = this.validateFile(file)
    if (!validation.valid) {
      throw new Error(validation.error)
    }

    // Convert to buffer
    const buffer = await file.arrayBuffer()
    
    // Generate checksum
    const checksum = await this.generateChecksum(buffer)

    // Extract text based on file type
    let extractedText: string | undefined
    try {
      if (file.type === 'application/pdf') {
        const extraction = await this.extractFromPDF(buffer)
        extractedText = extraction.text
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const extraction = await this.extractFromDOCX(buffer)
        extractedText = extraction.text
      }
    } catch (error) {
      console.warn('Text extraction failed, proceeding without extracted text:', error)
    }

    // TODO: Implement virus scanning hook
    // TODO: Store file in secure location (Vercel Blob, S3, etc.)
    
    return {
      originalName: file.name,
      storageUrl: `/uploads/${checksum}-${file.name}`, // Placeholder
      checksum,
      sizeBytes: file.size,
      extractedText,
      metadata: {
        uploadedAt: new Date().toISOString(),
        mimeType: file.type,
      },
    }
  }

  /**
   * Redact PII from text before sending to LLM
   * Implements PII minimization as required by setup.mdc
   */
  redactPII(text: string): { redactedText: string; redactionMap: Record<string, string> } {
    const redactionMap: Record<string, string> = {}
    let redactedText = text

    // Email pattern
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g
    redactedText = redactedText.replace(emailRegex, (match) => {
      const placeholder = `[EMAIL_${Object.keys(redactionMap).length + 1}]`
      redactionMap[placeholder] = match
      return placeholder
    })

    // Phone pattern
    const phoneRegex = /\b(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})\b/g
    redactedText = redactedText.replace(phoneRegex, (match) => {
      const placeholder = `[PHONE_${Object.keys(redactionMap).length + 1}]`
      redactionMap[placeholder] = match
      return placeholder
    })

    // Credit card pattern
    const ccRegex = /\b(?:\d{4}[-\s]?){3}\d{4}\b/g
    redactedText = redactedText.replace(ccRegex, (match) => {
      const placeholder = `[CC_${Object.keys(redactionMap).length + 1}]`
      redactionMap[placeholder] = match
      return placeholder
    })

    return { redactedText, redactionMap }
  }
}
