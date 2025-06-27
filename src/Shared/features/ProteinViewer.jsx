import React, { useEffect, useRef, useState } from "react";
import * as $3Dmol from "3dmol";

const BACKEND = "https://two4-cp-backend2.onrender.com";

export default function ProteinViewer({ pdbId }) {
  const boxRef    = useRef(null);
  const viewerRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

    useEffect(() => {
    if (!pdbId) return;
    setLoading(true); setError(null);

    const file = `${pdbId}.pdb`;
    fetch(`${BACKEND}/filtered_pdbs/${file}`)
        .then(r => (r.ok ? r.text() : Promise.reject(r.status)))
        .then(text => createViewer(text))
        .catch(e => setError(`Load failed: ${e}`))
        .finally(() => setLoading(false));
    }, [pdbId]);


    const createViewer = (pdbText) => {
    const tryInit = () => {
        const box = boxRef.current;
        if (!box || !document.body.contains(box)) return;

        const width = box.clientWidth;
        const height = box.clientHeight;

        if (width > 10 && height > 10) {
        viewerRef.current = window.$3Dmol.createViewer(box, {
            backgroundColor: "white",
        });

        viewerRef.current.addModel(pdbText, "pdb");
        viewerRef.current.setStyle({}, { cartoon: { color: "spectrum" } });
        viewerRef.current.zoomTo();
        viewerRef.current.render();

        const ro = new ResizeObserver(() => {
            try {
            viewerRef.current.resize();
            viewerRef.current.render();
            } catch (err) {
            console.warn("Viewer resize/render error:", err);
            }
        });
        ro.observe(box);
        } else {
        requestAnimationFrame(tryInit);
        }
    };

    tryInit();
    }

  useEffect(() => () => {
    if (viewerRef.current) viewerRef.current.clear();
  }, []);

  return (
    <div
      ref={boxRef}
      style={{ width: "100%", height: "100%", position: "relative" }}
    >
      {loading && <span style={{ position: "absolute", top: 8, left: 8 }}>Loading…</span>}
      {error   && <span style={{ color: "red" }}>{error}</span>}
    </div>
  );
}
