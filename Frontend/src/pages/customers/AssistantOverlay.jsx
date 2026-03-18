// // import { useState } from "react";
// // import StepLGA from "./StepLGA";
// // import StepLCDA from "./StepLCDA";
// // import StepForm from "./StepForm";
// // import StepTimer from "./StepTimer";
// // import StepMatch from "./StepMatch";
// // import StepNoMatch from "./StepNoMatch";
// // import Logo from "../../assets/Logo.svg?react"

// // export default function AssistantOverlay({ onClose }) {
// //   const [step, setStep] = useState("lga");
// //   const [selectedLGA, setSelectedLGA] = useState(null);
// //   const [selectedLCDA, setSelectedLCDA] = useState(null);

// //   function handleLGASelect(lga) {
// //     setSelectedLGA(null);
// //     setSelectedLCDA(null);
// //     setSelectedLGA(lga);
// //     setStep("lcda");

// //     // setSelectedLGA(lga);
// //     // setStep("form");
// //   }

// //   function handleLCDASelect(lcda) {
// //   setSelectedLCDA(lcda);
// //   setStep("form"); 
// //   }

// //   function handleFormSubmit() {
// //     setStep("timer");
// //   }

// //   function handleMatch() {
// //     setStep("match");
// //   }

// //   function handleNoMatch() {
// //     setStep("nomatch");
// //   }

// //   function handleTryAgain() {
// //     setSelectedLGA(null);
// //     setStep("lga");
// //   }

// //   return (
// //     <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

// //       {/* Blurred light blue backdrop */}
// //       <div
// //         className="absolute inset-0 bg-blue-100/70 backdrop-blur-sm"
// //         onClick={onClose}
// //       />

// //       {/* Overlay card */}
// //       <div className="relative w-full max-w-sm sm:max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">

// //         {/* ── Blue header*/}
// //         <div className="bg-blue-600 px-5 py-4 flex items-center justify-between">
// //           <div className="flex items-center gap-3">
// //             {/* <div className="w-8 h-8 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
// //               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5">
// //                 <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z" clipRule="evenodd" />
// //               </svg>
// //             </div> */}
// //             <Logo/>
// //             <div>
// //               <p className="text-white font-black text-sm">PlumbConnect Assistant</p>
// //               {step === "timer" && (
// //                 <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest">
// //                   Lead Broadcast Active
// //                 </p>
// //               )}
// //             </div>
// //           </div>

// //           <button onClick={onClose} className="text-white/70 hover:text-white transition">
// //             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
// //               <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
// //             </svg>
// //           </button>
// //         </div>

// //         {/* ── Step content — only this part changes ── */}
// //         {step === "lga" && (
// //           <StepLGA onSelect={handleLGASelect} />
// //         )}

// //         {step === "lcda" && (
// //           <StepLCDA lga={selectedLGA} onSelect={handleLCDASelect} />
// //         )}

// //         {step === "form" && (
// //           <StepForm selectedLGA={selectedLGA} selectedLCDA={selectedLCDA} onSubmit={handleFormSubmit} />
// //         )}

// //         {step === "timer" && (
// //           <StepTimer
// //             onMatch={handleMatch}
// //             onNoMatch={handleNoMatch}
// //             onCancel={onClose}
// //           />
// //         )}

// //         {step === "match" && (
// //           <StepMatch onClose={onClose} />
// //         )}

// //         {step === "nomatch" && (
// //           <StepNoMatch
// //             selectedLGA={selectedLGA}
// //             onTryAgain={handleTryAgain}
// //             onClose={onClose}
// //           />
// //         )}

// //       </div>
// //     </div>
// //   );
// // }

// import { useState } from "react";
// import StepLGA from "./StepLGA";
// import StepLCDA from "./StepLCDA";
// import StepForm from "./StepForm";
// import StepTimer from "./StepTimer";
// import StepMatch from "./StepMatch";
// import StepNoMatch from "./StepNoMatch";
// import Logo from "../../assets/Logo.svg?react";

// export default function AssistantOverlay({ onClose }) {
//   const [step, setStep]             = useState("lga");
//   const [selectedLGA, setSelectedLGA]   = useState(null);
//   const [selectedLCDA, setSelectedLCDA] = useState(null);
//   const [matchedPlumber, setMatchedPlumber] = useState(null);

//   function handleLGASelect(lga) {
//     setSelectedLGA(lga);
//     setSelectedLCDA(null);
//     setStep("lcda");
//   }

//   function handleLCDASelect(lcda) {
//     setSelectedLCDA(lcda);
//     setStep("form");
//   }

//   function handleFormSubmit() {
//     setStep("timer");
//   }

