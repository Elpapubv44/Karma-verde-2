import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useStore } from "@/lib/store";

const leafIcon = L.divIcon({
  className: "",
  html: `<div style="
    width:38px;height:38px;display:grid;place-items:center;
    background:#3b7a44;color:white;border-radius:50% 50% 50% 0;
    transform:rotate(-45deg);box-shadow:0 8px 16px -4px rgba(0,0,0,.35);
    border:2.5px solid #fffdfa;font-size:20px;">
    <span style="transform:rotate(45deg);">🌿</span>
  </div>`,
  iconSize: [38, 38],
  iconAnchor: [19, 36],
  popupAnchor: [0, -32],
});

export default function MapView() {
  const puntos = useStore((s) => s.puntosVerdes);
  const center: [number, number] = puntos.length
    ? [puntos[0].lat, puntos[0].lng]
    : [-34.6037, -58.3816];

  return (
    <MapContainer
      center={center}
      zoom={puntos.length ? 14 : 12}
      scrollWheelZoom
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {puntos.map((p) => {
        const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`;
        return (
          <Marker key={p.id} position={[p.lat, p.lng]} icon={leafIcon}>
            <Popup>
              <div
                style={{
                  fontFamily: "Nunito, sans-serif",
                  minWidth: "200px",
                  padding: "4px 2px",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}
                >
                  <span
                    style={{
                      background: p.activo !== false ? "#e8f5e9" : "#ffebee",
                      color: p.activo !== false ? "#2e7d32" : "#c62828",
                      fontSize: "10px",
                      fontWeight: 800,
                      padding: "2px 6px",
                      borderRadius: "9999px",
                      textTransform: "uppercase",
                    }}
                  >
                    {p.activo !== false ? "● Abierto" : "○ En pausa"}
                  </span>
                  <span style={{ fontSize: "11px", color: "#666", fontWeight: 700 }}>
                    {p.escuela}
                  </span>
                </div>

                <strong style={{ fontSize: "14px", color: "#1b3320", display: "block" }}>
                  {p.nombre}
                </strong>

                {p.direccion && (
                  <p style={{ fontSize: "12px", color: "#555", margin: "4px 0 2px" }}>
                    📍 {p.direccion}
                  </p>
                )}

                {p.horario && (
                  <p style={{ fontSize: "11px", color: "#777", margin: "2px 0 6px" }}>
                    🕒 {p.horario}
                  </p>
                )}

                <div style={{ display: "flex", flexWrap: "wrap", gap: "3px", margin: "6px 0" }}>
                  {p.materiales.map((m) => (
                    <span
                      key={m}
                      style={{
                        fontSize: "10px",
                        background: "#f0ece1",
                        color: "#4a3e2c",
                        padding: "1px 6px",
                        borderRadius: "6px",
                        fontWeight: 700,
                      }}
                    >
                      {m}
                    </span>
                  ))}
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: "8px",
                    paddingTop: "6px",
                    borderTop: "1px dashed #ccc",
                  }}
                >
                  <span style={{ fontSize: "12px", fontWeight: 800, color: "#3b7a44" }}>
                    ⭐ {p.puntosAcumulados} pts
                  </span>
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: "11px",
                      fontWeight: 800,
                      color: "#1e5b2b",
                      textDecoration: "underline",
                    }}
                  >
                    Cómo llegar →
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
