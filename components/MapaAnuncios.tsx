"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, Loader2, X } from "lucide-react";

type Truck = {
  id: string;
  titulo: string;
  preco: number | null;
  cidade: string;
  estado: string;
  lat?: number;
  lng?: number;
  imagem?: string;
  slug?: string;
};

type Props = {
  trucks: Truck[];
};

// Coordenadas aproximadas por estado (centroides)
const COORDS_ESTADO: Record<string, [number, number]> = {
  AC: [-9.02, -70.81], AL: [-9.57, -36.78], AM: [-3.47, -65.10], AP: [1.41, -51.77],
  BA: [-12.97, -41.33], CE: [-5.20, -39.53], DF: [-15.78, -47.93], ES: [-19.19, -40.34],
  GO: [-15.83, -49.84], MA: [-5.42, -45.44], MG: [-18.10, -44.38], MS: [-20.51, -54.54],
  MT: [-12.64, -55.42], PA: [-3.42, -52.29], PB: [-7.24, -36.68], PE: [-8.38, -37.86],
  PI: [-7.72, -42.73], PR: [-24.89, -51.55], RJ: [-22.25, -42.66], RN: [-5.81, -36.59],
  RO: [-10.83, -63.34], RR: [2.09, -61.66], RS: [-30.03, -53.23], SC: [-27.45, -50.95],
  SE: [-10.57, -37.45], SP: [-22.95, -48.55], TO: [-10.18, -48.33],
};

