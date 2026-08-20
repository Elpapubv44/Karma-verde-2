import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useStore } from "@/lib/store";

const leafIcon = L.divIcon({
  className: "",
  html: `<div style="
    width:36px;height:36px;display:grid;place-items:center;
    background:oklch(0.55 0.15 148);color:white;border-radius:50% 50% 50% 0;
    transform:rotate(-45deg);box-shadow:0 6px 14px -6px rgba(0,0,0,.4);
    border:2px solid oklch(0.98 0.02 90);font-size:18px;">
    <span style="transform:rotate(45deg);">🌿</span>
  </div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 34],
  popupAnchor: [0, -30],
});

export default function MapView() {
  const puntos = useStore((s) => s.puntosVerdes);
  const center: [number, number] = puntos.length ? [puntos[0].lat, puntos[0].lng] : [-34.6, -58.42];
  return (
    <MapContainer
      center={center}
      zoom={puntos.length ? 15 : 12}
      scrollWheelZoom
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {puntos.map((p) => (
        <Marker key={p.id} position={[p.lat, p.lng]} icon={leafIcon}>
          <Popup>
            <div style={{ fontFamily: "Nunito, sans-serif" }}>
              <strong style={{ fontSize: 14 }}>{p.nombre}</strong>
              <div style={{ fontSize: 12, marginTop: 4 }}>{p.materiales.join(" · ")}</div>
              <div style={{ fontSize: 12, marginTop: 4, color: "#2f6b3b" }}>
                ⭐ {p.puntosAcumulados} pts acumulados
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
