// const LCDAS = {
//   Ikeja: ["Ikeja Central", "Onigbongbo", "Ojodu"],
//   Agege: ["Area 1", "Area 2"],
// };

// export default function StepLCDA({ lga, onSelect }) {
//   const LCDAS = {
//   ikeja: ["Ikeja Central", "Onigbongbo", "Ojodu"],
//   agege: ["Area 1", "Area 2"],
// };

// const options = LCDAS[lga?.toLowerCase()] || [];

//   return (
//     <div className="px-5 py-5">
//       <p className="text-sm text-gray-500 mb-4">
//         Great. Which region (LDAG) within {lga}?
//       </p>

//       <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
//         {options.map((ldag) => (
//           <button
//             key={ldag}
//             onClick={() => onSelect(ldag)}
//             className="text-xs font-semibold text-gray-700 border border-gray-200 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 px-2 py-3 rounded-xl transition text-center"
//           >
//             {ldag}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }

const LCDAS = {
  ikeja: ["Ikeja Central", "Onigbongbo", "Ojodu"],
  agege: ["Area 1", "Area 2"],
};

export default function StepLCDA({ lga, onSelect }) {
  const options = LCDAS[lga?.toLowerCase()] || [];

  return (
    <div className="px-5 py-5">
      <p className="text-sm text-gray-500 mb-4">
        Great. Which region (LCDA) within {lga}?
      </p>

      {options.length === 0 ? (
        <p className="text-sm text-red-500">
          No regions available for this LGA.
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1">
          {options.map((lcda) => (
            <button
              key={lcda}
              onClick={() => onSelect(lcda)}
              className="text-xs font-semibold text-gray-700 border border-gray-200 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 px-2 py-3 rounded-xl transition text-center"
            >
              {lcda}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}