export function MapaAnuncios({ trucks }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [carregando, setCarregando] = useState(true);
  const [selecionado, setSelecionado] = useState<Truck | null>(null);
  const [mapaAtivo, setMapaAtivo] = useState(false);

  useEffect(() => {
    if (!mapaAtivo) return;
    let map: import("leaflet").Map;
    let L: typeof import("leaflet");

    async function iniciarMapa() {
      setCarregando(true);
      L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css" as string);

      if (!mapRef.current) return;

      map = L.map(mapRef.current, {
        center: [-15.78, -47.93],
        zoom: 4,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 18,
      }).addTo(map);

      // Adiciona pinos
      trucks.forEach((truck) => {
        const coords = COORDS_ESTADO[truck.estado];
        if (!coords) return;

        // Offset aleatório para não sobrepor pinos do mesmo estado
        const jitter = () => (Math.random() - 0.5) * 1.2;
        const lat = (truck.lat ?? coords[0]) + jitter();
        const lng = (truck.lng ?? coords[1]) + jitter();

        const icon = L.divIcon({
          className: "",
          html: `<div style="
            background:#2563eb;
            color:#fff;
            border-radius:50%;
            width:28px;
            height:28px;
            display:flex;
            align-items:center;
            justify-content:center;
            font-size:11px;
            font-weight:800;
            border:2px solid #fff;
            box-shadow:0 2px 8px rgba(0,0,0,.3);
            cursor:pointer;
          ">&#128650;</div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        L.marker([lat, lng], { icon })
          .addTo(map)
          .on("click", () => setSelecionado(truck));
      });

      setCarregando(false);
    }

    iniciarMapa();
    return () => { map?.remove(); };
  }, [mapaAtivo, trucks]);

  // Agrupa por estado para mostrar contagem
  const porEstado = trucks.reduce((acc, t) => {
    acc[t.estado] = (acc[t.estado] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topEstados = Object.entries(porEstado)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  return (
    <div className="mapa-container">
      {!mapaAtivo ? (
        // Preview antes de carregar o mapa
        <div className="mapa-preview">
          <div className="mapa-preview-header">
            <MapPin size={20} />
            <h3>Mapa de anúncios</h3>
            <span className="mapa-total">{trucks.length} caminhões</span>
          </div>

          <div className="mapa-estados">
            {topEstados.map(([estado, qtd]) => (
              <div key={estado} className="mapa-estado-pill">
                <strong>{estado}</strong>
                <span>{qtd}</span>
              </div>
            ))}
          </div>

          <button className="mapa-abrir-btn" onClick={() => setMapaAtivo(true)}>
            <MapPin size={16} />
            Ver no mapa
          </button>
        </div>
      ) : (
        <div className="mapa-ativo">
          {carregando && (
            <div className="mapa-loading">
              <Loader2 size={24} className="spin" />
              <span>Carregando mapa...</span>
            </div>
          )}
          <div ref={mapRef} className="mapa-leaflet" />

          {/* Card do truck selecionado */}
          {selecionado && (
            <div className="mapa-card">
              <button className="mapa-card-close" onClick={() => setSelecionado(null)}>
                <X size={14} />
              </button>
              {selecionado.imagem && (
                <img src={selecionado.imagem} alt={selecionado.titulo} className="mapa-card-img" />
              )}
              <div className="mapa-card-info">
                <strong>{selecionado.titulo}</strong>
                <span>{selecionado.cidade}, {selecionado.estado}</span>
                {selecionado.preco && (
                  <span className="mapa-card-preco">
                    R$ {selecionado.preco.toLocaleString("pt-BR")}
                  </span>
                )}
                {selecionado.slug && (
                  <a href={`/caminhoes/${selecionado.slug}`} className="mapa-card-link">
                    Ver anúncio →
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <style>{`
        .mapa-container { width: 100%; }
        .mapa-preview {
          border: 1.5px solid #343a40;
          border-radius: 16px;
          padding: 20px;
          background: #1f2327;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .mapa-preview-header {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #e8eaed;
          font-size: 16px;
        }
        .mapa-preview-header h3 { margin: 0; font-size: 16px; font-weight: 800; }
        .mapa-total {
          margin-left: auto;
          background: #22c55e22;
          color: #4ade80;
          font-size: 12px;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 20px;
        }
        .mapa-estados { display: flex; gap: 8px; flex-wrap: wrap; }
        .mapa-estado-pill {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 5px 12px;
          background: #15181b;
          border: 1px solid #343a40;
          border-radius: 20px;
          font-size: 13px;
          color: #e8eaed;
        }
        .mapa-estado-pill strong { color: #93c5fd; }
        .mapa-estado-pill span { color: #6b7280; }
        .mapa-abrir-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          background: #2563eb;
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          width: fit-content;
          transition: background 0.15s;
        }
        .mapa-abrir-btn:hover { background: #1d4ed8; }
        .mapa-ativo { position: relative; border-radius: 16px; overflow: hidden; height: 480px; border: 1px solid #343a40; }
        .mapa-leaflet { width: 100%; height: 100%; }
        .mapa-loading {
          position: absolute;
          inset: 0;
          background: #1f2327;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 10px;
          color: #a7afb7;
          z-index: 10;
        }
        .mapa-card {
          position: absolute;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          width: 280px;
          background: #1f2327;
          border: 1px solid #343a40;
          border-radius: 14px;
          padding: 12px;
          z-index: 1000;
          display: flex;
          gap: 10px;
          box-shadow: 0 8px 24px rgba(0,0,0,.4);
        }
        .mapa-card-close {
          position: absolute;
          top: 8px;
          right: 8px;
          background: #343a40;
          border: none;
          border-radius: 6px;
          padding: 3px;
          cursor: pointer;
          color: #e8eaed;
          display: flex;
        }
        .mapa-card-img { width: 72px; height: 56px; object-fit: cover; border-radius: 8px; flex-shrink: 0; }
        .mapa-card-info { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
        .mapa-card-info strong { color: #e8eaed; font-size: 13px; line-height: 1.3; }
        .mapa-card-info span { color: #6b7280; font-size: 12px; }
        .mapa-card-preco { color: #4ade80 !important; font-weight: 700 !important; font-size: 13px !important; }
        .mapa-card-link {
          color: #93c5fd;
          font-size: 12px;
          font-weight: 700;
          text-decoration: none;
          margin-top: 2px;
        }
        .spin { animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 600px) {
          .mapa-ativo { height: 360px; }
          .mapa-card { width: calc(100% - 32px); }
        }
      `}</style>
    </div>
  );
}
