/**
 * Proyecto Software
 * 2025
 * @author Marcos Vivas
 */
import '@testing-library/jest-dom';

// Cualquier configuración adicional que necesites
window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {}
  };
};