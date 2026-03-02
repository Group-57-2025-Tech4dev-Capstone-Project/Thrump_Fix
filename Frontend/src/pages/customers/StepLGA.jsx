const LAGOS_LGAS = [
  "Agege", "Ajeromi-Ifelodun", "Alimosho", "Amuwo-Odofin", "Apapa",
  "Badagry", "Epe", "Eti-Osa", "Ibeju-Lekki", "Ifako-Ijaiye",
  "Ikeja", "Ikorodu", "Kosofe", "Lagos Island", "Lagos Mainland",
  "Mushin", "Ojo", "Oshodi-Isolo", "Shomolu", "Surulere",
];

export default function StepLGA({ onSelect }) {
  return (
    <div className="px-5 py-5">
      <p className="text-sm text-gray-500 mb-4">
        Select a location to find available plumbers in your Local Government Area.
      </p>
      <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1">
        {LAGOS_LGAS.map((lga) => (
          <button
            key={lga}
            onClick={() => onSelect(lga)}
            className="text-xs font-semibold text-gray-700 border border-gray-200 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 px-2 py-3 rounded-xl transition text-center"
          >
            {lga}
          </button>
        ))}
      </div>
    </div>
  );
}
