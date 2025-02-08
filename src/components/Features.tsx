import React from 'react';
import { TrendingUp, BarChart2, Clock, Search } from 'lucide-react';

const features = [
  {
    name: 'Análisis en tiempo real',
    description: 'Visualiza las tendencias de ventas y stock en tiempo real para tomar decisiones informadas.',
    icon: TrendingUp,
  },
  {
    name: 'Dashboard intuitivo',
    description: 'Interfaz fácil de usar con gráficos interactivos y métricas clave a simple vista.',
    icon: BarChart2,
  },
  {
    name: 'Histórico detallado',
    description: 'Accede al historial completo de ventas y variaciones de stock para cada producto.',
    icon: Clock,
  },
  {
    name: 'Búsqueda avanzada',
    description: 'Encuentra rápidamente los productos que necesitas con filtros y búsqueda avanzada.',
    icon: Search,
  },
];

export default function Features() {
  return (
    <div id="features" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Características</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Todo lo que necesitas para tu negocio
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Herramientas poderosas para analizar y optimizar tus ventas de dropshipping.
          </p>
        </div>

        <div className="mt-10">
          <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <feature.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                <p className="mt-2 ml-16 text-base text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
