import { GoogleAuthProvider } from 'firebase/auth';
import { db, auth } from '@/lib/firebase'

export const googleProvider = new GoogleAuthProvider();

// Standard Firebase Google Authentication popups
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

/**
 * Handle and parse Firestore errors systematically according to the security guidelines.
 * Keeps structural telemetry visible for cloud diagnoses.
 */
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Security/Operation Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Validates the Firestore connection by checking if the client can retrieve from the network.
 */
import { doc, getDocFromServer } from 'firebase/firestore';
export async function testFirestoreConnection() {
  try {
    // Attempt to pull a document from the network to verify credentials are clear
    await getDocFromServer(doc(db, 'stalls', 'connection_test_doc'));
    console.log('Firebase connection initialized cleanly.');
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration: Firestore appears offline.');
    }
  }
}
testFirestoreConnection();
