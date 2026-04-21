import * as React from "react";
import type { SVGProps } from "react";
const SvgSafe16Filled = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 16 16"
    {...props}
  >
    <path fill="currentColor" d="M8 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4" />
    <path
      fill="currentColor"
      d="M3.334 1.333a2 2 0 0 0-2 2v9.333a2 2 0 0 0 2 2H4V16h1.333v-1.334h5.334V16H12v-1.334h.667a2 2 0 0 0 2-2V3.333a2 2 0 0 0-2-2zm8.552 3.724L10.78 6.16c.35.527.553 1.16.553 1.839 0 .68-.204 1.311-.553 1.838l1.105 1.105-.943.942-1.105-1.104A3.3 3.3 0 0 1 8 11.333c-.68 0-1.311-.203-1.838-.552l-1.105 1.104-.942-.942 1.104-1.105A3.3 3.3 0 0 1 4.667 8c0-.68.203-1.312.552-1.839L4.115 5.057l.942-.943 1.105 1.105A3.3 3.3 0 0 1 8 4.666c.68 0 1.312.204 1.838.553l1.105-1.105z"
    />
  </svg>
);
export default SvgSafe16Filled;
