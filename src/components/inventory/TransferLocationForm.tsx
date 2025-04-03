
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Location } from "@/types/location";

interface TransferLocationFormProps {
  formData: {
    source: string;
    destination: string;
    reason: string;
    notes: string;
  };
  destinationLocations: string[];
  availableLocations: Location[];
  reasons: string[];
  currentLocation: Location | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const TransferLocationForm: React.FC<TransferLocationFormProps> = ({
  formData,
  destinationLocations,
  availableLocations,
  reasons,
  currentLocation,
  onChange
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="source">Source Location</Label>
        <select
          id="source"
          name="source"
          value={formData.source}
          onChange={onChange}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          required
        >
          <option value="">Select Source Location</option>
          {availableLocations.map(location => (
            <option 
              key={location.id} 
              value={location.name}
              disabled={currentLocation && location.name !== currentLocation.name}
            >
              {location.name} {location.name === currentLocation?.name ? "(Current)" : ""}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="destination">Destination</Label>
        <select
          id="destination"
          name="destination"
          value={formData.destination}
          onChange={onChange}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          required
        >
          <option value="">Select Destination</option>
          {destinationLocations.map(locationName => (
            <option key={locationName} value={locationName}>
              {locationName}
            </option>
          ))}
          <option value="N/A">N/A (For adjustments, damage, etc.)</option>
        </select>
      </div>

      <div>
        <Label htmlFor="reason">Reason</Label>
        <select
          id="reason"
          name="reason"
          value={formData.reason}
          onChange={onChange}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          required
        >
          <option value="">Select Reason</option>
          {reasons.map(reason => (
            <option key={reason} value={reason}>{reason}</option>
          ))}
        </select>
      </div>

      <div className="sm:col-span-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={onChange}
          rows={2}
        />
      </div>
    </div>
  );
};

export default TransferLocationForm;
