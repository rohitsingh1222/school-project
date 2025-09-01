import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ShowSchools() {
  const [schools, setSchools] = useState([]);

  useEffect(() => {
    // ✅ Use relative API path for Vercel
    axios.get("/api/schools")
      .then(res => setSchools(res.data))
      .catch(err => console.error('Fetch error:', err));
  }, []);

  return (
    <div style={{ maxWidth: 1100, margin: '20px auto', padding: 10 }}>
      <h2>Schools</h2>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20
      }}>
        {schools.map(s => (
          <div key={s.id} style={{ padding: 12, border: '1px solid #ddd', borderRadius: 8 }}>
            {s.image ? (
              // ✅ Use the image URL returned from Cloudinary
              <img
                src={s.image}
                alt={s.name}
                style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 6 }}
              />
            ) : null}
            <h3>{s.name}</h3>
            <p>{s.address}</p>
            <p>{s.city}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
