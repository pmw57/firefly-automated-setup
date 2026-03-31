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
import { SetupCardDef } from '../../types';

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

const SETUP_COLLECTION = 'setupCards';

/**
 * Serializes complex fields that might contain nested arrays for Firestore.
 */
function serializeSetupCard(card: Partial<SetupCardDef>) {
  const data: Record<string, unknown> = { ...card };
  if (data.rules) {
    data.rules_json = JSON.stringify(data.rules);
    delete data.rules;
  }
  if (data.steps) {
    data.steps_json = JSON.stringify(data.steps);
    delete data.steps;
  }
  return data;
}

/**
 * Deserializes complex fields from Firestore.
 */
function deserializeSetupCard(docData: Record<string, unknown>): SetupCardDef {
  const data = { ...docData };
  if (data.rules_json && typeof data.rules_json === 'string') {
    data.rules = JSON.parse(data.rules_json);
    delete data.rules_json;
  }
  if (data.steps_json && typeof data.steps_json === 'string') {
    data.steps = JSON.parse(data.steps_json);
    delete data.steps_json;
  }
  return data as unknown as SetupCardDef;
}

export const setupCardService = {
  /**
   * Fetches all setup cards from Firestore.
   */
  async getAllSetupCards(): Promise<SetupCardDef[]> {
    try {
      const q = query(collection(db, SETUP_COLLECTION), orderBy('label'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ ...deserializeSetupCard(doc.data()) }));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, SETUP_COLLECTION);
      return [];
    }
  },

  /**
   * Subscribes to real-time updates for all setup cards.
   */
  subscribeToSetupCards(callback: (cards: SetupCardDef[]) => void) {
    const q = query(collection(db, SETUP_COLLECTION), orderBy('label'));
    return onSnapshot(q, (snapshot) => {
      const cards = snapshot.docs.map(doc => ({ ...deserializeSetupCard(doc.data()) }));
      callback(cards);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, SETUP_COLLECTION);
    });
  },

  /**
   * Saves a setup card to Firestore.
   */
  async saveSetupCard(card: Partial<SetupCardDef>): Promise<void> {
    if (!card.id) throw new Error("Setup card ID is required.");
    
    const cardRef = doc(db, SETUP_COLLECTION, card.id);
    
    const data = {
      ...serializeSetupCard(card),
      updatedAt: Timestamp.now(),
      updatedBy: auth.currentUser?.uid || 'anonymous'
    };

    try {
      await setDoc(cardRef, data, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `${SETUP_COLLECTION}/${card.id}`);
    }
  },

  /**
   * Deletes a setup card from Firestore.
   */
  async deleteSetupCard(cardId: string): Promise<void> {
    const cardRef = doc(db, SETUP_COLLECTION, cardId);
    try {
      await deleteDoc(cardRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${SETUP_COLLECTION}/${cardId}`);
    }
  }
};
