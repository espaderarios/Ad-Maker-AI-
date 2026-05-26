import React from 'react';

export default function SplitLayout({ left, children, leftClassName = '', rightClassName = '' }) {
  return (
    <main className="container-split">
      <div className={`left-hero ${leftClassName}`}>{left}</div>
      <section className={`right-panel ${rightClassName}`}>
        {children}
      </section>
    </main>
  );
}
