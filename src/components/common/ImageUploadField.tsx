import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, X, Sparkles, Check, Loader2, CloudUpload } from 'lucide-react';
import { createCleaningSvg, createProductSvg, createPackageSvg } from '../../data/imagePresets';
import { uploadImageToStorage, StorageBucket, isSupabaseConfigured } from '../../lib/supabase';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  presetType?: 'package' | 'product' | 'service' | 'before' | 'after';
  aspectRatio?: '4:3' | '16:9' | '1:1';
  bucket?: StorageBucket;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  value,
  onChange,
  presetType = 'package',
  aspectRatio = '4:3',
  bucket
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPresets, setShowPresets] = useState(false);
  const [isUrlMode, setIsUrlMode] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadNotice(null);

    // If bucket is provided, upload via Supabase storage helper (which handles auth/fallback automatically)
    if (bucket) {
      try {
        setIsUploading(true);
        const result = await uploadImageToStorage(bucket, file, presetType);
        if (result.publicUrl) {
          onChange(result.publicUrl);
        }
        if (result.isLocalFallback && result.message) {
          setUploadNotice(result.message);
        }
        setIsUploading(false);
        return;
      } catch (err: any) {
        // Fallback to local FileReader so user interaction is never interrupted
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            onChange(reader.result);
          }
          setIsUploading(false);
        };
        reader.readAsDataURL(file);
        setUploadNotice('Image loaded locally in preview.');
        return;
      }
    }

    // Default local FileReader reader
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        onChange(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const samplePresets = [
    {
      title: 'Kitchen Cleaned',
      url: createCleaningSvg('Kitchen', 'Pristine Kitchen Counter & Hob', 'Degreased & Sanitized', false)
    },
    {
      title: 'Kitchen Dirty (Before)',
      url: createCleaningSvg('Kitchen', 'Heavy Oil & Grease Sludge', 'Exhaust & Burners Stained', true)
    },
    {
      title: 'Bathroom Cleaned',
      url: createCleaningSvg('Bathroom', 'Diamond Shine Tiles & Faucets', 'Limescale Fully Eradicated', false)
    },
    {
      title: 'Bathroom Scale (Before)',
      url: createCleaningSvg('Bathroom', 'Severe Calcium & Hard Water Scale', 'Stained Tiles & Fixtures', true)
    },
    {
      title: 'Sofa / Carpet Restored',
      url: createCleaningSvg('Living Room', 'Sanitized Upholstery Fabric', 'Spotless & Odor-Free', false)
    },
    {
      title: 'Sofa Stained (Before)',
      url: createCleaningSvg('Living Room', 'Water Rings & Dirt Marks', 'Deep Fiber Soil Residue', true)
    },
    {
      title: '2 BHK Apartment Plan',
      url: createPackageSvg('2 BHK', '950 sq.ft')
    },
    {
      title: 'Chemical Degreaser Product',
      url: createProductSvg('Devil Max Degreaser', 'Heavy Duty Cleaner', '#E31B23')
    }
  ];

  const isStorageUrl = value && value.includes('supabase.co/storage');

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-[#171717]">{label}</label>
        <div className="flex items-center gap-2">
          {bucket && (
            <span className="text-[10px] text-gray-400 font-mono">
              bucket: {bucket}
            </span>
          )}
          <span className="text-gray-300">·</span>
          <button
            type="button"
            onClick={() => setShowPresets(!showPresets)}
            className="text-[11px] font-medium text-[#E31B23] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3 h-3" />
            {showPresets ? 'Hide Presets' : 'Sample Presets'}
          </button>
          <span className="text-gray-300">·</span>
          <button
            type="button"
            onClick={() => setIsUrlMode(!isUrlMode)}
            className="text-[11px] font-medium text-gray-500 hover:text-gray-800 cursor-pointer"
          >
            {isUrlMode ? 'Upload Mode' : 'Direct URL'}
          </button>
        </div>
      </div>

      {uploadNotice && (
        <div className="p-2 bg-amber-50/80 border border-amber-200 text-amber-800 text-[11px] rounded-lg flex items-center justify-between">
          <span>{uploadNotice}</span>
          <button
            type="button"
            onClick={() => setUploadNotice(null)}
            className="text-amber-600 hover:text-amber-900 ml-2 font-bold cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

      {showPresets && (
        <div className="p-3 bg-[#F7F7F7] border border-[#EAEAEA] rounded-xl grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2 animate-in fade-in duration-150">
          {samplePresets.map((preset, idx) => (
            <button
              type="button"
              key={idx}
              onClick={() => {
                onChange(preset.url);
                setShowPresets(false);
              }}
              className="text-left p-1.5 bg-white border border-[#EAEAEA] hover:border-[#E31B23] rounded-lg transition-all group cursor-pointer"
            >
              <div className="aspect-4/3 w-full rounded overflow-hidden bg-gray-100 border border-gray-100 mb-1">
                <img
                  src={preset.url}
                  alt={preset.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <p className="text-[10px] font-medium text-[#171717] truncate">{preset.title}</p>
            </button>
          ))}
        </div>
      )}

      {isUrlMode ? (
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Paste image URL (https://... or data:...)"
            className="flex-1 px-3 py-2 text-xs border border-[#EAEAEA] rounded-lg focus:outline-none focus:border-[#E31B23] bg-white text-[#171717]"
          />
          <button
            type="button"
            onClick={() => {
              if (urlInput.trim()) {
                onChange(urlInput.trim());
                setUrlInput('');
                setIsUrlMode(false);
              }
            }}
            className="px-3 py-2 text-xs font-semibold bg-[#171717] text-white rounded-lg hover:bg-black cursor-pointer"
          >
            Apply
          </button>
        </div>
      ) : null}

      {isUploading ? (
        <div className="border border-[#EAEAEA] rounded-xl p-8 bg-white flex flex-col items-center justify-center text-center">
          <Loader2 className="w-8 h-8 text-[#E31B23] animate-spin mb-2" />
          <p className="text-xs font-bold text-[#171717]">Uploading to Supabase Storage...</p>
          <p className="text-[11px] text-[#666666] mt-0.5">Bucket: {bucket}</p>
        </div>
      ) : value ? (
        <div className="relative group border border-[#EAEAEA] rounded-xl overflow-hidden bg-white shadow-xs">
          <div className="aspect-16/9 sm:aspect-4/3 w-full max-h-48 flex items-center justify-center bg-gray-50 overflow-hidden">
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-2.5 flex items-center justify-between bg-white border-t border-[#EAEAEA]">
            <span className="text-[11px] text-emerald-700 flex items-center gap-1 font-medium">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              {isStorageUrl ? 'Uploaded to Supabase Storage' : 'Image Loaded'}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1 text-[11px] font-medium text-gray-700 hover:text-black bg-gray-100 hover:bg-gray-200 rounded-md transition-colors cursor-pointer"
              >
                Change Image
              </button>
              <button
                type="button"
                onClick={() => onChange('')}
                className="p-1 text-gray-400 hover:text-[#E31B23] transition-colors cursor-pointer"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-[#EAEAEA] hover:border-[#E31B23] bg-[#F7F7F7]/60 hover:bg-red-50/20 rounded-xl p-5 text-center cursor-pointer transition-all duration-150"
        >
          <div className="w-10 h-10 mx-auto rounded-full bg-white shadow-xs border border-[#EAEAEA] flex items-center justify-center text-gray-500 mb-2">
            {bucket ? (
              <CloudUpload className="w-5 h-5 text-[#E31B23]" />
            ) : (
              <Upload className="w-5 h-5 text-[#E31B23]" />
            )}
          </div>
          <p className="text-xs font-semibold text-[#171717]">
            Click to upload image or drag &amp; drop
          </p>
          <p className="text-[11px] text-[#666666] mt-0.5">
            {bucket ? `Uploads directly to Supabase "${bucket}" bucket` : 'PNG, JPG, WebP or SVG'}
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};
