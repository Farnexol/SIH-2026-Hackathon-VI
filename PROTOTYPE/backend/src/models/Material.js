import mongoose from 'mongoose';

const materialSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    code: {
      type: String,
      unique: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    originalFilename: {
      type: String
    },
    fileType: {
      type: String,
      enum: ['PDF', 'DOCX', 'PPTX', 'TXT', 'OTHER'],
      default: 'PDF'
    },
    fileSize: {
      type: String,
      default: '2.5 MB'
    },
    storagePath: {
      type: String
    },
    pages: {
      type: Number,
      default: 36
    },
    status: {
      type: String,
      enum: ['Uploaded', 'Analyzing', 'Analyzed', 'Failed'],
      default: 'Uploaded'
    },
    detectedCompetency: {
      type: String,
      default: 'Data Analysis & Survey Methodology'
    },
    generatedQuestionsCount: {
      type: Number,
      default: 0
    },
    summary: {
      type: String,
      default: 'Document ingested into secure processing sandbox. Concepts extracted for competency mapping.'
    },
    keyTopics: {
      type: [String],
      default: ['Survey Frame', 'Validation Rules', 'Aggregation Metrics']
    }
  },
  {
    timestamps: true
  }
);

const Material = mongoose.model('Material', materialSchema);

export default Material;
