import js from "@eslint/js";
import globals from "globals";

export default [
  {
    ignores: ["**/leaflet.js", "dist/**", "node_modules/**"]
  },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.es2021,
        // Define cross-file globals to avoid "no-undef" errors
        APP_DATA: "readonly",
        L: "readonly",
        showToast: "readonly",
        
        // Functions from main.js called by templates.js / inline HTML event handlers
        openModal: "readonly",
        closeModal: "readonly",
        toggleModalFavorite: "readonly",
        shareCraft: "readonly",
        closeWeatherModal: "readonly",
        closePhotoGallery: "readonly",
        closeGalleryModal: "readonly",
        closeAuthModal: "readonly",
        toggleMobileMenu: "readonly",
        toggleFavoriteCard: "readonly",
        toggleAIChat: "readonly",
        handleChatSubmit: "readonly",
        handleAuthLogin: "readonly",
        handleAuthRegister: "readonly",
        switchAuthTab: "readonly",
        confirmGeolocation: "readonly",
        cancelGeolocation: "readonly",
        stopGeolocation: "readonly",
        toggleGeoConfirm: "readonly",
        setGridCols: "readonly",
        selectWorkshopDetail: "readonly",
        toggleSpeakDescription: "readonly",
        loginUser: "readonly",
        registerUser: "readonly",
        refreshCraftsReviews: "readonly",
        applyFilters: "readonly",
        initMainMap: "readonly",
        initCraftMap: "readonly",
        applyMapFilters: "readonly",
        resetMapFilters: "readonly",
        resetFilterGroup: "readonly",
        openPhotoGallery: "readonly",
        openSeriesGallery: "readonly",
        openVideoGallery: "readonly",
        setReviewRating: "readonly",
        handlePhotoUpload: "readonly",
        openAuthModal: "readonly",
        logoutUser: "readonly",
        getCurrentUser: "readonly",
        handleReviewSubmit: "readonly",
        openWeatherModal: "readonly",
        
        // Functions from map.js used in main.js
        initLeafletMap: "readonly",
        addWorkshopMarker: "readonly",
        addUserLocationMarker: "readonly",
        getMapInstance: "readonly",
        destroyMap: "readonly",
        resetMapView: "readonly",
        invalidateMapSize: "readonly",
        
        // Globals used in templates.js
        currentReviewsLimit: "writable",
        currentReviewSort: "writable"
      }
    },
    rules: {
      "no-unused-vars": ["warn", { "vars": "all", "args": "none", "caughtErrors": "none" }],
      "no-empty": ["warn", { "allowEmptyCatch": true }],
      "no-undef": "warn"
    }
  }
];
