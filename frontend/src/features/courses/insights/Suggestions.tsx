import React from 'react';

interface Props {
  suggestions: string[];
}

const Suggestions: React.FC<Props> = ({ suggestions }) => {
  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="alert alert-info mt-4">
      <h5 className="alert-heading">¡Sugerencias para ti!</h5>
      <ul className="mb-0">
        {suggestions.map((suggestion, index) => (
          <li key={index}>{suggestion}</li>
        ))}
      </ul>
    </div>
  );
};

export default Suggestions;
