interface PropertyInfoProps {
  suite_amount?: number;
  room_amount?: number;
  bathroom_amount?: number;
  toilet_amount?: number;
  parking_lot_amount?: number;
  surface?: number;
  roofed_surface?: number;
  total_surface?: number;
  front_measure?: string;
  depth_measure?: string;
  age?: number;
  orientation?: string;
  disposition?: string;
  credit_eligible?: string;
  expenses?: number;
}

export default function PropertyInfo({
  suite_amount,
  room_amount,
  bathroom_amount,
  toilet_amount,
  parking_lot_amount,
  surface,
  roofed_surface,
  total_surface,
  front_measure,
  depth_measure,
  age,
  orientation,
  disposition,
  credit_eligible,
  expenses,
}: PropertyInfoProps) {
  const totalRooms = (room_amount || 0) + (suite_amount || 0);

  const translateOrientation = (o: string) => {
    const trans: Record<string, string> = {
      'North': 'Norte', 'South': 'Sur', 'East': 'Este', 'West': 'Oeste',
      'Northeast': 'Noreste', 'Northwest': 'Noroeste',
      'Southeast': 'Sudeste', 'Southwest': 'Sudoeste',
    };
    return trans[o] || o;
  };

  const translateCredit = (c: string) => {
    return c === 'Yes' ? 'Sí' : c === 'No' ? 'No' : 'No especificado';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Características</h2>

      {/* Características Principales con Icons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 pb-8 border-b border-gray-200">
        {totalRooms > 0 && (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-3">
              <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{totalRooms}</p>
            <p className="text-sm text-gray-600">Ambientes</p>
          </div>
        )}

        {bathroom_amount && bathroom_amount > 0 && (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{bathroom_amount}</p>
            <p className="text-sm text-gray-600">Baños</p>
          </div>
        )}

        {parking_lot_amount && parking_lot_amount > 0 && (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-3">
              <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{parking_lot_amount}</p>
            <p className="text-sm text-gray-600">Cocheras</p>
          </div>
        )}

        {(total_surface || surface) && (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-3">
              <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{total_surface || surface}m²</p>
            <p className="text-sm text-gray-600">Sup. Total</p>
          </div>
        )}
      </div>

      {/* Superficies y Medidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {roofed_surface && roofed_surface > 0 && (
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-gray-700 font-medium">Superficie Cubierta</span>
            <span className="text-gray-900 font-semibold">{roofed_surface} m²</span>
          </div>
        )}

        {front_measure && parseFloat(front_measure) > 0 && (
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-gray-700 font-medium">Frente</span>
            <span className="text-gray-900 font-semibold">{front_measure} m</span>
          </div>
        )}

        {depth_measure && parseFloat(depth_measure) > 0 && (
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-gray-700 font-medium">Fondo</span>
            <span className="text-gray-900 font-semibold">{depth_measure} m</span>
          </div>
        )}

        {age !== undefined && age !== null && (
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-gray-700 font-medium">Antigüedad</span>
            <span className="text-gray-900 font-semibold">{age} años</span>
          </div>
        )}

        {orientation && (
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-gray-700 font-medium">Orientación</span>
            <span className="text-gray-900 font-semibold">{translateOrientation(orientation)}</span>
          </div>
        )}

        {disposition && (
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-gray-700 font-medium">Disposición</span>
            <span className="text-gray-900 font-semibold">{disposition}</span>
          </div>
        )}

        {credit_eligible && (
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-gray-700 font-medium">Apto Crédito</span>
            <span className={`font-semibold ${credit_eligible === 'Yes' ? 'text-green-600' : 'text-gray-900'}`}>
              {translateCredit(credit_eligible)}
            </span>
          </div>
        )}

        {expenses && expenses > 0 && (
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-gray-700 font-medium">Expensas</span>
            <span className="text-gray-900 font-semibold">${expenses.toLocaleString('es-AR')}</span>
          </div>
        )}
      </div>
    </div>
  );
}