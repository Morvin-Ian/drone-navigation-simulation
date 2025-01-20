import { useState } from 'react';

const RouteForm = ({ drones, facilities, onSubmit }) => {
  const [formState, setFormState] = useState({
    selectedDrone: '',
    start: '',
    end: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formState);
    setFormState({ selectedDrone: '', start: '', end: '' });
  };

  const availableDrones = drones?.features?.filter(
    drone => !drone.properties.occupied
  ) || [];

  return (
    <div className="route-form-container">
      <h3>Generate Routes</h3>
      <form onSubmit={handleSubmit} className="route-form">
        <select
          value={formState.selectedDrone}
          onChange={(e) => setFormState(prev => ({ ...prev, selectedDrone: e.target.value }))}
          className="route-input"
          required
        >
          <option value="">--Choose Drone--</option>
          {availableDrones.map((drone) => (
            <option 
              key={drone.properties.serial_no} 
              value={drone.properties.name}
            >
              {drone.properties.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          value={formState.start}
          onChange={(e) => setFormState(prev => ({ ...prev, start: e.target.value }))}
          placeholder="Departure Healthcare Center"
          className="route-input"
          list="facilities-list"
          required
        />

        <input
          type="text"
          value={formState.end}
          onChange={(e) => setFormState(prev => ({ ...prev, end: e.target.value }))}
          placeholder="Destination Healthcare Center"
          className="route-input"
          list="facilities-list"
          required
        />

        <datalist id="facilities-list">
          {facilities?.features?.map((facility) => (
            <option 
              key={facility.geometry.coordinates.join(',')} 
              value={facility.properties.name} 
            />
          ))}
        </datalist>

        <button type="submit" className="route-submit">
          Create Route
        </button>
      </form>

      <style jsx>{`
        .route-form-container {
          padding: 20px;
          background: #fff;
          border-left: 1px solid #ddd;
          width: 300px;
        }

        .route-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .route-input {
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          width: 100%;
        }

        .route-submit {
          padding: 10px;
          background: #0066cc;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .route-submit:hover {
          background: #0052a3;
        }
      `}</style>
    </div>
  );
};

export default RouteForm;