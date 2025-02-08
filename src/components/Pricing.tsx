import React from 'react';
import { Check } from 'lucide-react';

const tiers = [
  {
    name: 'Básico',
    price: 19990,
    description: 'Todo lo necesario para comenzar con el análisis de tu negocio',
    features: [
      'Hasta 100 productos',
      'Análisis diario de stock',
      'Dashboard básico',
      'Soporte por email',
    ],
  },
  {
    name: 'Pro',
    price: 39990,
    description: 'Ideal para negocios en crecimiento con necesidades avanzadas',
    features: [
      'Hasta 500 productos',
      'Análisis en tiempo real',
      'Dashboard avanzado',
      'Reportes personalizados',
      'Soporte prioritario',
      'API access',
    ],
  },
];

export default function Pricing() {
  return (
    <div id="pricing" className="bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="sm:text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Planes simples y transparentes
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Elige el plan que mejor se adapte a tus necesidades
          </p>
        </div>

        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0">
          {tiers.map((tier) => (
            <div key={tier.name} className="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200 bg-white">
              <div className="p-6">
                <h2 className="text-lg leading-6 font-medium text-gray-900">{tier.name}</h2>
                <p className="mt-4 text-sm text-gray-500">{tier.description}</p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900">${tier.price.toLocaleString()}</span>
                  <span className="text-base font-medium text-gray-500">/mes</span>
                </p>
                <button className="mt-8 block w-full bg-indigo-600 border border-transparent rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-indigo-700">
                  Comenzar prueba gratuita
                </button>
              </div>
              <div className="pt-6 pb-8 px-6">
                <h3 className="text-xs font-medium text-gray-900 tracking-wide uppercase">Qué incluye</h3>
                <ul className="mt-6 space-y-4">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex space-x-3">
                      <Check className="flex-shrink-0 h-5 w-5 text-green-500" aria-hidden="true" />
                      <span className="text-sm text-gray-500">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
