import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { planRouteApi } from '../api/routeApi';
import WaypointCard from '../components/WaypointCard';
import LocationAutocomplete from '../components/LocationAutocomplete';

const PlanTripPage = () => {
  const { handleSubmit, formState: { isSubmitting }, watch, setValue } = useForm({
    defaultValues: { vehicleType: 'car' },
  });
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [trip, setTrip] = useState(null);
  const [error, setError] = useState(null);

  const vehicleType = watch('vehicleType');

  const onSubmit = async () => {
    if (!origin || !destination) {
      setError('Please select both departure and destination locations');
      return;
    }

    setError(null);
    try {
      const payload = { origin, destination, vehicleType };
      const response = await planRouteApi(payload);
      setTrip(response.data.trip);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to plan route');
    }
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <span style={styles.logo}>⚡ S-WINDS</span>
        <span style={styles.status}>● SYSTEM ONLINE</span>
      </header>

      <div style={styles.grid}>

        <div style={styles.panel}>
          <h2 style={styles.panelTitle}>Route Configuration</h2>

          <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
            <LocationAutocomplete
              label="Departure Station"
              placeholder="Type a city or address..."
              onSelect={setOrigin}
            />

            <LocationAutocomplete
              label="Destination Station"
              placeholder="Type a city or address..."
              onSelect={setDestination}
            />

            <label style={styles.label}>Vehicle Class</label>
            <div style={styles.vehicleRow}>
              {['car', 'truck', 'motorcycle'].map((v) => (
                <div
                  key={v}
                  style={{
                    ...styles.vehicleOption,
                    ...(vehicleType === v ? styles.vehicleOptionActive : {}),
                  }}
                  onClick={() => setValue('vehicleType', v)}
                >
                  {v.toUpperCase()}
                </div>
              ))}
            </div>

            <button type="submit" disabled={isSubmitting} style={styles.button}>
              {isSubmitting ? 'Calculating Route...' : '▶ Plan My Route'}
            </button>

            {error && <p style={styles.error}>{error}</p>}
          </form>
        </div>

        <div style={styles.panel}>
          <h2 style={styles.panelTitle}>
            {trip ? 'Route Weather Timeline (ETA Based)' : 'Smart Departure Optimizer'}
          </h2>

          {!trip && (
            <p style={styles.placeholder}>Fill in your route to see the weather forecast along the way.</p>
          )}

          {trip && (
            <>
              <div style={styles.summaryRow}>
                <span style={styles.summaryItem}>📏 {trip.totalDistanceKm.toFixed(0)} km</span>
                <span style={styles.summaryItem}>⏱ {Math.round(trip.totalDurationMin)} min</span>
                <span style={{ ...styles.summaryItem, color: trip.overallRiskLevel === 'high' ? '#ff4d4d' : '#d4ff00' }}>
                  Risk: {trip.overallRiskLevel.toUpperCase()}
                </span>
              </div>

              {trip.waypoints.map((wp, i) => (
                <WaypointCard
                  key={i}
                  waypoint={wp}
                  index={i}
                  isFirst={i === 0}
                  isLast={i === trip.waypoints.length - 1}
                />
              ))}
            </>
          )}
        </div>

      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', background: '#0a0e14', padding: '24px', fontFamily: 'system-ui, sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  logo: { color: '#d4ff00', fontWeight: '700', fontSize: '1.1rem', letterSpacing: '1px' },
  status: { color: '#00e5cc', fontSize: '0.8rem' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '20px' },
  panel: { background: '#11151c', borderRadius: '14px', padding: '24px', border: '1px solid rgba(212,255,0,0.1)' },
  panelTitle: { color: '#fff', fontSize: '1.1rem', marginBottom: '20px' },
  form: { display: 'flex', flexDirection: 'column', gap: '14px' },
  label: { color: '#8a93a3', fontSize: '0.75rem', marginTop: '8px', textTransform: 'uppercase' },
  vehicleRow: { display: 'flex', gap: '8px' },
  vehicleOption: {
    flex: 1, textAlign: 'center', padding: '10px', borderRadius: '8px',
    border: '1px solid #2a2f3a', color: '#8a93a3', fontSize: '0.8rem', cursor: 'pointer',
  },
  vehicleOptionActive: {
    border: '1px solid #d4ff00', color: '#d4ff00', boxShadow: '0 0 8px rgba(212,255,0,0.3)',
  },
  button: {
    marginTop: '10px', background: '#d4ff00', color: '#0a0e14', border: 'none',
    borderRadius: '10px', padding: '14px', fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer',
  },
  error: { color: '#ff4d4d', fontSize: '0.8rem', marginTop: '8px' },
  placeholder: { color: '#8a93a3', fontSize: '0.85rem' },
  summaryRow: { display: 'flex', gap: '16px', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #2a2f3a' },
  summaryItem: { color: '#fff', fontSize: '0.85rem' },
};

export default PlanTripPage;