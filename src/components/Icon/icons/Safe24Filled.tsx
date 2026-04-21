import * as React from "react";
import type { SVGProps } from "react";
const SvgSafe24Filled = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path fill="currentColor" d="M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6" />
    <path
      fill="currentColor"
      d="M5 2a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h1v2h2v-2h8v2h2v-2h1a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3zm12.828 5.586-1.656 1.657c.523.79.828 1.738.828 2.757s-.305 1.967-.828 2.757l1.656 1.657-1.414 1.414-1.657-1.656A4.98 4.98 0 0 1 12 17a4.98 4.98 0 0 1-2.757-.828l-1.657 1.656-1.414-1.414 1.656-1.657A4.98 4.98 0 0 1 7 12c0-1.02.305-1.967.828-2.757L6.172 7.586l1.414-1.414 1.657 1.656A4.98 4.98 0 0 1 12 7c1.02 0 1.967.305 2.757.828l1.657-1.656z"
    />
  </svg>
);
export default SvgSafe24Filled;
