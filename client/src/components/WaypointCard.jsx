import { getRiskColor, getRiskLabel } from '../utils/riskColors';

const WaypointCard = ({ waypoint, index, isFirst, isLast }) => {
  const color = getRiskColor(waypoint.weather.riskLevel);
  const label = getRiskLabel(waypoint.weather.riskLevel);
  const time = new Date(waypoint.eta).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const conditionIcons = {
    clear: '☀️',
    rain: '🌧️',
    fog: '🌫️',
    sandstorm: '💨',
    snow: '❄️',
  };

  return (
    <div style={{
      ...styles.card,
      borderLeft: `3px solid ${color}`,
      boxShadow: isFirst || isLast ? `0 0 16px ${color}33` : 'none',
    }}>
      <div style={styles.left}>
        <span style={styles.km}>
          KM {Math.round(waypoint.distanceFromStart * 10) / 10}
        </span>
        <span style={styles.time}>{isFirst ? 'NOW' : `ETA ${time}`}</span>
      </div>

      <div style={styles.icon}>{conditionIcons[waypoint.weather.condition] || '🌤️'}</div>

      <div style={styles.middle}>
        <p style={styles.condition}>{waypoint.weather.condition}</p>
        <p style={styles.detail}>
          Safe speed: {waypoint.safeSpeed} km/h · Visibility {waypoint.weather.visibility}km
        </p>
      </div>

      <div style={{ ...styles.badge, color, borderColor: color }}>
        {label}
      </div>
    </div>
  );
};

const styles = {
  card: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    background: '#11151c',
    borderRadius: '10px',
    padding: '14px 16px',
    marginBottom: '10px',
  },
  left: { display: 'flex', flexDirection: 'column', minWidth: '70px' },
  km: { color: '#fff', fontSize: '0.8rem', fontWeight: '600' },
  time: { color: '#8a93a3', fontSize: '0.7rem', textTransform: 'uppercase' },
  icon: { fontSize: '1.6rem' },
  middle: { flex: 1 },
  condition: { color: '#fff', fontSize: '0.9rem', fontWeight: '600', margin: 0, textTransform: 'capitalize' },
  detail: { color: '#8a93a3', fontSize: '0.75rem', margin: '2px 0 0 0' },
  badge: {
    fontSize: '0.7rem',
    fontWeight: '700',
    padding: '4px 10px',
    borderRadius: '6px',
    border: '1px solid',
    background: 'transparent',
  },
};

export default WaypointCard;