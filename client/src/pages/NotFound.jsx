import { Link } from 'react-router-dom';
import { IconArrowRight, IconBuilding } from '../components/icons';

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: 24,
        background: 'var(--bg)',
      }}
    >
      <div className="card" style={{ maxWidth: 460, padding: 34, textAlign: 'center' }}>
        <div className="empty__icon" style={{ margin: '0 auto 14px' }}>
          <IconBuilding />
        </div>
        <h1 style={{ fontSize: 22, marginBottom: 6 }}>Page not found</h1>
        <p className="page__subtitle" style={{ marginBottom: 20 }}>
          The page you are looking for does not exist or may have been moved.
        </p>
        <Link to="/" className="btn btn--primary">
          Back to dashboard <IconArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}
