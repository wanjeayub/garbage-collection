import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import plotService from "../api/plots";
import locationService from "../api/location";
import paymentService from "../api/payments";
import PlotForm from "../components/forms/PlotForm";
import Button from "../components/UI/Button";
import Modal from "../components/UI/Modal";
import AddScheduleForm from "../components/forms/AddScheduleForm";

const Plots = () => {
  const [plots, setPlots] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPlot, setEditingPlot] = useState(null);
  const [showAddScheduleModal, setShowAddScheduleModal] = useState(false);
  const [selectedPlotForSchedule, setSelectedPlotForSchedule] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [plotsData, locationsData] = await Promise.all([
          plotService.getPlots(),
          locationService.getLocations(),
        ]);
        setPlots(plotsData);
        setLocations(locationsData);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Failed to load data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddSchedule = (plot) => {
    setSelectedPlotForSchedule(plot);
    setShowAddScheduleModal(true);
  };

  const handleSaveSchedule = async (scheduleData) => {
    try {
      await paymentService.createPaymentSchedule(scheduleData);
      toast.success("Payment schedule added successfully");
      setShowAddScheduleModal(false);
      fetchData(); // Refresh plots data
    } catch (error) {
      toast.error(error.message || "Failed to add schedule");
    }
  };

  const handleCreatePlot = async (plotData) => {
    try {
      const createdPlot = await plotService.createPlot(plotData);
      setPlots([...plots, createdPlot]);
      setShowForm(false);
      toast.success("Plot created successfully");
    } catch (error) {
      console.error("Failed to create plot:", error);
      toast.error("Failed to create plot");
    }
  };

  const handleEditPlot = async (plotData) => {
    try {
      const updatedPlot = await plotService.updatePlot(
        editingPlot._id,
        plotData
      );

      // Update the plots state
      setPlots(plots.map((p) => (p._id === editingPlot._id ? updatedPlot : p)));

      // Close the modal and reset editing state
      setShowForm(false);
      setEditingPlot(null);

      toast.success("Plot updated successfully");
    } catch (error) {
      console.error("Failed to update plot:", error);
      toast.error(error.response?.data?.error || "Failed to update plot");
    }
  };

  const handleDeletePlot = async (plotId) => {
    try {
      await plotService.deletePlot(plotId);
      setPlots(plots.filter((p) => p._id !== plotId));
      toast.success("Plot deleted successfully");
    } catch (error) {
      console.error("Failed to delete plot:", error);
      toast.error("Failed to delete plot");
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [plotsData, locationsData] = await Promise.all([
        plotService.getPlots(),
        locationService.getLocations(),
      ]);
      setPlots(plotsData);
      setLocations(locationsData);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Failed to load data");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Plots</h2>
        <Button
          onClick={() => {
            setEditingPlot(null);
            setShowForm(true);
          }}
        >
          Add Plot
        </Button>
      </div>

      {loading ? (
        <div className="text-center">Loading plots...</div>
      ) : plots.length === 0 ? (
        <div className="text-center">No plots found</div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plot
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {plots.map((plot) => (
                <tr key={plot._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      Plot #{plot.plotNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {plot.location?.name || "Unknown"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {plot.ownerName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {plot.mobileNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          setEditingPlot(plot);
                          setShowForm(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleAddSchedule(plot)}
                      >
                        Add Schedule
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeletePlot(plot._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingPlot(null);
        }}
        title={editingPlot ? "Edit Plot" : "Add New Plot"}
      >
        <PlotForm
          locations={locations}
          initialData={editingPlot}
          onSubmit={editingPlot ? handleEditPlot : handleCreatePlot}
          onCancel={() => {
            setShowForm(false);
            setEditingPlot(null);
          }}
        />
      </Modal>

      <Modal
        isOpen={showAddScheduleModal}
        onClose={() => setShowAddScheduleModal(false)}
        title={`Add Payment Schedule for Plot #${
          selectedPlotForSchedule?.plotNumber || ""
        }`}
      >
        {selectedPlotForSchedule && (
          <AddScheduleForm
            plotId={selectedPlotForSchedule._id}
            defaultAmount={selectedPlotForSchedule.expectedAmount}
            onSave={handleSaveSchedule}
            onCancel={() => setShowAddScheduleModal(false)}
          />
        )}
      </Modal>
    </div>
  );
};

export default Plots;
