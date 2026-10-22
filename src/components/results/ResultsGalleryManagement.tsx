import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Eye, 
  MapPin, 
  Calendar, 
  CheckCircle, 
  X, 
  LayoutGrid, 
  List, 
  SplitSquareVertical, 
  ArrowLeftRight, 
  SlidersHorizontal,
  Sparkles,
  Layers,
  Image as ImageIcon
} from 'lucide-react';
import { ResultItem, StatusType } from '../../types';
import { ImageUploadField } from '../common/ImageUploadField';
import { DeleteConfirmModal } from '../common/DeleteConfirmModal';
import { createCleaningSvg } from '../../data/imagePresets';

interface ResultsGalleryManagementProps {
  results: ResultItem[];
  onSaveResult: (result: ResultItem) => void;
  onDeleteResult: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export const ResultsGalleryManagement: React.FC<ResultsGalleryManagementProps> = ({
  results,
  onSaveResult,
  onDeleteResult,
  onToggleStatus
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Slider interactive comparison preview modal
  const [sliderPreviewItem, setSliderPreviewItem] = useState<ResultItem | null>(null);
  const [sliderPosition, setSliderPosition] = useState(50); // percentage 0-100

  // Add / Edit modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResult, setEditingResult] = useState<ResultItem | null>(null);

  // Delete modal
  const [itemToDelete, setItemToDelete] = useState<ResultItem | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    id: string;
    title: string;
    category: string;
    location: string;
    description: string;
    beforeImageUrl: string;
    afterImageUrl: string;
    additionalImages: string[];
    completionDate: string;
    displayOrder: number;
    status: StatusType;
  }>({
    id: '',
    title: '',
    category: 'Kitchen Deep Cleaning',
    location: '',
    description: '',
    beforeImageUrl: '',
    afterImageUrl: '',
    additionalImages: [],
    completionDate: '2026-10-12',
    displayOrder: 1,
    status: 'published'
  });

  const categories = [
    'Kitchen Deep Cleaning',
    'Home Deep Cleaning',
    'Bathroom Cleaning',
    'Office Cleaning',
    'Restaurant Cleaning',
    'Upholstery & Carpet',
    'Commercial & Industrial'
  ];

  const openAddModal = () => {
    setEditingResult(null);
    setFormData({
      id: `res-${Date.now()}`,
      title: '',
      category: 'Kitchen Deep Cleaning',
      location: 'Mumbai, Maharashtra',
      description: '',
      beforeImageUrl: createCleaningSvg('Kitchen', 'Greasy Surface & Stains', 'Before Cleaning', true),
      afterImageUrl: createCleaningSvg('Kitchen', 'Pristine Sanitized Sheen', 'After Cleaning', false),
      additionalImages: [],
      completionDate: new Date().toISOString().split('T')[0],
      displayOrder: results.length + 1,
      status: 'published'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: ResultItem) => {
    setEditingResult(item);
    setFormData({
      id: item.id,
      title: item.title,
      category: item.category,
      location: item.location,
      description: item.description,
      beforeImageUrl: item.beforeImageUrl,
      afterImageUrl: item.afterImageUrl,
      additionalImages: item.additionalImages ? [...item.additionalImages] : [],
      completionDate: item.completionDate,
      displayOrder: item.displayOrder,
      status: item.status
    });
    setIsModalOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const resultToSave: ResultItem = {
      id: formData.id,
      title: formData.title.trim(),
      category: formData.category,
      location: formData.location.trim() || 'Pan-India',
      description: formData.description.trim(),
      beforeImageUrl: formData.beforeImageUrl,
      afterImageUrl: formData.afterImageUrl,
      additionalImages: formData.additionalImages,
      completionDate: formData.completionDate,
      displayOrder: Number(formData.displayOrder) || 1,
      status: formData.status,
      createdAt: editingResult?.createdAt || new Date().toISOString().split('T')[0]
    };

    onSaveResult(resultToSave);
    setIsModalOpen(false);
  };

  const filteredResults = results.filter((res) => {
    const matchesSearch = res.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || res.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || res.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  }).sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-[#171717]">
              Results Gallery
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-[#E31B23]">
              TRANSFORMATION SHOWCASE
            </span>
          </div>
          <p className="text-xs text-[#666666] mt-0.5">
            Manage real before-and-after cleaning transformations displayed to customers on the public website
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-[#E31B23] hover:bg-[#c9151c] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Result
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#EAEAEA] rounded-2xl p-3 sm:p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by project title, location (e.g. Bandra, Gurugram), description..."
              className="w-full pl-9 pr-4 py-2 text-xs border border-[#EAEAEA] rounded-xl focus:outline-none focus:border-[#E31B23] bg-[#F7F7F7]/50"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Category Select */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold bg-[#F7F7F7] border border-[#EAEAEA] rounded-xl focus:outline-none text-[#171717]"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {/* Status Tabs */}
            <div className="flex items-center p-1 bg-[#F7F7F7] border border-[#EAEAEA] rounded-xl text-xs">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  statusFilter === 'all' ? 'bg-white text-[#171717] shadow-xs' : 'text-[#666666]'
                }`}
              >
                All ({results.length})
              </button>
              <button
                onClick={() => setStatusFilter('published')}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  statusFilter === 'published' ? 'bg-white text-emerald-800 shadow-xs' : 'text-[#666666]'
                }`}
              >
                Live ({results.filter(r => r.status === 'published').length})
              </button>
              <button
                onClick={() => setStatusFilter('draft')}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  statusFilter === 'draft' ? 'bg-white text-gray-800 shadow-xs' : 'text-[#666666]'
                }`}
              >
                Draft ({results.filter(r => r.status === 'draft').length})
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center p-1 bg-[#F7F7F7] border border-[#EAEAEA] rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-white shadow-xs text-[#171717]' : 'text-gray-400'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'list' ? 'bg-white shadow-xs text-[#171717]' : 'text-gray-400'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Listing */}
      {filteredResults.length === 0 ? (
        <div className="bg-white border border-[#EAEAEA] rounded-2xl p-12 text-center shadow-xs">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto text-[#E31B23] mb-3">
            <SplitSquareVertical className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-[#171717]">No transformation results found</h3>
          <p className="text-xs text-[#666666] mt-1 max-w-sm mx-auto">
            Try adjusting filters or publish your first before &amp; after comparison project.
          </p>
          <button
            onClick={openAddModal}
            className="mt-4 px-4 py-2 bg-[#E31B23] text-white text-xs font-bold rounded-xl hover:bg-[#c9151c] transition-colors cursor-pointer"
          >
            Add First Transformation
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredResults.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-[#EAEAEA] rounded-2xl overflow-hidden shadow-xs hover:border-gray-300 transition-all flex flex-col group"
            >
              {/* Attractive Before & After Side-By-Side Preview */}
              <div className="relative bg-gray-900 border-b border-[#EAEAEA] overflow-hidden">
                <div className="grid grid-cols-2 divide-x divide-white/20">
                  {/* Before Frame */}
                  <div className="relative aspect-4/3 overflow-hidden bg-stone-900">
                    <img
                      src={item.beforeImageUrl}
                      alt={`Before - ${item.title}`}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-red-600 text-white shadow-xs">
                        BEFORE
                      </span>
                    </div>
                  </div>

                  {/* After Frame */}
                  <div className="relative aspect-4/3 overflow-hidden bg-sky-950">
                    <img
                      src={item.afterImageUrl}
                      alt={`After - ${item.title}`}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-emerald-600 text-white shadow-xs">
                        AFTER
                      </span>
                    </div>
                  </div>
                </div>

                {/* Interactive Split Slider Overlay Button */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10">
                  <button
                    onClick={() => {
                      setSliderPreviewItem(item);
                      setSliderPosition(50);
                    }}
                    className="px-3 py-1 bg-black/80 hover:bg-black text-white text-[11px] font-bold rounded-full backdrop-blur-md shadow-lg border border-white/20 flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105"
                  >
                    <ArrowLeftRight className="w-3 h-3 text-[#E31B23]" />
                    Interactive Slider View
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold text-[#E31B23] uppercase tracking-wider">
                      {item.category}
                    </span>
                    <button
                      onClick={() => onToggleStatus(item.id)}
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full cursor-pointer transition-colors ${
                        item.status === 'published'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-gray-100 text-gray-600 border border-gray-200'
                      }`}
                    >
                      {item.status === 'published' ? 'Live on Site' : 'Draft'}
                    </button>
                  </div>

                  <h3 className="text-sm font-bold text-[#171717] mt-1.5 line-clamp-1 group-hover:text-[#E31B23] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#666666] mt-1.5 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-[#EAEAEA] flex items-center justify-between text-xs text-[#666666]">
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 text-gray-500 font-mono text-[11px]">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span>{item.completionDate}</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="mt-4 pt-3 border-t border-[#EAEAEA] flex items-center justify-between">
                  <span className="text-[11px] font-mono text-gray-400">
                    Display Order #{item.displayOrder}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal(item)}
                      className="px-2.5 py-1 text-xs font-semibold text-[#171717] hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-gray-500" />
                      Edit Result
                    </button>
                    <button
                      onClick={() => setItemToDelete(item)}
                      className="p-1.5 text-gray-400 hover:text-[#E31B23] hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete result"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-white border border-[#EAEAEA] rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F7F7] border-b border-[#EAEAEA] text-[#666666] font-bold">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4">Before / After Preview</th>
                  <th className="py-3 px-4">Project Title</th>
                  <th className="py-3 px-4">Location &amp; Category</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAEAEA]">
                {filteredResults.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-center text-gray-500">
                      {item.displayOrder}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <div className="w-10 h-8 rounded bg-gray-200 border border-red-300 overflow-hidden relative" title="Before">
                          <img src={item.beforeImageUrl} alt="Before" className="w-full h-full object-cover" />
                          <span className="absolute bottom-0 left-0 text-[8px] bg-red-600 text-white px-0.5 font-bold">B</span>
                        </div>
                        <span className="text-gray-300 font-bold">→</span>
                        <div className="w-10 h-8 rounded bg-gray-200 border border-emerald-300 overflow-hidden relative" title="After">
                          <img src={item.afterImageUrl} alt="After" className="w-full h-full object-cover" />
                          <span className="absolute bottom-0 right-0 text-[8px] bg-emerald-600 text-white px-0.5 font-bold">A</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-[#171717]">{item.title}</p>
                      <p className="text-[11px] text-[#666666] line-clamp-1 max-w-xs">{item.description}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-[#171717]">{item.location}</span>
                      <span className="block text-[11px] text-[#E31B23] font-semibold">{item.category}</span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-500 font-mono text-[11px]">
                      {item.completionDate}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => onToggleStatus(item.id)}
                        className={`px-2 py-0.5 rounded-full text-[11px] font-bold cursor-pointer ${
                          item.status === 'published'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-gray-100 text-gray-600 border border-gray-200'
                        }`}
                      >
                        {item.status === 'published' ? 'Live' : 'Draft'}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSliderPreviewItem(item);
                            setSliderPosition(50);
                          }}
                          className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                          title="Interactive Slider Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setItemToDelete(item)}
                          className="p-1.5 text-gray-400 hover:text-[#E31B23] hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Interactive Drag Before/After Slider Modal */}
      {sliderPreviewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-[#EAEAEA] shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-[#EAEAEA] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#171717] flex items-center gap-2">
                  <span>Transformation Comparison</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-[#E31B23]">
                    {sliderPreviewItem.category}
                  </span>
                </h3>
                <p className="text-xs text-[#666666] mt-0.5">
                  {sliderPreviewItem.title} · {sliderPreviewItem.location}
                </p>
              </div>
              <button
                onClick={() => setSliderPreviewItem(null)}
                className="p-1.5 text-gray-400 hover:text-black rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {/* Interactive Split Canvas */}
              <div className="relative aspect-4/3 w-full rounded-xl overflow-hidden shadow-inner border border-gray-200 select-none bg-black">
                {/* AFTER Image (Full background) */}
                <img
                  src={sliderPreviewItem.afterImageUrl}
                  alt="After"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <span className="absolute top-4 right-4 z-10 px-2.5 py-1 rounded-md text-xs font-black bg-emerald-600 text-white shadow-md">
                  AFTER CLEANING
                </span>

                {/* BEFORE Image (Clipped on top according to slider) */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${sliderPosition}%` }}
                >
                  <img
                    src={sliderPreviewItem.beforeImageUrl}
                    alt="Before"
                    className="absolute inset-0 w-full h-full object-cover max-w-none"
                    style={{ width: '100%', height: '100%' }}
                  />
                  <span className="absolute top-4 left-4 z-10 px-2.5 py-1 rounded-md text-xs font-black bg-red-600 text-white shadow-md">
                    BEFORE CLEANING
                  </span>
                </div>

                {/* Vertical Divider line */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl z-20 pointer-events-none"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-lg border border-gray-300 flex items-center justify-center text-gray-800">
                    <ArrowLeftRight className="w-4 h-4 text-[#E31B23]" />
                  </div>
                </div>
              </div>

              {/* Slider Controller */}
              <div className="mt-5 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-[#E31B23]">← 100% Dirty / Before</span>
                  <span className="text-[#666666]">Drag slider to inspect finish</span>
                  <span className="text-emerald-700">100% Cleaned / After →</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderPosition}
                  onChange={(e) => setSliderPosition(Number(e.target.value))}
                  className="w-full accent-[#E31B23] cursor-pointer"
                />
              </div>

              <div className="mt-4 p-3 bg-[#F7F7F7] rounded-xl border border-[#EAEAEA] text-xs text-[#666666]">
                <p className="font-semibold text-[#171717]">{sliderPreviewItem.title}</p>
                <p className="mt-1 leading-relaxed">{sliderPreviewItem.description}</p>
              </div>
            </div>

            <div className="p-4 border-t border-[#EAEAEA] bg-gray-50 flex items-center justify-end">
              <button
                onClick={() => setSliderPreviewItem(null)}
                className="px-4 py-2 text-xs font-semibold bg-[#171717] text-white rounded-xl hover:bg-black transition-colors cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Result Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl border border-[#EAEAEA] shadow-2xl max-w-xl w-full my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-[#EAEAEA] flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#171717]">
                  {editingResult ? 'Edit Cleaning Transformation' : 'Add Before & After Transformation'}
                </h3>
                <p className="text-xs text-[#666666]">
                  Upload high-impact transformation imagery for customer proof
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-black rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Heavy Kitchen Chimney Carbon & Grease Extraction"
                  className="w-full px-3.5 py-2.5 text-xs border border-[#EAEAEA] rounded-xl focus:outline-none focus:border-[#E31B23]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#171717] mb-1">
                    Project Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs border border-[#EAEAEA] rounded-xl focus:outline-none focus:border-[#E31B23] bg-white"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#171717] mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Bandra West, Mumbai"
                    className="w-full px-3.5 py-2.5 text-xs border border-[#EAEAEA] rounded-xl focus:outline-none focus:border-[#E31B23]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#171717] mb-1">
                    Completion Date
                  </label>
                  <input
                    type="date"
                    value={formData.completionDate}
                    onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs border border-[#EAEAEA] rounded-xl focus:outline-none focus:border-[#E31B23]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#171717] mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 text-xs font-mono border border-[#EAEAEA] rounded-xl focus:outline-none focus:border-[#E31B23]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detail the surface condition, chemicals/machinery applied, and the achieved cleanliness standard..."
                  className="w-full px-3.5 py-2.5 text-xs border border-[#EAEAEA] rounded-xl focus:outline-none focus:border-[#E31B23]"
                />
              </div>

              {/* DUAL BEFORE & AFTER UPLOADS */}
              <div className="p-4 bg-[#F7F7F7] border border-[#EAEAEA] rounded-2xl space-y-4">
                <div className="flex items-center gap-2">
                  <SplitSquareVertical className="w-4 h-4 text-[#E31B23]" />
                  <span className="text-xs font-bold text-[#171717]">
                    Dual Comparison Images
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Before Upload */}
                  <ImageUploadField
                    label="1. Before Cleaning Image *"
                    value={formData.beforeImageUrl}
                    onChange={(url) => setFormData({ ...formData, beforeImageUrl: url })}
                    presetType="before"
                    bucket="results"
                  />

                  {/* After Upload */}
                  <ImageUploadField
                    label="2. After Cleaning Image *"
                    value={formData.afterImageUrl}
                    onChange={(url) => setFormData({ ...formData, afterImageUrl: url })}
                    presetType="after"
                    bucket="results"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">
                  Website Display Status
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-xs text-[#171717] cursor-pointer">
                    <input
                      type="radio"
                      name="res-status"
                      value="published"
                      checked={formData.status === 'published'}
                      onChange={() => setFormData({ ...formData, status: 'published' })}
                      className="accent-[#E31B23]"
                    />
                    Published (Visible in Public Results Gallery)
                  </label>
                  <label className="flex items-center gap-2 text-xs text-[#171717] cursor-pointer">
                    <input
                      type="radio"
                      name="res-status"
                      value="draft"
                      checked={formData.status === 'draft'}
                      onChange={() => setFormData({ ...formData, status: 'draft' })}
                      className="accent-[#E31B23]"
                    />
                    Draft (Internal Preview Only)
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-[#EAEAEA] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-[#171717] bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-[#E31B23] hover:bg-[#c9151c] rounded-xl transition-colors shadow-xs cursor-pointer"
                >
                  {editingResult ? 'Save Changes' : 'Create Result'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!itemToDelete}
        title="Delete Cleaning Result"
        itemName={itemToDelete?.title || ''}
        onCancel={() => setItemToDelete(null)}
        onConfirm={() => {
          if (itemToDelete) {
            onDeleteResult(itemToDelete.id);
            setItemToDelete(null);
          }
        }}
      />
    </div>
  );
};
