import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  RefreshCw, 
  Upload,
  Image as ImageIcon,
  User,
  ChevronDown,
  Trash2,
  RotateCcw
} from 'lucide-react';
import { generateImagePrompt, PromptOptions } from './services/geminiService';

const GENDERS = ['Male', 'Female', 'Non-binary', 'Androgynous'];
const EXPRESSIONS = ['Smile', 'Serious', 'Sad', 'Angry', 'Surprised', 'Laughing'];
const SHOT_TYPES = ['Full Body', 'Medium Shot', 'Close Up', 'Extreme Close Up', 'Wide Shot'];
const CAMERA_ANGLES = ['Eye Level', 'Low Angle', 'High Angle', 'Bird\'s Eye View', 'Worm\'s Eye View'];
const POSES = ['Standing', 'Sitting', 'Walking', 'Running', 'Posing'];
const BACKGROUNDS = ['Studio', 'Outdoor Nature', 'Urban Cityscape', 'Cyberpunk Street', 'Fantasy Forest', 'Minimalist Interior'];
const ART_STYLES = ['Photorealistic', 'Anime/Manga', 'Oil Painting', 'Digital Illustration', '3D Render', 'Sketch'];
const LIGHTINGS = ['Cinematic', 'Golden Hour', 'Soft Studio', 'Neon/Cyber', 'Natural Sunlight', 'Dramatic Shadows'];
const COLOR_TONES = ['Vibrant', 'Muted/Desaturated', 'Warm', 'Cool', 'Monochrome', 'Sepia'];

