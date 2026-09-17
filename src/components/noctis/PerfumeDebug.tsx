"use client";

import { useState } from "react";
import { PerfumeAssembly, type AssemblyState } from "./PerfumeAssembly";
import { ASSEMBLY, LAYER_ORDER, layerBox, STAGE, EXPLODED, EXPLODED_COMPACT } from "@/config/perfumeAssemblyConfig";

/**
 * /?debugPerfume=true — ferramenta de calibração (não é carregada em produção).
 * Gabarito: noctis-full.webp é renderizado pelo sharp a partir do MESMO config; se as camadas CSS
 * coincidem com ele, o posicionamento em CSS está correto. A vista explodida original pode ser
 * sobreposta para conferir a ordem das peças.
 */
export default function PerfumeDebug() {
  const [state, setState] = useState<AssemblyState>("assembled");
  const [refOpacity, setRefOpacity] = useState(0.25);
  const [ref, setRef] = useState<"full" | "exploded" | "none">("full");
  const [boxes, setBoxes] = useState(true);
  const exploded = state !== "assembled";
  const offsets = state === "exploded-compact" ? EXPLODED_COMPACT : EXPLODED;

  return (
    <main className="debug-root">
      <div className={`debug-canvas ${exploded ? "is-exploded" : ""}`}>
        <PerfumeAssembly staticState={state}>
          {ref === "full" && !exploded && (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="debug-ref" src="/images/noctis/noctis-full.webp" alt="" style={{ opacity: refOpacity }} />
          )}
          {boxes &&
            LAYER_ORDER.map((id) => {
              const b = layerBox(id);
              const off = exploded ? offsets[id] : { x: 0, y: 0 };
              return (
                <div
                  key={id}
                  className="debug-box"
                  style={{
                    left: `${((b.left + off.x) / STAGE.width) * 100}%`,
                    top: `${((b.top + off.y) / STAGE.height) * 100}%`,
                    width: `${b.pct.width}%`,
                    height: `${b.pct.height}%`,
                  }}
                >
                  <span>
                    {id} z{ASSEMBLY[id].zIndex}
                  </span>
                  <i />
                </div>
              );
            })}
        </PerfumeAssembly>
        {ref === "exploded" && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/images/noctis/noctis-exploded-reference.webp"
            alt=""
            style={{ position: "absolute", right: 16, top: 16, height: "60vh", opacity: Math.max(refOpacity, 0.6) }}
          />
        )}
      </div>

      <aside className="debug-panel">
        <strong>NOCTIS · perfume debug</strong>
        <p>Stage {STAGE.width}×{STAGE.height}u · edite src/config/perfumeAssemblyConfig.ts</p>
        <p>
          state{" "}
          <select value={state} onChange={(e) => setState(e.target.value as AssemblyState)}>
            <option value="assembled">assembled</option>
            <option value="exploded">exploded</option>
            <option value="exploded-compact">exploded-compact</option>
          </select>
        </p>
        <p>
          reference{" "}
          <select value={ref} onChange={(e) => setRef(e.target.value as typeof ref)}>
            <option value="full">composite (sharp)</option>
            <option value="exploded">exploded original</option>
            <option value="none">none</option>
          </select>
        </p>
        <p>
          opacity {refOpacity.toFixed(2)}{" "}
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={refOpacity}
            onChange={(e) => setRefOpacity(+e.target.value)}
          />
        </p>
        <p>
          <label>
            <input type="checkbox" checked={boxes} onChange={(e) => setBoxes(e.target.checked)} /> bounding boxes
          </label>
        </p>
        <table>
          <thead>
            <tr>
              <th>layer</th>
              <th>z</th>
              <th>x,y</th>
              <th>scale</th>
              <th>w×h</th>
            </tr>
          </thead>
          <tbody>
            {LAYER_ORDER.map((id) => {
              const c = ASSEMBLY[id];
              const b = layerBox(id);
              return (
                <tr key={id} data-debug-row={id}>
                  <td>{id}</td>
                  <td>{c.zIndex}</td>
                  <td>
                    {c.x},{c.y}
                  </td>
                  <td>{c.scale}</td>
                  <td>
                    {b.width.toFixed(0)}×{b.height.toFixed(0)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </aside>
    </main>
  );
}
