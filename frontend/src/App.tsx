// frontend/src/App.tsx
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';

// Import the baseline default styles for the forms
import '@aws-amplify/ui-react/styles.css';
import { useEffect } from 'react';

// 1. Initialize with your injected SST v3 environment configurations
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_USER_POOL_CLIENT_ID,
      signUpVerificationMethod: 'code',
    }
  }
});

export default function App() {

  useEffect(() => {
    console.log("--- BunkSpot Infrastructure Test ---");
    console.log("DynamoDB Table Name:", import.meta.env.VITE_TABLE_NAME);
    console.log("Cognito User Pool ID:", import.meta.env.VITE_USER_POOL_ID);
  }, []);
  return (
    <Authenticator loginMechanisms={['email']}>
      {({ signOut, user }) => (
        <main style={{ padding: '2rem' }}>
          <h2>Welcome to BunkSpot</h2>
          <p>Authenticated as: <strong>{user?.username}</strong></p>
          
          {/* Your single-table profile routing triggers here */}
          <p>Cognito Unique Sub ID: {user?.userId}</p>

          <button 
            onClick={signOut} 
            style={{ padding: '0.5rem 1rem', background: '#dc2626', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Sign Out
          </button>
        </main>
      )}
    </Authenticator>
  );
}