export default function App() {
  const [options, setOptions] = useState<PromptOptions>({
    gender: '',
    expression: '',
    shotType: '',
    cameraAngle: '',
    pose: '',
    background: '',
    artStyle: '',
    lighting: '',
    colorTone: '',
    additionalDescription: '',
  });
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [mainImageMimeType, setMainImageMimeType] = useState<string | null>(null);
  const [faceImage, setFaceImage] = useState<string | null>(null);
  const [faceImageMimeType, setFaceImageMimeType] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [copied, setCopied] = useState(false);

  const mainInputRef = useRef<HTMLInputElement>(null);
  const faceInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'main' | 'face') => {
    const file = e.target.files?.[0];
    if (file) {
      // Basic size validation (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size too large. Max 5MB.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'main') {
          setMainImage(reader.result as string);
          setMainImageMimeType(file.type);
        } else {
          setFaceImage(reader.result as string);
          setFaceImageMimeType(file.type);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const resetAll = () => {
    setOptions({
      gender: '',
      expression: '',
      shotType: '',
      cameraAngle: '',
      pose: '',
      background: '',
      artStyle: '',
      lighting: '',
      colorTone: '',
      additionalDescription: '',
    });
    setMainImage(null);
    setMainImageMimeType(null);
    setFaceImage(null);
    setFaceImageMimeType(null);
    setGeneratedPrompt('');
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const result = await generateImagePrompt({
        ...options,
        mainImage: mainImage || undefined,
        mainImageMimeType: mainImageMimeType || undefined,
        faceImage: faceImage || undefined,
        faceImageMimeType: faceImageMimeType || undefined,
      });
      setGeneratedPrompt(result);
    } catch (error) {
      console.error('Error generating prompt:', error);
      setGeneratedPrompt('Error generating prompt. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#1a1c2e] text-white font-sans p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Model Photo Prompt Generator by Donny Trist</h1>
          <p className="text-blue-300/70">Create the AI image prompts you want and customize them as you wish.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Inputs */}
          <div className="bg-[#252845] rounded-xl p-6 shadow-2xl border border-white/5">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span>
                Upload Images & Select Options
              </h2>
              <button 
                onClick={resetAll}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
              >
                <RotateCcw size={14} />
                Reset All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Main Image Upload */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-blue-200">Character Model Image (Required)</label>
                <div className="relative group/img">
                  <div 
                    onClick={() => mainInputRef.current?.click()}
                    className="relative h-48 bg-[#1a1c2e] rounded-lg border-2 border-dashed border-blue-500/30 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500/60 transition-all overflow-hidden"
                  >
                    {mainImage ? (
                      <img src={mainImage} alt="Main" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <Upload className="text-blue-400 mb-2" size={32} />
                        <span className="text-xs text-blue-300">Upload Image</span>
                      </>
                    )}
                  </div>
                  {mainImage && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); setMainImage(null); setMainImageMimeType(null); }}
                      className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-500 rounded-md text-white opacity-0 group-hover/img:opacity-100 transition-opacity"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <input type="file" ref={mainInputRef} className="hidden" onChange={(e) => handleImageUpload(e, 'main')} accept="image/*" />
                <button 
                  onClick={() => mainInputRef.current?.click()}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-500 rounded text-sm font-medium transition-colors"
                >
                  Choose File
                </button>
              </div>

              {/* Face Image Upload */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-blue-200">Specific Face/Head Image (Optional)</label>
                <div className="relative group/img">
                  <div 
                    onClick={() => faceInputRef.current?.click()}
                    className="relative h-48 bg-[#1a1c2e] rounded-lg border-2 border-dashed border-blue-500/30 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500/60 transition-all overflow-hidden"
                  >
                    {faceImage ? (
                      <img src={faceImage} alt="Face" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <User className="text-blue-400 mb-2" size={32} />
                        <span className="text-xs text-blue-300">Optional Face</span>
                      </>
                    )}
                  </div>
                  {faceImage && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); setFaceImage(null); setFaceImageMimeType(null); }}
                      className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-500 rounded-md text-white opacity-0 group-hover/img:opacity-100 transition-opacity"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <input type="file" ref={faceInputRef} className="hidden" onChange={(e) => handleImageUpload(e, 'face')} accept="image/*" />
                <button 
                  onClick={() => faceInputRef.current?.click()}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-500 rounded text-sm font-medium transition-colors"
                >
                  Choose File
                </button>
              </div>
            </div>

            {/* Dropdowns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <SelectGroup label="Gender (Initial Analysis)" options={GENDERS} value={options.gender!} onChange={(v) => setOptions(p => ({...p, gender: v}))} />
              <SelectGroup label="Facial Expression (Initial Analysis)" options={EXPRESSIONS} value={options.expression!} onChange={(v) => setOptions(p => ({...p, expression: v}))} />
              <SelectGroup label="Shot Type (Initial Analysis)" options={SHOT_TYPES} value={options.shotType!} onChange={(v) => setOptions(p => ({...p, shotType: v}))} />
              <SelectGroup label="Camera Angle (Initial Analysis)" options={CAMERA_ANGLES} value={options.cameraAngle!} onChange={(v) => setOptions(p => ({...p, cameraAngle: v}))} />
              <SelectGroup label="Character Pose" options={POSES} value={options.pose!} onChange={(v) => setOptions(p => ({...p, pose: v}))} />
              <SelectGroup label="Background / Location" options={BACKGROUNDS} value={options.background!} onChange={(v) => setOptions(p => ({...p, background: v}))} />
              <SelectGroup label="Art Style" options={ART_STYLES} value={options.artStyle!} onChange={(v) => setOptions(p => ({...p, artStyle: v}))} />
              <SelectGroup label="Lighting" options={LIGHTINGS} value={options.lighting!} onChange={(v) => setOptions(p => ({...p, lighting: v}))} />
              <SelectGroup label="Color Tone" options={COLOR_TONES} value={options.colorTone!} onChange={(v) => setOptions(p => ({...p, colorTone: v}))} />
            </div>

            {/* Additional Description */}
            <div className="space-y-2 mb-8">
              <label className="block text-sm font-medium text-blue-200">Additional Description (Optional, free text)</label>
              <textarea 
                value={options.additionalDescription}
                onChange={(e) => setOptions(p => ({...p, additionalDescription: e.target.value}))}
                placeholder="Contoh: 'The character has long, flowing silver hair, wearing a high-tech exoskeleton suit' atau 'The mood should be melancholic.'"
                className="w-full bg-[#1a1c2e] border border-white/10 rounded-lg p-4 text-sm focus:outline-none focus:border-blue-500 transition-all min-h-[100px] resize-none"
              />
            </div>

            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-lg shadow-blue-900/20"
            >
              {isGenerating ? <RefreshCw className="animate-spin" /> : <Sparkles />}
              {isGenerating ? 'Processing...' : 'Generate Prompt Now'}
            </button>
          </div>

          {/* Right Column: Output */}
          <div className="bg-[#252845] rounded-xl p-6 shadow-2xl border border-white/5 flex flex-col">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span>
              AI Prompt Result (English)
            </h2>

            <div className="flex-1 bg-[#1a1c2e] rounded-xl p-6 border border-white/5 relative group">
              <AnimatePresence mode="wait">
                {generatedPrompt ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-blue-100/90 leading-relaxed font-mono whitespace-pre-wrap"
                  >
                    {generatedPrompt}
                  </motion.div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center text-blue-300/30 space-y-4">
                    <ImageIcon size={48} className="opacity-10" />
                    <p className="text-sm max-w-[250px]">
                      Analysis and customization results will appear here. Prompts are generated in English for best results with generative AI models.
                    </p>
                  </div>
                )}
              </AnimatePresence>

              {generatedPrompt && (
                <button 
                  onClick={copyToClipboard}
                  className="absolute top-4 right-4 p-2 bg-blue-600/20 hover:bg-blue-600/40 rounded-lg transition-all text-blue-400 flex items-center gap-2 text-xs font-bold"
                >
                  {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                  {copied ? 'Copied!' : 'Copy Prompt'}
                </button>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-white/5">
              <p className="text-[10px] text-blue-400/50 font-mono">Model: gemini-3-flash-preview</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SelectGroup({ label, options, value, onChange }: { label: string, options: string[], value: string, onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[11px] font-bold text-blue-300/60 uppercase tracking-wider">{label}</label>
      <div className="relative">
        <select 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-[#1a1c2e] border border-white/10 rounded-lg px-4 py-2.5 text-sm appearance-none focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
        >
          <option value="">Select Option...</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 pointer-events-none" size={16} />
      </div>
    </div>
  );
}
