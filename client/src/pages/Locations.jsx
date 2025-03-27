import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import locationService from "../api/location";
import Button from "../components/UI/Button";
import LocationForm from "../components/forms/LocationForm";
import Modal from "../components/UI/Modal";

const Locations = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        const data = await locationService.getLocations();
        setLocations(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch locations:", error);
        toast.error("Failed to load locations");
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  const handleCreateLocation = async (locationData) => {
    try {
      const createdLocation = await locationService.createLocation(
        locationData
      );
      setLocations([...locations, createdLocation]);
      setShowForm(false);
      toast.success("Location created successfully");
    } catch (error) {
      console.error("Failed to create location:", error);
      toast.error("Failed to create location");
    }
  };

  const handleUpdateLocation = async (locationData) => {
    try {
      const updatedLocation = await locationService.updateLocation(
        editingLocation._id,
        locationData
      );
      setLocations(
        locations.map((loc) =>
          loc._id === updatedLocation._id ? updatedLocation : loc
        )
      );
      setShowForm(false);
      setEditingLocation(null);
      toast.success("Location updated successfully");
    } catch (error) {
      console.error("Failed to update location:", error);
      toast.error("Failed to update location");
    }
  };

  const handleDeleteLocation = async (locationId) => {
    try {
      await locationService.deleteLocation(locationId);
      setLocations(locations.filter((l) => l._id !== locationId));
      toast.success("Location deleted successfully");
    } catch (error) {
      console.error("Failed to delete location:", error);
      toast.error("Failed to delete location");
    }
  };

  const handleEditClick = (location) => {
    setEditingLocation(location);
    setShowForm(true);
  };

  const handleFormSubmit = (locationData) => {
    if (editingLocation) {
      handleUpdateLocation(locationData);
    } else {
      handleCreateLocation(locationData);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Locations</h2>
        <Button
          onClick={() => {
            setEditingLocation(null);
            setShowForm(true);
          }}
        >
          Add Location
        </Button>
      </div>

      {loading ? (
        <div className="text-center">Loading locations...</div>
      ) : locations.length === 0 ? (
        <div className="text-center">No locations found</div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {locations.map((location) => (
                <tr key={location._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {location.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleEditClick(location)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteLocation(location._id)}
                    >
                      Delete
                    </Button>
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
          setEditingLocation(null);
        }}
        title={editingLocation ? "Edit Location" : "Add New Location"}
      >
        <LocationForm
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingLocation(null);
          }}
          initialData={editingLocation}
        />
      </Modal>
    </div>
  );
};

export default Locations;
