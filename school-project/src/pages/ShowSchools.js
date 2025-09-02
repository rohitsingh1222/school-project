import React, { useEffect, useState } from "react";
import API from "../api"; // ✅ use axios instance

export default function ShowSchools() {
  const [schools, setSchools] = useState([]);

  useEffect(() => {
    API.get("/schools")
      .then((res) => setSchools(res.data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  return (
    <div style={{ maxWidth: 1100, margin: "20px auto", padding: 10 }}>
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>Schools</h2>

      {schools.length === 0 ? (
        <p style={{ textAlign: "center" }}>No schools available yet.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: 20,
          }}
        >
          {schools.map((s) => (
            <div
              key={s.id}
              style={{
                padding: 12,
                border: "1px solid #ddd",
                borderRadius: 8,
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.02)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              {s.image && (
                <img
                  src={s.image}
                  alt={s.name}
                  style={{
                    width: "100%",
                    height: 160,
                    objectFit: "cover",
                    borderRadius: 6,
                  }}
                />
              )}
              <h3 style={{ margin: "10px 0 5px" }}>{s.name}</h3>
              <p style={{ margin: 0 }}>{s.address}</p>
              <p style={{ margin: 0, color: "#555" }}>{s.city}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
