"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestDB() {
  const [status, setStatus] = useState('Not Tested');
  const [result, setResult] = useState(null);

  const testConnection = async () => {
    setStatus('Testing...');
    
    // ডাটাবেসে একটি ডামি রিভিউ ইনসার্ট করে টেস্ট করা
    const { data, error } = await supabase
      .from('reviews')
      .insert([{ 
        theme_slug: 'test-theme', 
        name: 'Test User', 
        rating: 5, 
        comment: 'Testing connection from Next.js' 
      }])
      .select();

    if (error) {
      setStatus('❌ Error: ' + error.message);
      setResult(null);
    } else {
      setStatus('✅ Connection Successful! Data inserted into Supabase.');
      setResult(data);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-6 font-sans">
      <h1 className="text-2xl font-bold mb-6 text-cyan-400">Supabase Connection Test</h1>
      
      <button 
        onClick={testConnection}
        className="bg-cyan-600 hover:bg-cyan-700 px-6 py-3 rounded-xl font-bold mb-6 transition shadow-[0_0_20px_rgba(8,145,178,0.4)]"
      >
        Test Connection
      </button>

      <p className="text-lg mb-4 text-center">{status}</p>
      
      {result && (
        <pre className="bg-gray-900 p-4 rounded-xl text-xs overflow-auto max-w-full border border-gray-800 w-full">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}