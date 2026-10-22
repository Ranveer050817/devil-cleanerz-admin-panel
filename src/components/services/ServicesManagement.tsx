import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  X, 
  Check, 
  Sparkles, 
  CheckCircle, 
  LayoutGrid, 
  List, 
  Building2, 
  Home, 
  ArrowRight
} from 'lucide-react';
import { CleaningService, StatusType } from '../../types';
import { serviceCategoryOptions } from '../../data/initialData';
import { ImageUploadField } from '../common/ImageUploadField';
import { DeleteConfirmModal } from '../common/DeleteConfirmModal';

interface ServicesManagementProps {
  services: CleaningService[];
  onSaveService: (service: CleaningService) => void;
  onDeleteService: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export const ServicesManagement: React.FC<ServicesManagementProps> = ({
  services,
  onSaveService,
  onDeleteService,
  onToggleStatus
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sectorFilter, setSectorFilter] = useState<'all' | 'residential' | 'commercial'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<CleaningService | null>(null);

  // Delete modal
  const [itemToDelete, setItemToDelete] = useState<CleaningService | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    id: string;
    name: string;
    category: string;
    description: string;
    imageUrl: string;
    inclusions: string[];
    displayOrder: number;
    status: StatusType;
  }>({
    id: '',
    name: '',
    category: 'Home Deep Cleaning',
    description: '',
    imageUrl: '',
    inclusions: ['Single disc mechanized rotary scrub', 'Deep sanitization with Taski chemicals'],
    displayOrder: 1,
    status: 'published'
  });

  const [newInclusionText, setNewInclusionText] = useState('');
  const [editingInclusionIndex, setEditingInclusionIndex] = useState<number | null>(null);
  const [editingInclusionValue, setEditingInclusionValue] = useState('');

  const commercialCategories = ['Office Cleaning', 'Hotel Cleaning', 'Restaurant Cleaning', 'Shop Cleaning', 'Warehouse Cleaning', 'Resort Cleaning'];

  const isCommercial = (cat: string) => commercialCategories.includes(cat);

  const openAddModal = () => {
    setEditingService(null);
    setFormData({
      id: `srv-${Date.now()}`,
      name: '',
      category: 'Home Deep Cleaning',
      description: '',
      imageUrl: '',
      inclusions: ['Mechanized surface scrubbing', 'Sanitization with eco-friendly solutions', 'Dry & wet dust extraction'],
      displayOrder: services.length + 1,
      status: 'published'
    });
    setNewInclusionText('');
    setEditingInclusionIndex(null);
    setIsModalOpen(true);
  };

  const openEditModal = (service: CleaningService) => {
    setEditingService(service);
    setFormData({
      id: service.id,
      name: service.name,
      category: service.category,
      description: service.description,
      imageUrl: service.imageUrl,
      inclusions: [...service.inclusions],
      displayOrder: service.displayOrder,
      status: service.status
    });
    setNewInclusionText('');
    setEditingInclusionIndex(null);
    setIsModalOpen(true);
  };

  const handleAddInclusion = () => {
    if (newInclusionText.trim()) {
      setFormData(prev => ({
        ...prev,
        inclusions: [...prev.inclusions, newInclusionText.trim()]
      }));
      setNewInclusionText('');
    }
  };

  const handleRemoveInclusion = (index: number) => {
    setFormData(prev => ({
      ...prev,
      inclusions: prev.inclusions.filter((_, i) => i !== index)
    }));
  };

  const startEditInclusion = (index: number, val: string) => {
    setEditingInclusionIndex(index);
    setEditingInclusionValue(val);
  };

  const saveEditInclusion = () => {
    if (editingInclusionIndex !== null && editingInclusionValue.trim()) {
      setFormData(prev => {
        const next = [...prev.inclusions];
        next[editingInclusionIndex] = editingInclusionValue.trim();
        return { ...prev, inclusions: next };
      });
      setEditingInclusionIndex(null);
      setEditingInclusionValue('');
    }
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const srvToSave: CleaningService = {
      id: formData.id,
      name: formData.name.trim(),
      category: formData.category,
      description: formData.description.trim(),
      imageUrl: formData.imageUrl,
      inclusions: formData.inclusions,
      displayOrder: Number(formData.displayOrder) || 1,
      status: formData.status,
      createdAt: editingService?.createdAt || new Date().toISOString().split('T')[0]
    };

    onSaveService(srvToSave);
    setIsModalOpen(false);
  };

