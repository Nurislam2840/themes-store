"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { FaDownload, FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';

export default function DownloadPage() {
  const params = useParams();
  const [status, setStatus] = useState('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');

  useEffect(() => {
    const processDownload = async () => {
      try {
        // ১. অর্ডার ফেচ
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', params.orderId)
          .single();

        if (orderError || !orderData) {
          setStatus('error');
          setErrorMsg('Order not found!');
          return;
        }

        // ২. Approve চেক
        if (orderData.status !== 'approved') {
          setStatus('error');
          setErrorMsg('Your order is not approved yet. Please wait.');
          return;
        }

        // ৩. থিমের ফাইল পাথ
        const { data: themeData, error: themeError } = await supabase
          .from('themes')
          .select('download_file_path, title')
          .eq('slug', orderData.theme_slug)
          .single();

        if (themeError || !themeData || !themeData.download_file_path) {
          setStatus('error');
          setErrorMsg('Theme file not available. Please contact support.');
          return;
        }

        // ৪. Signed URL তৈরি (২৪ ঘন্টার জন্য)
        const { data: signedData, error: signedError } = await supabase.storage
          .from('theme-files')
          .createSignedUrl(themeData.download_file_path, 60 * 60 * 24);

        if (signedError || !signedData) {
          setStatus('error');
          setErrorMsg('Failed to generate download link. Please try again.');
          return;
        }

        setDownloadUrl(signedData.signedUrl);
        setStatus('success');

        // অটো ডাউনলোড
        const link = document.createElement('a');
        link.href = signedData.signedUrl;
        link.download = themeData.download_file_path;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err) {
        setStatus('error');
        setErrorMsg('Something went wrong: ' + err.message);
      }
    };

    if (params.orderId) processDownload();
  }, [params.orderId]);

  return (
    <main className="min-h-screen bg-gray-950 text-white font-sans flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center px-6 pt-24 pb-20">
        
        {status === 'loading' && (
          <div className="text-center">
            <FaSpinner className="text-5xl text-cyan-400 mx-auto mb-6 animate-spin" />
            <h2 className="text-2xl font-bold mb-2">Preparing Your Download...</h2>
            <p className="text-gray-400 text-sm">Please wait while we verify your order.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="bg-gray-900 border border-green-500/30 rounded-3xl p-10 text-center max-w-md w-full shadow-[0_0_30px_rgba(34,197,94,0.2)]">
            <div className="w-20 h-20 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
              <FaCheckCircle />
            </div>
            <h2 className="text-2xl font-extrabold mb-3 text-white">Download Started!</h2>
            <p className="text-gray-400 mb-6 text-sm">
              Your download should begin automatically. If not, click below.
            </p>
            <a 
              href={downloadUrl} 
              className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-8 rounded-xl transition inline-flex items-center justify-center gap-2"
            >
              <FaDownload /> Download Again
            </a>
          </div>
        )}

        {status === 'error' && (
          <div className="bg-gray-900 border border-red-500/30 rounded-3xl p-10 text-center max-w-md w-full">
            <div className="w-20 h-20 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
              <FaTimesCircle />
            </div>
            <h2 className="text-2xl font-extrabold mb-3 text-white">Access Denied</h2>
            <p className="text-gray-400 mb-6 text-sm">{errorMsg}</p>
            <Link href="/contact" className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-8 rounded-xl transition inline-block">
              Contact Support
            </Link>
          </div>
        )}

      </div>
      <Footer />
    </main>
  );
}