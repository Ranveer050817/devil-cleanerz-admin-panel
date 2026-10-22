import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  X, 
  Check, 
  LayoutGrid, 
  List, 
  ShoppingBag,
  Tag
} from 'lucide-react';
import { CleaningProduct, StatusType } from '../../types';
import { productCategoryOptions } from '../../data/initialData';
import { ImageUploadField } from '../common/ImageUploadField';
import { DeleteConfirmModal } from '../common/DeleteConfirmModal';

interface ProductsManagementProps {
  products: CleaningProduct[];
  onSaveProduct: (product: CleaningProduct) => void;
  onDeleteProduct: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export const ProductsManagement: React.FC<ProductsManagementProps> = ({
  products,
  onSaveProduct,
  onDeleteProduct,
  onToggleStatus
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<CleaningProduct | null>(null);

  // Delete confirm
  const [itemToDelete, setItemToDelete] = useState<CleaningProduct | null>(null);

  // Form state
  const [formData, setFormData] = useState<{
    id: string;
    name: string;
    imageUrl: string;
    price: number;
    description: string;
    category: string;
    displayOrder: number;
    status: StatusType;
  }>({
    id: '',
    name: '',
    imageUrl: '',
    price: 1200,
    description: '',
    category: 'Degreasers',
    displayOrder: 1,
    status: 'published'
  });

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      id: `prod-${Date.now()}`,
      name: '',
      imageUrl: '',
      price: 1200,
      description: '',
      category: 'Degreasers',
      displayOrder: products.length + 1,
      status: 'published'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (prod: CleaningProduct) => {
    setEditingProduct(prod);
    setFormData({
      id: prod.id,
      name: prod.name,
      imageUrl: prod.imageUrl,
      price: prod.price,
      description: prod.description,
      category: prod.category,
      displayOrder: prod.displayOrder,
      status: prod.status
    });
    setIsModalOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const prodToSave: CleaningProduct = {
      id: formData.id,
      name: formData.name.trim(),
      imageUrl: formData.imageUrl,
      price: Number(formData.price) || 0,
      description: formData.description.trim(),
      category: formData.category,
      displayOrder: Number(formData.displayOrder) || 1,
      status: formData.status,
      createdAt: editingProduct?.createdAt || new Date().toISOString().split('T')[0]
    };

    onSaveProduct(prodToSave);
    setIsModalOpen(false);
  };

  const filteredProducts = products.filter((prod) => {
    const matchesSearch = prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || prod.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || prod.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  }).sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#171717]">
            Chemical &amp; Cleaning Products
          </h2>
          <p className="text-xs text-[#666666]">
            Manage professional degreasers, descaling agents, glass polish, and sanitizing solutions
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-[#E31B23] hover:bg-[#c9151c] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Product
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
              placeholder="Search products by title, chemical type, description..."
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
            {/* Status toggle */}
            <div className="flex items-center p-1 bg-[#F7F7F7] border border-[#EAEAEA] rounded-xl text-xs">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  statusFilter === 'all' ? 'bg-white text-[#171717] shadow-xs' : 'text-[#666666]'
                }`}
              >
                All ({products.length})
              </button>
              <button
                onClick={() => setStatusFilter('published')}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  statusFilter === 'published' ? 'bg-white text-emerald-800 shadow-xs' : 'text-[#666666]'
                }`}
              >
                Live
              </button>
              <button
                onClick={() => setStatusFilter('draft')}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
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

        {/* Category Pills Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 text-xs">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Tag className="w-3 h-3" />
            Category:
          </span>
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              categoryFilter === 'all'
                ? 'bg-[#171717] text-white'
                : 'bg-[#F7F7F7] text-[#666666] hover:text-[#171717]'
            }`}
          >
            All Categories
          </button>
          {productCategoryOptions.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-[#171717] text-white'
                  : 'bg-[#F7F7F7] text-[#666666] hover:text-[#171717]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Content */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white border border-[#EAEAEA] rounded-2xl p-12 text-center shadow-xs">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-400 mb-3">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-[#171717]">No products found</h3>
          <p className="text-xs text-[#666666] mt-1 max-w-sm mx-auto">
            No items matched your search query or category filter.
          </p>
          <button
            onClick={openAddModal}
            className="mt-4 px-4 py-2 bg-[#E31B23] text-white text-xs font-bold rounded-xl hover:bg-[#c9151c] transition-colors cursor-pointer"
          >
            Add New Product
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProducts.map((prod) => (
            <div
              key={prod.id}
              className="bg-white border border-[#EAEAEA] rounded-2xl overflow-hidden shadow-xs hover:border-gray-300 transition-all flex flex-col group"
            >
              <div className="relative aspect-square bg-[#F7F7F7] p-4 flex items-center justify-center border-b border-[#EAEAEA]">
                <img
                  src={prod.imageUrl}
                  alt={prod.name}
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/75 text-white">
                    #{prod.displayOrder}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <button
                    onClick={() => onToggleStatus(prod.id)}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full cursor-pointer ${
                      prod.status === 'published'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-700 text-white'
                    }`}
                  >
                    {prod.status === 'published' ? 'Live' : 'Draft'}
                  </button>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#E31B23] uppercase tracking-wide">
                    {prod.category}
                  </span>
                  <h3 className="text-xs font-bold text-[#171717] mt-1 line-clamp-1 group-hover:text-[#E31B23] transition-colors">
                    {prod.name}
                  </h3>
                  <p className="text-[11px] text-[#666666] mt-1.5 line-clamp-2 leading-relaxed">
                    {prod.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#EAEAEA] flex items-center justify-between">
                  <span className="text-sm font-extrabold text-[#171717] tabular-nums">
                    ₹{prod.price.toLocaleString('en-IN')}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(prod)}
                      className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setItemToDelete(prod)}
                      className="p-1.5 text-gray-400 hover:text-[#E31B23] hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete"
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
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-right">Price (INR)</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAEAEA]">
                {filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-center text-gray-500">
                      {prod.displayOrder}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 border border-[#EAEAEA] overflow-hidden shrink-0 flex items-center justify-center p-1">
                          <img
                            src={prod.imageUrl}
                            alt={prod.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-[#171717]">{prod.name}</p>
                          <p className="text-[11px] text-[#666666] line-clamp-1 max-w-sm">
                            {prod.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[#666666] font-medium">
                      {prod.category}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-[#171717] tabular-nums">
                      ₹{prod.price.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => onToggleStatus(prod.id)}
                        className={`px-2 py-0.5 rounded-full text-[11px] font-bold cursor-pointer ${
                          prod.status === 'published'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-gray-100 text-gray-600 border border-gray-200'
                        }`}
                      >
                        {prod.status === 'published' ? 'Live' : 'Draft'}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(prod)}
                          className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setItemToDelete(prod)}
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

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl border border-[#EAEAEA] shadow-2xl max-w-lg w-full my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-[#EAEAEA] flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#171717]">
                  {editingProduct ? 'Edit Product' : 'Add Chemical / Cleaning Product'}
                </h3>
                <p className="text-xs text-[#666666]">
                  Configure commercial solution specs and pricing
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
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Devil Max Heavy-Duty Degreaser 5L"
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
                    {productCategoryOptions.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#171717] mb-1">
                    Price in INR (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    placeholder="1200"
                    className="w-full px-3.5 py-2.5 text-xs font-mono font-semibold border border-[#EAEAEA] rounded-xl focus:outline-none focus:border-[#E31B23]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <div>
                  <label className="block text-xs font-semibold text-[#171717] mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as StatusType })}
                    className="w-full px-3.5 py-2.5 text-xs border border-[#EAEAEA] rounded-xl focus:outline-none focus:border-[#E31B23] bg-white font-semibold"
                  >
                    <option value="published">Published (Live)</option>
                    <option value="draft">Draft (Hidden)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171717] mb-1">
                  Product Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Chemical concentration, target stains, application surfaces..."
                  className="w-full px-3.5 py-2.5 text-xs border border-[#EAEAEA] rounded-xl focus:outline-none focus:border-[#E31B23]"
                />
              </div>

              <ImageUploadField
                label="Product Bottle / Packaging Photo"
                value={formData.imageUrl}
                onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                presetType="product"
                bucket="products"
              />

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
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!itemToDelete}
        title="Delete Cleaning Product"
        itemName={itemToDelete?.name || ''}
        onCancel={() => setItemToDelete(null)}
        onConfirm={() => {
          if (itemToDelete) {
            onDeleteProduct(itemToDelete.id);
            setItemToDelete(null);
          }
        }}
      />
    </div>
  );
};