  const filteredServices = services.filter((srv) => {
    const matchesSearch = srv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      srv.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      srv.inclusions.some(inc => inc.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = categoryFilter === 'all' || srv.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || srv.status === statusFilter;
    
    const isComm = isCommercial(srv.category);
    const matchesSector = sectorFilter === 'all' || 
      (sectorFilter === 'commercial' && isComm) || 
      (sectorFilter === 'residential' && !isComm);

    return matchesSearch && matchesCategory && matchesStatus && matchesSector;
  }).sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#171717]">
            Cleaning Services &amp; Inclusions
          </h2>
          <p className="text-xs text-[#666666]">
            Configure residential and commercial service scopes with dynamic, itemized inclusions
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-[#E31B23] hover:bg-[#c9151c] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Service
        </button>
      </div>

      {/* Sector filter tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setSectorFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            sectorFilter === 'all'
              ? 'bg-[#171717] text-white shadow-xs'
              : 'bg-white text-[#666666] border border-[#EAEAEA] hover:text-[#171717]'
          }`}
        >
          All Services ({services.length})
        </button>
        <button
          onClick={() => setSectorFilter('residential')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            sectorFilter === 'residential'
              ? 'bg-[#E31B23] text-white shadow-xs'
              : 'bg-white text-[#666666] border border-[#EAEAEA] hover:text-[#171717]'
          }`}
        >
          <Home className="w-3.5 h-3.5" />
          Residential Services ({services.filter(s => !isCommercial(s.category)).length})
        </button>
        <button
          onClick={() => setSectorFilter('commercial')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            sectorFilter === 'commercial'
              ? 'bg-[#0f172a] text-white shadow-xs'
              : 'bg-white text-[#666666] border border-[#EAEAEA] hover:text-[#171717]'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          Commercial &amp; Enterprise ({services.filter(s => isCommercial(s.category)).length})
        </button>
      </div>

      {/* Filters row */}
      <div className="bg-white border border-[#EAEAEA] rounded-2xl p-3 sm:p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search service name, description or inclusions..."
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
            {/* Category dropdown */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold bg-[#F7F7F7] border border-[#EAEAEA] rounded-xl focus:outline-none text-[#171717]"
            >
              <option value="all">All 10 Categories</option>
              {serviceCategoryOptions.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {/* Status Filter */}
            <div className="flex items-center p-1 bg-[#F7F7F7] border border-[#EAEAEA] rounded-xl text-xs">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  statusFilter === 'all' ? 'bg-white text-[#171717] shadow-xs' : 'text-[#666666]'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('published')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  statusFilter === 'published' ? 'bg-white text-emerald-800 shadow-xs' : 'text-[#666666]'
                }`}
              >
                Live
              </button>
              <button
                onClick={() => setStatusFilter('draft')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  statusFilter === 'draft' ? 'bg-white text-gray-800 shadow-xs' : 'text-[#666666]'
                }`}
              >
                Draft
              </button>
            </div>

            {/* View Mode */}
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

      {/* Services Grid / List */}
      {filteredServices.length === 0 ? (
        <div className="bg-white border border-[#EAEAEA] rounded-2xl p-12 text-center shadow-xs">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-400 mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-[#171717]">No services found</h3>
          <p className="text-xs text-[#666666] mt-1 max-w-sm mx-auto">
            Try switching between residential and commercial tabs or clear your search term.
          </p>
          <button
            onClick={openAddModal}
            className="mt-4 px-4 py-2 bg-[#E31B23] text-white text-xs font-bold rounded-xl hover:bg-[#c9151c] transition-colors cursor-pointer"
          >
            Create New Service
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredServices.map((srv) => {
            const comm = isCommercial(srv.category);
            return (
              <div
                key={srv.id}
                className="bg-white border border-[#EAEAEA] rounded-2xl overflow-hidden shadow-xs hover:border-gray-300 transition-all flex flex-col group"
              >
                <div className="relative aspect-16/9 bg-gray-50 border-b border-[#EAEAEA] overflow-hidden">
                  <img
                    src={srv.imageUrl}
                    alt={srv.name}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs text-white ${
                      comm ? 'bg-slate-900/85' : 'bg-[#E31B23]/90'
                    }`}>
                      {comm ? 'Commercial' : 'Residential'}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() => onToggleStatus(srv.id)}
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full cursor-pointer ${
                        srv.status === 'published' ? 'bg-emerald-600 text-white' : 'bg-gray-700 text-white'
                      }`}
                    >
                      {srv.status === 'published' ? 'Live' : 'Draft'}
                    </button>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">
                      {srv.category}
                    </span>
                    <h3 className="text-sm font-bold text-[#171717] mt-1 group-hover:text-[#E31B23] transition-colors">
                      {srv.name}
                    </h3>
                    <p className="text-xs text-[#666666] mt-1.5 line-clamp-2 leading-relaxed">
                      {srv.description}
                    </p>

                    {/* Inclusions list */}
                    <div className="mt-4 pt-3 border-t border-[#EAEAEA]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                          Inclusions ({srv.inclusions.length})
                        </span>
                      </div>
                      <ul className="space-y-1.5">
                        {srv.inclusions.slice(0, 3).map((inc, i) => (
                          <li key={i} className="text-xs text-[#171717] flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{inc}</span>
                          </li>
                        ))}
                        {srv.inclusions.length > 3 && (
                          <li className="text-[11px] text-[#666666] pl-5 font-medium">
                            +{srv.inclusions.length - 3} more items included
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-[#EAEAEA] flex items-center justify-between">
                    <span className="text-[11px] text-gray-400 font-mono">
                      Priority #{srv.displayOrder}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEditModal(srv)}
                        className="px-2.5 py-1 text-xs font-semibold text-[#171717] hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-gray-500" />
                        Edit
                      </button>
                      <button
                        onClick={() => setItemToDelete(srv)}
                        className="p-1 text-gray-400 hover:text-[#E31B23] hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete service"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-white border border-[#EAEAEA] rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F7F7] border-b border-[#EAEAEA] text-[#666666] font-bold">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Inclusions Count</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAEAEA]">
                {filteredServices.map((srv) => (
                  <tr key={srv.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-center text-gray-500">
                      {srv.displayOrder}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 border border-[#EAEAEA] overflow-hidden shrink-0">
                          <img
                            src={srv.imageUrl}
                            alt={srv.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-[#171717]">{srv.name}</p>
                          <p className="text-[11px] text-[#666666] line-clamp-1 max-w-sm">
                            {srv.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-[#171717]">{srv.category}</span>
                      <span className="block text-[11px] text-gray-400">
                        {isCommercial(srv.category) ? 'Commercial' : 'Residential'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#666666]">
                      <span className="font-semibold text-[#171717]">{srv.inclusions.length} items</span>
                      <span className="block text-[11px] text-gray-400 truncate max-w-xs">
                        {srv.inclusions.join(' • ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => onToggleStatus(srv.id)}
                        className={`px-2 py-0.5 rounded-full text-[11px] font-bold cursor-pointer ${
                          srv.status === 'published'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-gray-100 text-gray-600 border border-gray-200'
                        }`}
                      >
                        {srv.status === 'published' ? 'Live' : 'Draft'}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(srv)}
                          className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setItemToDelete(srv)}
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

      {/* Add / Edit Service Modal with Dynamic Inclusions */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl border border-[#EAEAEA] shadow-2xl max-w-xl w-full my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-[#EAEAEA] flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#171717]">
                  {editingService ? 'Edit Service & Scope' : 'Add Specialized Cleaning Service'}
                </h3>
                <p className="text-xs text-[#666666]">
                  Specify category, detailed inclusions, and display priority
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
                  Service Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Commercial Restaurant Kitchen Cleaning"
                  className="w-full px-3.5 py-2.5 text-xs border border-[#EAEAEA] rounded-xl focus:outline-none focus:border-[#E31B23]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#171717] mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs border border-[#EAEAEA] rounded-xl focus:outline-none focus:border-[#E31B23] bg-white"
                  >
                    {serviceCategoryOptions.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
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
                  Service Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Comprehensive scope of what the cleaning team executes on site..."
                  className="w-full px-3.5 py-2.5 text-xs border border-[#EAEAEA] rounded-xl focus:outline-none focus:border-[#E31B23]"
                />
              </div>

              <ImageUploadField
                label="Service Cover Photo"
                value={formData.imageUrl}
                onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                presetType="service"
                bucket="services"
              />

              {/* Dynamic Inclusions Editor */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-[#171717]">
                    List of Service Inclusions ({formData.inclusions.length})
                  </label>
                  <span className="text-[11px] text-gray-500 font-medium">
                    Editable &amp; Removable
                  </span>
                </div>

                {/* List */}
                <div className="space-y-2 mb-3">
                  {formData.inclusions.map((inclusion, index) => (
                    <div
                      key={index}
                      className="p-2.5 bg-[#F7F7F7] border border-[#EAEAEA] rounded-xl text-xs flex items-center justify-between gap-2"
                    >
                      {editingInclusionIndex === index ? (
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="text"
                            value={editingInclusionValue}
                            onChange={(e) => setEditingInclusionValue(e.target.value)}
                            className="flex-1 px-2.5 py-1 text-xs border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-[#E31B23]"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={saveEditInclusion}
                            className="px-2 py-1 text-xs font-bold bg-[#E31B23] text-white rounded-md cursor-pointer"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingInclusionIndex(null)}
                            className="text-gray-400 hover:text-black p-1 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-start gap-2 flex-1">
                            <span className="w-4 h-4 rounded-full bg-red-100 text-[#E31B23] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                              {index + 1}
                            </span>
                            <span className="text-[#171717]">{inclusion}</span>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => startEditInclusion(index, inclusion)}
                              className="p-1 text-gray-400 hover:text-[#171717] transition-colors cursor-pointer"
                              title="Edit inclusion"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveInclusion(index)}
                              className="p-1 text-gray-400 hover:text-[#E31B23] transition-colors cursor-pointer"
                              title="Delete inclusion"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add new inclusion input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newInclusionText}
                    onChange={(e) => setNewInclusionText(e.target.value)}
                    placeholder="Enter inclusion item (e.g. Acid-free shower cubicle de-scaling)..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddInclusion();
                      }
                    }}
                    className="flex-1 px-3 py-2 text-xs border border-[#EAEAEA] rounded-xl focus:outline-none focus:border-[#E31B23]"
                  />
                  <button
                    type="button"
                    onClick={handleAddInclusion}
                    className="px-4 py-2 text-xs font-bold bg-[#E31B23] text-white rounded-xl hover:bg-[#c9151c] transition-colors cursor-pointer shrink-0 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Inclusion
                  </button>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">
                  Status
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-xs text-[#171717] cursor-pointer">
                    <input
                      type="radio"
                      name="srv-status"
                      value="published"
                      checked={formData.status === 'published'}
                      onChange={() => setFormData({ ...formData, status: 'published' })}
                      className="accent-[#E31B23]"
                    />
                    Published
                  </label>
                  <label className="flex items-center gap-2 text-xs text-[#171717] cursor-pointer">
                    <input
                      type="radio"
                      name="srv-status"
                      value="draft"
                      checked={formData.status === 'draft'}
                      onChange={() => setFormData({ ...formData, status: 'draft' })}
                      className="accent-[#E31B23]"
                    />
                    Draft
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
                  {editingService ? 'Save Changes' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!itemToDelete}
        title="Delete Cleaning Service"
        itemName={itemToDelete?.name || ''}
        onCancel={() => setItemToDelete(null)}
        onConfirm={() => {
          if (itemToDelete) {
            onDeleteService(itemToDelete.id);
            setItemToDelete(null);
          }
        }}
      />
    </div>
  );
};
