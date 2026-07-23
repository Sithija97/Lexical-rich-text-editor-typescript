import type { JSX } from "react";
import { useState } from "react";

import "./ColorPicker.css";

const SWATCHES = [
  "#000000",
  "#4c4c4c",
  "#808080",
  "#b3b3b3",
  "#ffffff",
  "#ff3b30",
  "#ff9500",
  "#ffcc00",
  "#34c759",
  "#00c7be",
  "#30b0c7",
  "#32ade6",
  "#007aff",
  "#5856d6",
  "#af52de",
  "#ff2d55",
];

const HEX_COLOR_RE = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

export default function ColorPicker({
  color,
  onChange,
}: {
  color: string;
  onChange: (value: string) => void;
}): JSX.Element {
  const [hexInput, setHexInput] = useState(color);

  const commitHex = (value: string) => {
    setHexInput(value);
    if (HEX_COLOR_RE.test(value)) {
      onChange(value);
    }
  };

  return (
    <div className="color-picker">
      <div className="color-picker-swatches">
        {SWATCHES.map((swatch) => (
          <button
            key={swatch}
            type="button"
            className={
              "color-picker-swatch" +
              (swatch.toLowerCase() === color.toLowerCase() ? " active" : "")
            }
            style={{ backgroundColor: swatch }}
            title={swatch}
            aria-label={`Set color ${swatch}`}
            onClick={() => {
              setHexInput(swatch);
              onChange(swatch);
            }}
          />
        ))}
      </div>
      <div className="color-picker-hex-row">
        <input
          type="color"
          value={HEX_COLOR_RE.test(color) ? color : "#000000"}
          onChange={(e) => commitHex(e.target.value)}
          aria-label="Pick a custom color"
        />
        <input
          type="text"
          value={hexInput}
          onChange={(e) => commitHex(e.target.value)}
          placeholder="#000000"
          aria-label="Color hex value"
        />
      </div>
    </div>
  );
}
