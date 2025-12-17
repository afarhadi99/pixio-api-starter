// src/components/account/success-message.tsx
'use client';

import { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';

interface SuccessMessageProps {
  sessionId?: string;
}

export function SuccessMessage({ sessionId }: SuccessMessageProps) {
  const [verifying, setVerifying] = useState(!!sessionId);
  const [message, setMessage] = useState('Payment successful! Your subscription is now active.');
  
  useEffect(() => {
    if (sessionId) {
      const verifySession = async () => {
        try {
          // Verify the session status
          const response = await fetch(`/api/check-session-status?session_id=${sessionId}`);
          const data = await response.json();
          
          if (data.status === 'complete' || data.payment_status === 'paid') {
            setMessage('Payment successful! Your subscription is now active.');
          } else {
            setMessage('Your payment is being processed. The subscription will be active soon.');
          }
        } catch (error) {
          console.error('Error verifying session:', error);
          setMessage('Your payment was received. If you don\'t see your subscription, please refresh in a few moments.');
        } finally {
          setVerifying(false);
          
          // Clear the URL parameters after verification
          window.history.replaceState({}, document.title, '/account');
        }
      };
      
      verifySession();
    }
  }, [sessionId]);
  
  if (!sessionId && !verifying) {
    return null;
  }
  
  return (
    <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4 flex items-start">
      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
      <div>
        <h3 className="font-medium text-green-800">Success!</h3>
        <p className="text-green-700">{message}</p>
      </div>
    </div>
  );
}