//   function handleMatch(plumber) {
//     setMatchedPlumber(plumber);
//     setStep("match");
//   }

//   function handleNoMatch() {
//     setStep("nomatch");
//   }

//   function handleTryAgain() {
//     setSelectedLGA(null);
//     setSelectedLCDA(null);
//     setMatchedPlumber(null);
//     setStep("lga");
//   }

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

//       {/* Blurred backdrop */}
//       <div
//         className="absolute inset-0 bg-blue-100/70 backdrop-blur-sm"
//         onClick={onClose}
//       />

//       {/* Overlay card */}
//       <div className="relative w-full max-w-sm sm:max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">

//         {/* ── Blue header ── */}
//         <div className="bg-blue-600 px-5 py-4 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <Logo />
//             <div>
//               <p className="text-white font-black text-sm">PlumbConnect Assistant</p>
//               {step === "timer" && (
//                 <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest">
//                   Lead Broadcast Active
//                 </p>
//               )}
//             </div>
//           </div>
//           <button onClick={onClose} className="text-white/70 hover:text-white transition">
//             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
//               <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         </div>

//         {/* ── Step content ── */}
//         {step === "lga"     && <StepLGA onSelect={handleLGASelect} />}
//         {step === "lcda"    && <StepLCDA lga={selectedLGA} onSelect={handleLCDASelect} />}
//         {step === "form"    && <StepForm selectedLGA={selectedLGA} selectedLCDA={selectedLCDA} onSubmit={handleFormSubmit} />}
//         {step === "timer"   && <StepTimer onMatch={handleMatch} onNoMatch={handleNoMatch} onCancel={onClose} />}
//         {step === "match"   && <StepMatch plumber={matchedPlumber} onClose={onClose} />}
//         {step === "nomatch" && <StepNoMatch selectedLGA={selectedLGA} onTryAgain={handleTryAgain} onClose={onClose} />}

//       </div>
//     </div>
//   );
// }



import { useState } from "react";
import StepLGA from "./StepLGA";
import StepLCDA from "./StepLCDA";
import StepForm from "./StepForm";
import StepTimer from "./StepTimer";
import StepMatch from "./StepMatch";
import StepNoMatch from "./StepNoMatch";
import Logo from "../../assets/Logo.svg?react";

export default function AssistantOverlay({ onClose }) {
  const [step, setStep]                     = useState("lga");
  const [selectedLGA, setSelectedLGA]       = useState(null);
  const [selectedLCDA, setSelectedLCDA]     = useState(null);
  const [matchedPlumber, setMatchedPlumber] = useState(null);
  const [jobId, setJobId]                   = useState(null);

  // Step 1 — pick LGA → go to LCDA
  function handleLGASelect(lga) {
    setSelectedLGA(lga);
    setSelectedLCDA(null);
    setStep("lcda");
  }

  // Step 2 — pick LCDA → go to form
  function handleLCDASelect(lcda) {
    setSelectedLCDA(lcda);
    setStep("form");
  }

  // Step 3 — form submitted with jobId → go to timer
  function handleFormSubmit(id) {
    setJobId(id);
    setStep("timer");
  }

  function handleMatch(plumber) {
    setMatchedPlumber(plumber);
    setStep("match");
  }

  function handleNoMatch() {
    setStep("nomatch");
  }

  function handleTryAgain() {
    setSelectedLGA(null);
    setSelectedLCDA(null);
    setMatchedPlumber(null);
    setJobId(null);
    setStep("lga");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

      {/* Blurred backdrop */}
      <div
        className="absolute inset-0 bg-blue-100/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Overlay card */}
      <div className="relative w-full max-w-sm sm:max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* Blue header */}
        <div className="bg-blue-600 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo />
            <div>
              <p className="text-white font-black text-sm">PlumbConnect Assistant</p>
              {step === "timer" && (
                <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest">
                  Lead Broadcast Active
                </p>
              )}
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Step content */}
        {step === "lga"     && <StepLGA onSelect={handleLGASelect} />}
        {step === "lcda"    && <StepLCDA lga={selectedLGA} onSelect={handleLCDASelect} />}
        {step === "form"    && <StepForm selectedLGA={selectedLGA} selectedLCDA={selectedLCDA} onSubmit={handleFormSubmit} />}
        {step === "timer"   && <StepTimer jobId={jobId} onMatch={handleMatch} onNoMatch={handleNoMatch} onCancel={onClose} />}
        {step === "match"   && <StepMatch plumber={matchedPlumber} onClose={onClose} />}
        {step === "nomatch" && <StepNoMatch selectedLGA={selectedLGA} onTryAgain={handleTryAgain} onClose={onClose} />}

      </div>
    </div>
  );
}
