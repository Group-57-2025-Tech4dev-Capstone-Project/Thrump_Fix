// import Button from "../../Components/buttons/Buttons";

// export default function StepMatch({ plumber, onClose }) {
//   const initials = plumber?.name
//     ?.split(" ")
//     .map((n) => n[0])
//     .join("")
//     .toUpperCase()
//     .slice(0, 2) || "??";

//   return (
//     <div className="px-5 py-8 flex flex-col items-center gap-4">

//       {/* Icon */}
//       <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center">
//         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#10b981" className="w-9 h-9">
//           <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.491 4.491 0 01-3.497-1.307 4.491 4.491 0 01-1.307-3.497A4.49 4.49 0 012.25 12a4.49 4.49 0 011.549-3.397 4.491 4.491 0 011.307-3.497 4.491 4.491 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
//         </svg>
//       </div>

//       {/* Title */}
//       <div className="text-center">
//         <h3 className="text-xl font-black uppercase tracking-widest text-gray-900 mb-1">
//           Match Found!
//         </h3>
//         <p className="text-xs font-bold uppercase tracking-widest text-green-500">
//           Professional is on the way
//         </p>
//       </div>

//       {/* Plumber card */}
//       <div className="flex items-center gap-3 w-full bg-gray-50 rounded-2xl px-4 py-3">
//         <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-sm font-black text-blue-700 flex-shrink-0">
//           {initials}
//         </div>
//         <div>
//           <p className="text-sm font-bold text-gray-900">{plumber?.name || "Plumber"}</p>
//           {plumber?.verified && (
//             <div className="flex items-center gap-1 text-green-600">
//               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
//                 <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.491 4.491 0 01-3.497-1.307 4.491 4.491 0 01-1.307-3.497A4.49 4.49 0 012.25 12a4.49 4.49 0 011.549-3.397 4.491 4.491 0 011.307-3.497 4.491 4.491 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
//               </svg>
//               <span className="text-xs font-semibold">Verified</span>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Phone button */}
//       {plumber?.phone && (
//         <Button
//           size="lg"
//           className="w-full"
//           onClick={() => window.location.href = `tel:${plumber.phone}`}
//           prefix={
//             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
//               <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
//             </svg>
//           }
//         >
//           Phone Number
//         </Button>
//       )}

//       <button
//         onClick={onClose}
//         className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-gray-700 transition"
//       >
//         View Request Details
//       </button>
//     </div>
//   );
// }


import { useNavigate } from "react-router-dom";
// import Button from "../../Components/buttons/Buttons";

export default function StepMatch({ plumber, onClose }) {
  const navigate = useNavigate();

  const initials = plumber?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "MA";

  function handleViewDetails() {
    onClose();              // close the overlay
    navigate(route.ConsumerDashboard); // go to dashboard where job history lives
  }

  return (
    <div className="px-5 py-10 flex flex-col items-center gap-5">

      {/* Checkmark icon — matches screenshot's rounded square style */}
      <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="#10b981"
          className="w-9 h-9"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>

      {/* Title */}
      <div className="text-center">
        <h3 className="text-xl font-black uppercase tracking-widest text-gray-900 mb-1">
          Match Found!
        </h3>
        <p className="text-xs font-bold uppercase tracking-widest text-green-500">
          Professional is on the way
        </p>
      </div>

      {/* Plumber card */}
      <div className="flex items-center gap-3 w-full bg-gray-50 rounded-2xl px-4 py-3">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-sm font-black text-blue-700 flex-shrink-0">
          {initials}
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900">
            {plumber?.name || "Your Plumber"}
          </p>
          {/* Always show verified — all plumbers on platform are verified */}
          <div className="flex items-center gap-1 text-green-600 mt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
              <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.491 4.491 0 01-3.497-1.307 4.491 4.491 0 01-1.307-3.497A4.49 4.49 0 012.25 12a4.49 4.49 0 011.549-3.397 4.491 4.491 0 011.307-3.497 4.491 4.491 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-semibold">Verified</span>
          </div>
        </div>
      </div>

      {/* View Request Details → closes overlay + navigates to dashboard */}
      <button
        onClick={handleViewDetails}
        className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-blue-600 transition"
      >
        View Request Details
      </button>

    </div>
  );
}
