// FIX: This file was causing module resolution conflicts with the `utils/selectors/` directory.
// It has been replaced with a barrel file that re-exports everything from the new modular selector structure.
// This resolves all "member not exported" errors and the incorrect type definition for PrimeDetails.
export * from './selectors/index';
