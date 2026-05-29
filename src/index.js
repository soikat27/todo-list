/**
 * App entry point.
 * Loads global styles and boots UiController (load data → listeners → render).
 */
import "./styles/normalize.css";
import "./styles/style.css";

import UiController from "./modules/ui-controller.js";

UiController.initializeApp();
