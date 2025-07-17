import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import DealPipeline from "@/components/organisms/DealPipeline";
import FilterBuilder from "@/components/organisms/FilterBuilder";
import DealForm from "@/components/organisms/DealForm";
import SavedFilters from "@/components/organisms/SavedFilters";
import Button from "@/components/atoms/Button";
import { dealService } from "@/services/api/dealService";
import { contactService } from "@/services/api/contactService";
const Deals = () => {
  const [deals, setDeals] = useState([]);
  const [filteredDeals, setFilteredDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);
  const [draggedDeal, setDraggedDeal] = useState(null);
  const [showFilterBuilder, setShowFilterBuilder] = useState(false);
  const [showSavedFilters, setShowSavedFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && showForm) {
        setShowForm(false);
        setEditingDeal(null);
      }
    };

    if (showForm) {
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [showForm]);
  const loadDeals = async () => {
    try {
      setLoading(true);
      setError("");
      const [dealsData, contactsData] = await Promise.all([
        dealService.getAll(),
        contactService.getAll(),
      ]);
setDeals(dealsData);
      setFilteredDeals(dealsData);
      setContacts(contactsData);
    } catch (err) {
      setError(err.message || "Failed to load deals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeals();
}, []);

  useEffect(() => {
    applyFilters();
  }, [deals, activeFilter]);

  const applyFilters = async () => {
    let filtered = [...deals];

    // Apply advanced filter
    if (activeFilter && activeFilter.conditions) {
      try {
        filtered = await dealService.filterDeals(filtered, activeFilter.conditions);
      } catch (error) {
        toast.error('Failed to apply filter');
      }
    }

    setFilteredDeals(filtered);
  };

  const handleAddDeal = () => {
    setEditingDeal(null);
    setShowForm(true);
  };

  const handleEditDeal = (deal) => {
    setEditingDeal(deal);
    setShowForm(true);
  };

const handleSaveDeal = async (dealData) => {
    try {
      if (editingDeal) {
        const updatedDeal = await dealService.update(editingDeal.Id, dealData);
        setDeals(prev => prev.map(d => d.Id === updatedDeal.Id ? updatedDeal : d));
        toast.success("Deal updated successfully");
      } else {
        const newDeal = await dealService.create(dealData);
        setDeals(prev => [...prev, newDeal]);
        toast.success("Deal created successfully");
      }
      setShowForm(false);
      setEditingDeal(null);
    } catch (error) {
      toast.error(error.message || "Failed to save deal");
    }
  };

  const handleModalClose = () => {
    setShowForm(false);
    setEditingDeal(null);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleModalClose();
    }
  };

  const handleDragStart = (e, deal) => {
    setDraggedDeal(deal);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e, newStage) => {
    e.preventDefault();
    
    if (!draggedDeal || draggedDeal.stage === newStage) {
      setDraggedDeal(null);
      return;
    }

try {
      await dealService.updateStage(draggedDeal.Id, newStage);
      setDeals(prev => prev.map(deal => 
        deal.Id === draggedDeal.Id 
          ? { ...deal, stage: newStage }
          : deal
      ));
      toast.success("Deal stage updated successfully");
    } catch (err) {
      toast.error(err.message || "Failed to update deal stage");
    } finally {
      setDraggedDeal(null);
    }
  };
const calculateTotalValue = () => {
    return filteredDeals.reduce((total, deal) => total + (deal?.value || 0), 0);
  };

  const handleShowFilterBuilder = () => {
    setShowFilterBuilder(true);
  };

  const handleShowSavedFilters = () => {
    setShowSavedFilters(true);
  };

  const handleApplyFilter = (filter) => {
    setActiveFilter(filter);
    setShowFilterBuilder(false);
    setShowSavedFilters(false);
    toast.success('Filter applied successfully');
  };

  const handleClearFilter = () => {
    setActiveFilter(null);
    toast.info('Filter cleared');
  };

  const handleCloseFilterBuilder = () => {
    setShowFilterBuilder(false);
  };

  const handleCloseSavedFilters = () => {
    setShowSavedFilters(false);
  };

  if (loading) {
    return <Loading type="pipeline" />;
  }

  if (error) {
    return (
      <Error
        title="Deals Error"
        message={error}
        onRetry={loadDeals}
      />
    );
  }


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Deals Pipeline</h1>
          <p className="text-gray-600 mt-1">
            Total Pipeline Value: {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 0,
            }).format(calculateTotalValue())}
          </p>
        </div>
<Button onClick={handleAddDeal}>
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Deal
        </Button>
      </div>
        
      <div className="flex items-center space-x-4">
        <Button
            variant="outline" 
            size="sm" 
            onClick={handleShowFilterBuilder}
          >
            <ApperIcon name="Filter" size={16} className="mr-2" />
            Advanced Filter
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleShowSavedFilters}
          >
            <ApperIcon name="Bookmark" size={16} className="mr-2" />
            Saved Filters
          </Button>
          {activeFilter && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleClearFilter}
              className="text-red-600 hover:text-red-700"
            >
              <ApperIcon name="X" size={16} className="mr-2" />
              Clear Filter
            </Button>
          )}
        </div>
      </div>

      {/* Active Filter Display */}
      {activeFilter && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ApperIcon name="Filter" size={16} className="text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                Active Filter: {activeFilter.name || 'Custom Filter'}
              </span>
<span className="text-xs text-blue-600">
                ({activeFilter.conditions?.length || 0} condition{(activeFilter.conditions?.length || 0) !== 1 ? 's' : ''})
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFilter}
              className="text-blue-600 hover:text-blue-700"
            >
              <ApperIcon name="X" size={14} />
            </Button>
          </div>
        </div>
      )}

      {filteredDeals.length === 0 ? (
        <Empty
          title="No deals found"
          message={activeFilter ? "No deals match your filter criteria." : "Get started by adding your first deal to the pipeline."}
          icon="Target"
          actionLabel="Add Deal"
          onAction={handleAddDeal}
        />
      ) : (
<DealPipeline
          deals={filteredDeals}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onEdit={handleEditDeal}
        />
      )}

      {/* Deal Form Modal */}
      {showForm && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleBackdropClick}
        >
          <div 
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <DealForm
              deal={editingDeal}
              contacts={contacts}
              onSave={handleSaveDeal}
              onCancel={handleModalClose}
            />
          </div>
        </div>
)}

      {/* Filter Builder Modal */}
      {showFilterBuilder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <FilterBuilder
              type="deals"
              onApply={handleApplyFilter}
              onCancel={handleCloseFilterBuilder}
            />
          </div>
        </div>
      )}

      {/* Saved Filters Modal */}
      {showSavedFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="bg-white rounded-lg shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold text-gray-900">
                  Saved Filters
                </h2>
                <Button
                  variant="outline"
                  onClick={handleCloseSavedFilters}
                  className="p-2"
                >
                  <ApperIcon name="X" size={16} />
                </Button>
              </div>
              <SavedFilters
                type="deals"
                onApply={handleApplyFilter}
              />
            </div>
          </div>
        </div>
)}
    </div>
  );
};

export default Deals;