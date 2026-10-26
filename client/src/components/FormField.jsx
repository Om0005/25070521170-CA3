/**
 * Renders one field of a resource form.
 * Supported types: text, email, tel, number, date, select, textarea, checkbox.
 */
export default function FormField({ field, value, error, onChange }) {
  const id = `field-${field.name}`;
  const invalid = error ? ' is-invalid' : '';

  if (field.type === 'checkbox') {
    return (
      <label className="checkbox field--full" htmlFor={id}>
        <input
          id={id}
          type="checkbox"
          checked={Boolean(value)}
          onChange={(event) => onChange(field.name, event.target.checked)}
        />
        <span>
          <span className="checkbox__text">{field.label}</span>
          {field.hint ? <span className="checkbox__hint">{field.hint}</span> : null}
        </span>
      </label>
    );
  }

  const commonProps = {
    id,
    name: field.name,
    value: value ?? '',
    placeholder: field.placeholder || '',
    onChange: (event) => onChange(field.name, event.target.value),
    className: `input${invalid}`,
  };

  let control;

  if (field.type === 'select') {
    control = (
      <select
        id={id}
        name={field.name}
        value={value ?? ''}
        onChange={(event) => onChange(field.name, event.target.value)}
        className={`select${invalid}`}
      >
        <option value="">{field.placeholder || 'Select an option'}</option>
        {(field.options || []).map((option) => {
          const optionValue = typeof option === 'object' ? option.value : option;
          const optionLabel = typeof option === 'object' ? option.label : String(option);
          return (
            <option key={optionValue} value={optionValue}>
              {optionLabel}
            </option>
          );
        })}
      </select>
    );
  } else if (field.type === 'textarea') {
    control = (
      <textarea
        id={id}
        name={field.name}
        value={value ?? ''}
        placeholder={field.placeholder || ''}
        onChange={(event) => onChange(field.name, event.target.value)}
        className={`textarea${invalid}`}
        rows={field.rows || 4}
      />
    );
  } else {
    control = <input type={field.type || 'text'} {...commonProps} />;
  }

  return (
    <div className={`field${field.span === 'full' ? ' field--full' : ''}`}>
      <label className="field__label" htmlFor={id}>
        {field.label}
        {field.required ? <span className="req">*</span> : null}
      </label>
      {control}
      {error ? (
        <span className="field__error">{error}</span>
      ) : field.hint ? (
        <span className="field__hint">{field.hint}</span>
      ) : null}
    </div>
  );
}
