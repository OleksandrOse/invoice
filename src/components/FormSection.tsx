import React from 'react';
import '../styles/FormSection.scss';

interface Props {
  label: string;
  children: React.ReactNode;
}

export const FormSection: React.FC<Props> = ({ label, children }) => (
  <div className="section">
    <span className="sectionLabel">{label}</span>
    {children}
  </div>
);
