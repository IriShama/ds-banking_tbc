import * as React from "react";
import type { SVGProps } from "react";
const SvgSafe32Filled = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 32 32"
    {...props}
  >
    <path fill="currentColor" d="M16 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8" />
    <path
      fill="currentColor"
      d="M6.667 2.667a4 4 0 0 0-4 4v18.667a4 4 0 0 0 4 4H8V32h2.667v-2.666h10.666V32H24v-2.666h1.333a4 4 0 0 0 4-4V6.667a4 4 0 0 0-4-4zm17.104 7.448-2.209 2.209A6.64 6.64 0 0 1 22.666 16a6.64 6.64 0 0 1-1.104 3.677l2.209 2.209-1.886 1.886-2.209-2.21A6.64 6.64 0 0 1 16 22.668a6.64 6.64 0 0 1-3.677-1.105l-2.209 2.21-1.885-1.886 2.209-2.21A6.64 6.64 0 0 1 9.333 16c0-1.358.407-2.622 1.105-3.676l-2.21-2.21 1.886-1.885 2.21 2.21A6.64 6.64 0 0 1 16 9.333c1.359 0 2.622.406 3.676 1.104l2.21-2.209z"
    />
  </svg>
);
export default SvgSafe32Filled;
