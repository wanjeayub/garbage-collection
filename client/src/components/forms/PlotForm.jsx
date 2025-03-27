import { useState, useEffect } from "react";
import Button from "../UI/Button";
import locationService from "../../api/location";

const PlotForm = ({ onSubmit, initialData, onCancel }) => {
  // Initialize formData with proper null checks
  const [formData, setFormData] = useState({
    plotNumber: "",
    location: "",
    ownerName: "",
    mobileNumber: "",
    bagsPerCollection: 1,
    expectedAmount: "",
  });

  const [locations, setLocations] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(true);

  useEffect(() => {
    // Set form data when initialData changes
    if (initialData) {
      setFormData({
        plotNumber: initialData.plotNumber || "",
        location: initialData.location?._id || initialData.location || "",
        ownerName: initialData.ownerName || "",
        mobileNumber: initialData.mobileNumber || "",
        bagsPerCollection: initialData.bagsPerCollection || 1,
        expectedAmount: initialData.expectedAmount || "",
      });
    }
  }, [initialData]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await locationService.getLocations();
        setLocations(data);
        setLoadingLocations(false);

        // If no location is selected but locations exist, select the first one
        if (!formData.location && data.length > 0) {
          setFormData((prev) => ({ ...prev, location: data[0]._id }));
        }
      } catch (error) {
        console.error("Failed to fetch locations:", error);
        setLoadingLocations(false);
      }
    };

    fetchLocations();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? "" : Number(value),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="plotNumber"
            className="block text-sm font-medium text-gray-700"
          >
            Plot Number
          </label>
          <input
            type="text"
            id="plotNumber"
            name="plotNumber"
            value={formData.plotNumber}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700"
          >
            Location
          </label>
          <select
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            disabled={loadingLocations}
            required
          >
            {loadingLocations ? (
              <option value="">Loading locations...</option>
            ) : (
              <>
                <option value="">Select a location</option>
                {locations.map((location) => (
                  <option key={location._id} value={location._id}>
                    {location.name}
                  </option>
                ))}
              </>
            )}
          </select>
        </div>

        <div>
          <label
            htmlFor="ownerName"
            className="block text-sm font-medium text-gray-700"
          >
            Owner Name
          </label>
          <input
            type="text"
            id="ownerName"
            name="ownerName"
            value={formData.ownerName}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label
            htmlFor="mobileNumber"
            className="block text-sm font-medium text-gray-700"
          >
            Mobile Number
          </label>
          <input
            type="tel"
            id="mobileNumber"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label
            htmlFor="bagsPerCollection"
            className="block text-sm font-medium text-gray-700"
          >
            Bags per Collection
          </label>
          <input
            type="number"
            id="bagsPerCollection"
            name="bagsPerCollection"
            min="1"
            value={formData.bagsPerCollection}
            onChange={handleNumberChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label
            htmlFor="expectedAmount"
            className="block text-sm font-medium text-gray-700"
          >
            Expected Amount
          </label>
          <input
            type="number"
            id="expectedAmount"
            name="expectedAmount"
            min="0"
            step="0.01"
            value={formData.expectedAmount}
            onChange={handleNumberChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit">
          {initialData?._id ? "Update" : "Create"} Plot
        </Button>
      </div>
    </form>
  );
};

export default PlotForm;
