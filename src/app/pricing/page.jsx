import Navbar from '@/components/layout/Navbar';
import Link from 'next/link';
import { FaCheck } from 'react-icons/fa';

export default function PricingPage() {
  const plans = [
    {
      name: 'Starter',
      price: '$29',
      desc: 'Perfect for personal projects and beginners.',
      features: ['1 Theme Download', 'Personal License', '6 Months Updates', 'Email Support'],
      isPopular: false,
    },
    {
      name: 'Professional',
      price: '$99',
      desc: 'Best for freelancers and growing businesses.',
      features: ['5 Theme Downloads', 'Commercial License', '1 Year Updates', 'Priority Support', 'Source Files Included'],
      isPopular: true,
    },
    {
      name: 'Enterprise',
      price: '$299',
      desc: 'For agencies and large scale operations.',
      features: ['Unlimited Theme Downloads', 'Extended License', 'Lifetime Updates', '24/7 Dedicated Support', 'Customization Help'],
      isPopular: false,
    },
  ];

  return (
    <main className="min-h-screen bg-gray-950 text-white font-sans selection:bg-cyan-500">
      <Navbar />
      
      <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">Choose the perfect plan for your needs. No hidden fees, cancel anytime.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`bg-gray-900 rounded-3xl p-8 border ${plan.isPopular ? 'border-cyan-500 shadow-[0_0_30px_rgba(8,145,178,0.3)] relative' : 'border-gray-800'} flex flex-col`}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-cyan-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                  MOST POPULAR
                </div>
              )}
              
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-gray-400 text-sm mb-6">{plan.desc}</p>
              
              <div className="text-4xl font-extrabold text-cyan-400 mb-8">
                {plan.price} <span className="text-sm text-gray-500 font-normal">/one-time</span>
              </div>

              <ul className="space-y-4 mb-10 flex-grow">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300 text-sm">
                    <FaCheck className="text-cyan-500" /> {feature}
                  </li>
                ))}
              </ul>

              <Link 
                href="/checkout" 
                className={`w-full py-4 rounded-xl font-bold text-center transition ${
                  plan.isPopular 
                    ? 'bg-cyan-600 hover:bg-cyan-700 text-white' 
                    : 'bg-gray-800 hover:bg-gray-700 text-white'
                }`}
              >
                Choose {plan.name}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}