import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  onSnapshot,
  Timestamp
} from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { UserInfo } from 'firebase/auth';
import { LocationDef } from '../../types/locations';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map((provider: UserInfo) => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const LOCATION_COLLECTION = 'locations';

export const locationService = {
  /**
   * Fetches all locations from Firestore.
   */
  async getAllLocations(): Promise<LocationDef[]> {
    try {
      const q = query(collection(db, LOCATION_COLLECTION), orderBy('label'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ ...doc.data() } as LocationDef));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, LOCATION_COLLECTION);
      return [];
    }
  },

  /**
   * Subscribes to real-time updates for all locations.
   */
  subscribeToLocations(callback: (locations: LocationDef[]) => void) {
    const q = query(collection(db, LOCATION_COLLECTION), orderBy('label'));
    return onSnapshot(q, (snapshot) => {
      const locations = snapshot.docs.map(doc => ({ ...doc.data() } as LocationDef));
      callback(locations);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, LOCATION_COLLECTION);
    });
  },

  /**
   * Saves a location to Firestore.
   */
  async saveLocation(location: Partial<LocationDef>): Promise<void> {
    if (!location.id) throw new Error("Location ID is required.");
    
    const locationRef = doc(db, LOCATION_COLLECTION, location.id);
    
    const data = {
      ...location,
      updatedAt: Timestamp.now(),
      updatedBy: auth.currentUser?.uid || 'anonymous'
    };

    try {
      await setDoc(locationRef, data, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `${LOCATION_COLLECTION}/${location.id}`);
    }
  },

  /**
   * Deletes a location from Firestore.
   */
  async deleteLocation(locationId: string): Promise<void> {
    const locationRef = doc(db, LOCATION_COLLECTION, locationId);
    try {
      await deleteDoc(locationRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${LOCATION_COLLECTION}/${locationId}`);
    }
  }
};
