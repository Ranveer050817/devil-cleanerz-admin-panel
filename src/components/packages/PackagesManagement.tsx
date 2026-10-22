import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Eye, 
  Check, 
  X, 
  CheckCircle2, 
  LayoutGrid, 
  List, 
  Sparkles,
  ArrowUpDown
} from 'lucide-react';
import { CleaningPackage, StatusType } from '../../types';
import { ImageUploadField } from '../common/ImageUploadField';
import { DeleteConfirmModal } from '../common/DeleteConfirmModal';

interface PackagesManagementProps {
  packages: CleaningPackage[];
  onSavePackage: (pkg: CleaningPackage) => void;
  onDeletePackage: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export const PackagesManagement: React.FC<PackagesManagementProps> = ({
  packages,
  onSavePackage,
  onDeletePackage,
  onToggleStatus
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<CleaningPackage | null>(null);

  // Delete confirm state
  const [itemToDelete, setItemToDelete] = useState<CleaningPackage | null>(null);

  // Form state
  const [formData, setFormData] = useState<{
    id: string;
    name: string;
    price: number;
    description: string;
    imageUrl: string;
    includedServices: string[];
    displayOrder: number;
    status: StatusType;
  }>({
    id: '',
    name: '',
    price: 2999,
    description: '',
    imageUrl: '',
    includedServices: ['Deep floor scrubbing', 'Bathroom sanitization', 'Kitchen degreasing'],
    displayOrder: 1,
    status: 'published'
  });

  const [newInclusionText, setNewInclusionText] = useState('');

  const openAddModal = () => {
    setEditingPackage(null);
    setFormData({
      id: `pkg-${Date.now()}`,
      name: '',
      price: 2999,
      description: '',
      imageUrl: '',
      includedServices: ['Floor scrubbing', 'Kitchen cleaning', 'Sanitization'],
      displayOrder: packages.length + 1,
      status: 'published'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (pkg: CleaningPackage) => {
    setEditingPackage(pkg);
    setFormData({
      id: pkg.id,
      name: pkg.name,
      price: pkg.price,
      description: pkg.description,
      imageUrl: pkg.imageUrl,
      includedServices: [...pkg.includedServices],
      displayOrder: pkg.displayOrder,
      status: pkg.status
    });
    setIsModalOpen(true);
  };

  const handleAddInclusion = () => {
    if (newInclusionText.trim()) {
      setFormData(prev => ({
        ...prev,
        includedServices: [...prev.includedServices, newInclusionText.trim()]
      }));
      setNewInclusionText('');
    }
  };

  const handleRemoveInclusion = (index: number) => {
    setFormData(prev => ({
      ...prev,
      includedServices: prev.includedServices.filter((_, i) => i !== index)
    }));
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const pkgToSave: CleaningPackage = {
      id: formData.id,
      name: formData.name.trim(),
      price: Number(formData.price) || 0,
      description: formData.description.trim(),
      imageUrl: formData.imageUrl || '',
      includedServices: formData.includedServices,
      displayOrder: Number(formData.displayOrder) || 1,
      status: formData.status,
      createdAt: editingPackage?.createdAt || new Date().toISOString().split('T')[0]
    };

    onSavePackage(pkgToSave);
    setIsModalOpen(false);
  };

  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch = pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || pkg.status === statusFilter;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#171717]">
            Cleaning Packages
          </h2>
          <p className="text-xs text-[#666666]">
            Configure tiered deep cleaning packages for 1BHK, 2BHK, 3BHK, 4BHK and custom residences
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-[#E31B23] hover:bg-[#c9151c] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Package
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#EAEAEA] rounded-2xl p-3 sm:p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search packages by name, description..."
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

        {/* Status Filters */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 bg-[#F7F7F7] border border-[#EAEAEA] rounded-xl text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-white text-[#171717] shadow-xs'
                  : 'text-[#666666] hover:text-[#171717]'
              }`}
            >
              All ({packages.length})
            </button>
            <button
              onClick={() => setStatusFilter('published')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                statusFilter === 'published'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-[#666666] hover:text-emerald-700'
              }`}
            >
              Live ({packages.filter(p => p.status === 'published').length})
            </button>
            <button
              onClick={() => setStatusFilter('draft')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                statusFilter === 'draft'
                  ? 'bg-white text-gray-800 shadow-xs'
                  : 'text-[#666666] hover:text-gray-800'
              }`}
            >
              Drafts ({packages.filter(p => p.status === 'draft').length})
            </button>
          </div>

          {/* View mode toggle */}
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

      {/* Packages Listing */}
      {filteredPackages.length === 0 ? (
        <div className="bg-white border border-[#EAEAEA] rounded-2xl p-12 text-center shadow-xs">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-400 mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-[#171717]">No packages matched your filters</h3>
          <p className="text-xs text-[#666666] mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria or add a new package.
          </p>
          <button
            onClick={openAddModal}
            className="mt-4 px-4 py-2 bg-[#E31B23] text-white text-xs font-bold rounded-xl hover:bg-[#c9151c] transition-colors cursor-pointer"
          >
            Create New Package
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white border border-[#EAEAEA] rounded-2xl overflow-hidden shadow-xs hover:border-gray-300 transition-all flex flex-col group"
            >
              {/* Image Preview Container */}
              <div className="relative aspect-16/10 bg-gray-50 overflow-hidden border-b border-[#EAEAEA]">
                <img
                  src={pkg.imageUrl}
                  alt={pkg.name}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/75 text-white backdrop-blur-xs">
                    Order #{pkg.displayOrder}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <button
                    onClick={() => onToggleStatus(pkg.id)}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-xs transition-colors cursor-pointer ${
                      pkg.status === 'published'
                        ? 'bg-emerald-600/90 hover:bg-emerald-700 text-white'
                        : 'bg-gray-800/80 hover:bg-gray-900 text-gray-200'
                    }`}
                  >
                    {pkg.status === 'published' ? 'Live' : 'Draft'}
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="text-sm font-bold text-[#171717] line-clamp-1 group-hover:text-[#E31B23] transition-colors">
                    {pkg.name}
                  </h3>
                  <span className="text-base font-extrabold text-[#E31B23] tabular-nums whitespace-nowrap">
                    ₹{pkg.price.toLocaleString('en-IN')}
                  </span>
                </div>

                <p className="text-xs text-[#666666] mt-2 line-clamp-2 leading-relaxed">
                  {pkg.description}
                </p>

                {/* Included Services list snippet */}
                <div className="mt-4 pt-3 border-t border-[#EAEAEA] flex-1">
                  <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Key Inclusions ({pkg.includedServices.length})
                  </p>
                  <ul className="space-y-1.5">
                    {pkg.includedServices.slice(0, 3).map((svc, idx) => (
                      <li key={idx} className="text-xs text-[#171717] flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{svc}</span>
                      </li>
                    ))}
                    {pkg.includedServices.length > 3 && (
                      <li className="text-[11px] text-[#666666] pl-5 font-medium">
                        +{pkg.includedServices.length - 3} more service inclusions
                      </li>
                    )}
                  </ul>
                </div>

                {/* Card Actions */}
                <div className="mt-5 pt-3 border-t border-[#EAEAEA] flex items-center justify-between">
                  <span className="text-[11px] text-gray-400 font-medium">
                    Added {pkg.createdAt}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal(pkg)}
                      className="px-2.5 py-1 text-xs font-semibold text-[#171717] hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-gray-500" />
                      Edit
                    </button>
                    <button
                      onClick={() => setItemToDelete(pkg)}
                      className="p-1 text-gray-400 hover:text-[#E31B23] hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete package"
                    >
                      <Trash2 className="w-4 h-4" />
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
                  <th className="py-3 px-4">Package</th>
                  <th className="py-3 px-4 text-right">Price (INR)</th>
                  <th className="py-3 px-4">Inclusions</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAEAEA]">
                {filteredPackages.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-center text-gray-500">
                      {pkg.displayOrder}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-10 rounded-lg bg-gray-100 border border-[#EAEAEA] overflow-hidden shrink-0">
                          <img
                            src={pkg.imageUrl}
                            alt={pkg.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-[#171717]">{pkg.name}</p>
                          <p className="text-[11px] text-[#666666] line-clamp-1 max-w-sm">
                            {pkg.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-[#171717] tabular-nums">
                      ₹{pkg.price.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-[#666666]">
                      <span className="font-medium">{pkg.includedServices.length} items</span>
                      <span className="text-[11px] block truncate max-w-xs text-gray-400">
                        {pkg.includedServices.join(', ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => onToggleStatus(pkg.id)}
                        className={`px-2 py-0.5 rounded-full text-[11px] font-bold cursor-pointer ${
                          pkg.status === 'published'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-gray-100 text-gray-600 border border-gray-200'
                        }`}
                      >
                        {pkg.status === 'published' ? 'Live' : 'Draft'}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(pkg)}
                          className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setItemToDelete(pkg)}
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

      {/* Add / Edit Package Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl border border-[#EAEAEA] shadow-2xl max-w-xl w-full my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-[#EAEAEA] flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#171717]">
                  {editingPackage ? 'Edit Cleaning Package' : 'Create Cleaning Package'}
                </h3>
                <p className="text-xs text-[#666666]">
                  Configure price, inclusions and cover details
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
              {/* Package Name */}
              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">
                  Package Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. 2 BHK Premium Deep Cleaning"
                  className="w-full px-3.5 py-2.5 text-xs border border-[#EAEAEA] rounded-xl focus:outline-none focus:border-[#E31B23]"
                />
              </div>

              {/* Price & Display Order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#171717] mb-1">
                    Price in INR (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="100"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    placeholder="2999"
                    className="w-full px-3.5 py-2.5 text-xs font-mono font-semibold border border-[#EAEAEA] rounded-xl focus:outline-none focus:border-[#E31B23]"
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

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">
                  Package Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detail what is covered in this package (rooms, bathrooms, equipment used)..."
                  className="w-full px-3.5 py-2.5 text-xs border border-[#EAEAEA] rounded-xl focus:outline-none focus:border-[#E31B23]"
                />
              </div>

              {/* Package Image */}
              <ImageUploadField
                label="Package Illustration / Image"
                value={formData.imageUrl}
                onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                presetType="package"
                bucket="packages"
              />

              {/* Included Services dynamic list */}
              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">
                  Included Services ({formData.includedServices.length})
                </label>
                <div className="space-y-2 mb-2">
                  {formData.includedServices.map((inc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-2 p-2 bg-[#F7F7F7] border border-[#EAEAEA] rounded-xl text-xs"
                    >
                      <span className="text-[#171717] flex-1">{inc}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveInclusion(index)}
                        className="text-gray-400 hover:text-[#E31B23] p-1 cursor-pointer"
                        title="Remove"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newInclusionText}
                    onChange={(e) => setNewInclusionText(e.target.value)}
                    placeholder="Add an included service (e.g. Balcony pressure wash)..."
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
                    className="px-3.5 py-2 text-xs font-semibold bg-[#171717] text-white rounded-xl hover:bg-black cursor-pointer shrink-0"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">
                  Publish Status
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-xs text-[#171717] cursor-pointer">
                    <input
                      type="radio"
                      name="pkg-status"
                      value="published"
                      checked={formData.status === 'published'}
                      onChange={() => setFormData({ ...formData, status: 'published' })}
                      className="accent-[#E31B23]"
                    />
                    Published (Visible on site)
                  </label>
                  <label className="flex items-center gap-2 text-xs text-[#171717] cursor-pointer">
                    <input
                      type="radio"
                      name="pkg-status"
                      value="draft"
                      checked={formData.status === 'draft'}
                      onChange={() => setFormData({ ...formData, status: 'draft' })}
                      className="accent-[#E31B23]"
                    />
                    Draft (Internal preview only)
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
                  {editingPackage ? 'Save Changes' : 'Create Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!itemToDelete}
        title="Delete Cleaning Package"
        itemName={itemToDelete?.name || ''}
        onCancel={() => setItemToDelete(null)}
        onConfirm={() => {
          if (itemToDelete) {
            onDeletePackage(itemToDelete.id);
            setItemToDelete(null);
          }
        }}
      />
    </div>
  );
};
