// Course 1 — deep-dive content (lessons 101-105).
// This whole module is loaded as a SEPARATE dynamic chunk by DeepDiveSection,
// so its thousands of words never weigh on the initial lesson-page bundle.
import { DEEP_DIVE_101 } from "./lesson101.js";
import { DEEP_DIVE_102 } from "./lesson102.js";
import { DEEP_DIVE_103 } from "./lesson103.js";
import { DEEP_DIVE_104 } from "./lesson104.js";
import { DEEP_DIVE_105 } from "./lesson105.js";

export default {
  101: DEEP_DIVE_101,
  102: DEEP_DIVE_102,
  103: DEEP_DIVE_103,
  104: DEEP_DIVE_104,
  105: DEEP_DIVE_105,
};
