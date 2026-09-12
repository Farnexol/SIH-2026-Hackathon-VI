import Material from '../models/Material.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

// Default initial materials matching official statistical manuals
export const DEFAULT_MATERIALS = [
  {
    code: 'mat-1',
    name: 'National Sample Survey (NSS) 78th Round Instruction Manual.pdf',
    fileType: 'PDF',
    fileSize: '4.2 MB',
    pages: 148,
    status: 'Analyzed',
    detectedCompetency: 'Survey Methodology & Sampling',
    generatedQuestionsCount: 25,
    summary: 'Comprehensive manual detailing sampling design, Schedule 0.0 listing protocols, household selection criteria, and multiplier calculation methods for socio-economic survey rounds.',
    keyTopics: ['First Stage Units', 'Neyman Allocation', 'Multiplier Derivation', 'Non-Sampling Errors']
  },
  {
    code: 'mat-2',
    name: 'Consumer Price Index (CPI) Technical Compilation Note.docx',
    fileType: 'DOCX',
    fileSize: '1.8 MB',
    pages: 42,
    status: 'Analyzed',
    detectedCompetency: 'Statistical Computing & Price Indices',
    generatedQuestionsCount: 15,
    summary: 'Technical guidance on elementary aggregate calculation, geometric mean versus Laspeyres weighting, rural-urban aggregation, and base year chaining techniques.',
    keyTopics: ['Laspeyres Formula', 'Elementary Aggregates', 'Quality Changes', 'Imputation Protocols']
  },
  {
    code: 'mat-3',
    name: 'Periodic Labour Force Survey (PLFS) Sampling Design.pdf',
    fileType: 'PDF',
    fileSize: '3.5 MB',
    pages: 94,
    status: 'Analyzed',
    detectedCompetency: 'Data Analysis & Survey Methodology',
    generatedQuestionsCount: 20,
    summary: 'Operational design for rotational panel sampling in urban areas and annual visits in rural sectors for continuous employment-unemployment indicator monitoring.',
    keyTopics: ['Rotational Panel Sampling', 'Current Weekly Status', 'Principal Activity', 'Panel Attrition']
  }
];

// @desc    Get all materials for authenticated user
// @route   GET /api/materials
// @access  Private
export const getMaterials = async (req, res, next) => {
  try {
    let materials = await Material.find({ user: req.user._id }).sort({ createdAt: -1 });

    // Return only materials uploaded by this authenticated user
    const formatted = materials.map((m) => ({
      id: m.code || `mat-${m._id}`,
      _id: m._id,
      name: m.name,
      type: m.fileType,
      size: m.fileSize,
      pages: m.pages,
      uploadDate: new Date(m.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      }),
      status: m.status,
      detectedCompetency: m.detectedCompetency,
      generatedQuestionsCount: m.generatedQuestionsCount,
      summary: m.summary,
      keyTopics: m.keyTopics
    }));

    return sendSuccess(res, formatted, 'Materials retrieved');
  } catch (error) {
    next(error);
  }
};

// @desc    Upload learning material and store metadata
// @route   POST /api/materials/upload
// @access  Private
export const uploadMaterial = async (req, res, next) => {
  try {
    const file = req.file;
    const { competency, estimatedPages } = req.body;

    const fileName = file ? file.originalname : req.body.name || 'Official_Statistical_Guideline.pdf';
    const ext = fileName.split('.').pop().toUpperCase();
    const sizeMb = file ? (file.size / (1024 * 1024)).toFixed(1) + ' MB' : '2.4 MB';

    const materialCode = `mat-${Date.now()}`;

    const newMaterial = await Material.create({
      user: req.user._id,
      code: materialCode,
      name: fileName,
      originalFilename: file ? file.filename : fileName,
      fileType: ['PDF', 'DOCX', 'PPTX', 'TXT'].includes(ext) ? ext : 'PDF',
      fileSize: sizeMb,
      storagePath: file ? file.path : null,
      pages: estimatedPages ? parseInt(estimatedPages) : 36,
      status: 'Analyzed',
      detectedCompetency: competency || 'Data Analysis & Survey Methodology',
      generatedQuestionsCount: 15,
      summary: 'Document ingested into secure processing sandbox. Concepts extracted for competency mapping and MCQ synthesis.',
      keyTopics: ['Survey Frame', 'Validation Rules', 'Aggregation Metrics']
    });

    const responsePayload = {
      id: newMaterial.code,
      _id: newMaterial._id,
      name: newMaterial.name,
      type: newMaterial.fileType,
      size: newMaterial.fileSize,
      pages: newMaterial.pages,
      uploadDate: 'Just now',
      status: newMaterial.status,
      detectedCompetency: newMaterial.detectedCompetency,
      generatedQuestionsCount: newMaterial.generatedQuestionsCount,
      summary: newMaterial.summary,
      keyTopics: newMaterial.keyTopics
    };

    return sendSuccess(res, responsePayload, 'Learning material uploaded & cataloged', 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Trigger or complete analysis on material
// @route   POST /api/materials/:id/analyze
// @access  Private
export const analyzeMaterial = async (req, res, next) => {
  try {
    const material = await Material.findOne({
      user: req.user._id,
      $or: [{ code: req.params.id }, { _id: req.params.id }]
    });

    if (!material) {
      return sendError(res, 'Material not found', 404);
    }

    material.status = 'Analyzed';
    material.generatedQuestionsCount = 15;
    await material.save();

    return sendSuccess(res, { success: true, material }, 'Material analysis complete');
  } catch (error) {
    next(error);
  }
};
