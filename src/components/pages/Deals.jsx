import React, { useState, useEffect } from "react";
import DealPipeline from "@/components/organisms/DealPipeline";
import DealForm from "@/components/organisms/DealForm";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { dealService } from "@/services/api/dealService";
import { contactService } from "@/services/api/contactService";
import { toast } from "react-toastify";

const Deals = () => {
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);
  const [draggedDeal, setDraggedDeal] = useState(null);

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

  const handleAddDeal = () => {
    setEditingDeal(null);
    setShowForm(true);
  };

  const handleEditDeal = (deal) => {
    setEditingDeal(deal);
    setShowForm(true);
  };

const handleSaveDeal = async (dealData) => {
    if (editingDeal) {
      const updatedDeal = await dealService.update(editingDeal.Id, dealData);
      setDeals(prev => prev.map(d => d.Id === updatedDeal.Id ? updatedDeal : d));
    } else {
      const newDeal = await dealService.create(dealData);
      setDeals(prev => [...prev, newDeal]);
    }
    setShowForm(false);
    setEditingDeal(null);
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
      toast.error("Failed to update deal stage");
    } finally {
      setDraggedDeal(null);
    }
  };

  const calculateTotalValue = () => {
    return deals.reduce((total, deal) => total + deal.value, 0);
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

      {deals.length === 0 ? (
        <Empty
          title="No deals found"
          message="Get started by adding your first deal to the pipeline."
          icon="Target"
          actionLabel="Add Deal"
          onAction={handleAddDeal}
        />
      ) : (
        <DealPipeline
          deals={deals}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
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
    </div>
  );
};

export default Deals;