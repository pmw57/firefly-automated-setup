import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  onSnapshot,
  getDocFromServer,
  Timestamp
} from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { UserInfo } from 'firebase/auth';
import { StoryCardDef } from '../../types';

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

const STORY_COLLECTION = 'storyCards';

/**
 * Serializes complex fields that might contain nested arrays for Firestore.
 */
function serializeStory(story: Partial<StoryCardDef>) {
  const data: Record<string, unknown> = { ...story };
  if (data.rules) {
    // Firestore doesn't like nested arrays in StructuredContent
    data.rules_json = JSON.stringify(data.rules);
    delete data.rules;
  }
  return data;
}

/**
 * Deserializes complex fields from Firestore.
 */
function deserializeStory(docData: Record<string, unknown>): StoryCardDef {
  const data = { ...docData };
  if (data.rules_json && typeof data.rules_json === 'string') {
    data.rules = JSON.parse(data.rules_json);
    delete data.rules_json;
  }
  return data as unknown as StoryCardDef;
}

export const storyService = {
  /**
   * Tests the connection to Firestore.
   */
  async testConnection() {
    try {
      await getDocFromServer(doc(db, 'test', 'connection'));
    } catch (error) {
      if (error instanceof Error && error.message.includes('the client is offline')) {
        console.error("Please check your Firebase configuration. ");
      }
    }
  },

  /**
   * Fetches all story cards from Firestore.
   */
  async getAllStories(): Promise<StoryCardDef[]> {
    try {
      const q = query(collection(db, STORY_COLLECTION), orderBy('title'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...deserializeStory(doc.data()) }));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, STORY_COLLECTION);
      return [];
    }
  },

  /**
   * Subscribes to real-time updates for all story cards.
   */
  subscribeToStories(callback: (stories: StoryCardDef[]) => void) {
    const q = query(collection(db, STORY_COLLECTION), orderBy('title'));
    return onSnapshot(q, (snapshot) => {
      const stories = snapshot.docs.map(doc => ({ id: doc.id, ...deserializeStory(doc.data()) }));
      callback(stories);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, STORY_COLLECTION);
    });
  },

  /**
   * Saves a story card to Firestore.
   */
  async saveStory(story: Partial<StoryCardDef>): Promise<void> {
    if (!story.title) throw new Error("Story title is required.");
    
    // Use title as ID (slugified) or auto-generate
    const storyId = story.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const storyRef = doc(db, STORY_COLLECTION, storyId);
    
    const data = {
      ...serializeStory(story),
      updatedAt: Timestamp.now(),
      updatedBy: auth.currentUser?.uid || 'anonymous'
    };

    try {
      await setDoc(storyRef, data, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `${STORY_COLLECTION}/${storyId}`);
    }
  },

  /**
   * Deletes a story card from Firestore.
   */
  async deleteStory(storyId: string): Promise<void> {
    const storyRef = doc(db, STORY_COLLECTION, storyId);
    try {
      await deleteDoc(storyRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${STORY_COLLECTION}/${storyId}`);
    }
  }
};
