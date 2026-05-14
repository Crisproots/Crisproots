import React from 'react';

const BiosphereMixingIframe = () => (
  <div style={{ width: '100%', height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
    <h1 className="text-2xl font-bold mb-4">Biosphere Mixing</h1>
    <iframe
      src="http://localhost:8502"
      title="Biosphere Mixing Streamlit App"
      style={{ width: '100%', height: '100%', minHeight: '600px', border: 'none', flex: 1 }}
      allow="clipboard-read; clipboard-write"
    />
  </div>
);

export default BiosphereMixingIframe; 