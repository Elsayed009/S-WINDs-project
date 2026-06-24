import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { planRouteApi } from '../api/routeApi';
import LocationAutocomplete from '../components/LocationAutocomplete';
import RouteLoadingSkeleton from '../components/routeLoadingSkeleton';
import { setCurrentTrip, setLoading, setError } from '../store/tripSlice';

const PlanTripPage = () => {
  const { handleSubmit, formState: { isSubmitting }, watch, setValue } = useForm({
    defaultValues: { vehicleType: 'car' },
  });
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [localError, setLocalError] = useState(null);
  const [isCalculating, setIsCalculating]= useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const vehicleType = watch('vehicleType');

  const onSubmit = async () => {
    if (!origin || !destination) {
      setLocalError('Please select both departure and destination locations');
      return;
    }

    setLocalError(null);
    setIsCalculating(true)
    dispatch(setLoading(true));

    try {
      const payload = { origin, destination, vehicleType };
      const response = await planRouteApi(payload);

      dispatch(setCurrentTrip(response.data.trip));
      navigate('/results');
    } catch (err) {
      const msg = err.response?.data?.msg || 'Failed to plan route';
      setLocalError(msg);
      dispatch(setError(msg));
    } finally {
      setIsCalculating(false);
      dispatch(setLoading(false));
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

          <button type="submit" disabled={isSubmitting|| isCalculating} style={styles.button}>
            {isCalculating ? 'Calculating Route...' : '▶ Plan My Route'}
          </button>

          {localError && <p style={styles.error}>{localError}</p>}
        </form>
      </div>
      {isCalculating && (
        <div style={styles.panel}>
          <h2 style={styles.panelTitle}> calculating route weather...</h2>
          <RouteLoadingSkeleton/>
          </div>
      )}
    </div>
  </div>
  );
};

const styles = {
  page: { minHeight: '100vh', background: '#0a0e14', padding: '24px', fontFamily: 'system-ui, sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  logo: { color: '#d4ff00', fontWeight: '700', fontSize: '1.1rem', letterSpacing: '1px' },
  status: { color: '#00e5cc', fontSize: '0.8rem' },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  panel: {
    background: '#11151c', borderRadius: '14px', padding: '24px',
    border: '1px solid rgba(212,255,0,0.1)', maxWidth: '480px',
  },
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
};

export default PlanTripPage;