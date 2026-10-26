import { Link } from 'react-router-dom';

/**
 * Visualises the portal's user flow as numbered, connected steps.
 * A step becomes a link when it has a `to` path.
 */
export default function FlowSteps({ steps = [], compact = false, label = 'Portal workflow' }) {
  return (
    <div className={`flow${compact ? ' flow--compact' : ''}`} role="list" aria-label={label}>
      {steps.map((step, index) => {
        const inner = (
          <>
            <span className="flow__num" aria-hidden="true">
              {index + 1}
            </span>
            <span className="flow__body">
              <span className="flow__label">{step.label}</span>
              {step.hint ? <span className="flow__hint">{step.hint}</span> : null}
            </span>
          </>
        );

        return step.to ? (
          <Link key={step.label} to={step.to} className="flow__step" role="listitem">
            {inner}
          </Link>
        ) : (
          <div key={step.label} className="flow__step" role="listitem">
            {inner}
          </div>
        );
      })}
    </div>
  );
}
