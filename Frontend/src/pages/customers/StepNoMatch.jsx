// import Button from "../../Components/buttons/Buttons";

// export default function StepNoMatch({ selectedLGA, onTryAgain, onClose }) {
//   // selectedLGA is now an object { id, name, stateName, stateId }
//   const lgaName = selectedLGA?.name || "your area";

//   return (
//     <div className="px-5 py-8 flex flex-col items-center gap-4">

//       {/* Icon */}
//       <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           fill="none"
//           viewBox="0 0 24 24"
//           strokeWidth={1.5}
//           stroke="#ef4444"
//           className="w-8 h-8"
//         >
//           <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
//         </svg>
//       </div>

//       {/* Title */}
//       <div className="text-center">
//         <h3 className="text-lg font-black text-gray-900 mb-2">No Plumbers Found</h3>
//         <p className="text-sm text-gray-500 leading-relaxed">
//           None of our verified plumbers in{" "}
//           <span className="font-bold text-gray-800">{lgaName}</span>{" "}
//           are available at this moment.
//         </p>
//       </div>

//       <Button size="lg" className="w-full" onClick={onTryAgain}>
//         Try Again
//       </Button>

//       <Button size="lg" variant="outline" className="w-full" onClick={onClose}>
//         Back to Dashboard
//       </Button>
//     </div>
//   );
// }
import Button from "../../Components/buttons/Buttons";

export default function StepNoMatch({ selectedLGA, onTryAgain, onClose }) {
  const lgaName = selectedLGA?.name || "your area";

  return (
    <div className="px-5 py-8 flex flex-col items-center gap-4">

      {/* Icon */}
      <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="#ef4444"
          className="w-8 h-8"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>

      {/* Title */}
      <div className="text-center">
        <h3 className="text-lg font-black text-gray-900 mb-2">No Plumbers Found</h3>
        <p className="text-sm text-gray-500 leading-relaxed">
          No plumbers in{" "}
          <span className="font-bold text-gray-800">{lgaName}</span>{" "}
          are available at this moment.
        </p>
      </div>

      <Button size="lg" className="w-full" onClick={onTryAgain}>
        Try Again
      </Button>

      <Button size="lg" variant="outline" className="w-full" onClick={onClose}>
        Back to Dashboard
      </Button>
    </div>
  );
}
