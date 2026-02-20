// // components/landing/Promise.jsx
// import Container from "./Container";
// import { Card } from "../card/Card";
// // import { ShieldCheck, Zap, FileText } from "lucide-react";

// export default function Promise() {
//   const promises = [
//     {
//       title: "Vetted Professionals",
//       description: "We maintain a fully verified network of plumbing professionals.",
//     //   icon: <ShieldCheck className="w-6 h-6 text-green-600" />,
//       bg: "bg-green-100",
//     },
//     {
//       title: "Instant Matching",
//       description: "Our AI Assistant classifies your problem and broadcasts it to local Experts in seconds.",
//     //   icon: <Zap className="w-6 h-6 text-blue-600" />,
//       bg: "bg-blue-100",
//     },
//     {
//       title: "Transparent Trust",
//       description: "Connect securely via our platform. Pay your professional directly for quality work.",
//     //   icon: <FileText className="w-6 h-6 text-orange-600" />,
//       bg: "bg-orange-100",
//     },
//   ];

//   return (
//     <section className="py-24 bg-white">
//       <Container>
//         <div className="text-center mb-12">
//           <span className="text-orange-500 text-xs font-semibold uppercase tracking-wider">
//             Professional Excellence
//           </span>
//           <h2 className="mt-2 text-4xl md:text-5xl font-bold text-gray-900">
//             The PlumbConnect Promise
//           </h2>
//         </div>

//         <div className="grid md:grid-cols-3 gap-6">
//           {promises.map((p, index) => (
//             <Card key={index} className="p-6 flex flex-col items-start gap-4 hover:shadow-lg transition cursor-pointer">
//               <div className={`p-3 rounded-lg ${p.bg}`}>
//                 {p.icon}
//               </div>
//               <div>
//                 <h3 className="font-semibold text-gray-900 text-lg">{p.title}</h3>
//                 <p className="text-gray-500 text-sm mt-1">{p.description}</p>
//               </div>
//             </Card>
//           ))}
//         </div>
//       </Container>
//     </section>
//   );
// }

// components/landing/Promise.jsx
import Container from "./Container";
import { Card } from "../card/Card";

export default function Promise() {
  const promises = [
    {
      title: "Vetted Professionals",
      description:
        "We maintain a fully verified network of plumbing professionals.",
      bg: "bg-green-100",
      icon: "/icons/shield.svg", // replace with your svg path
    },
    {
      title: "Instant Matching",
      description:
        "Our AI Assistant classifies your problem and broadcasts it to local Experts in seconds.",
      bg: "bg-blue-100",
      icon: "/icons/zap.svg",
    },
    {
      title: "Transparent Trust",
      description:
        "Connect securely via our platform. Pay your professional directly for quality work.",
      bg: "bg-orange-100",
      icon: "/icons/file.svg",
    },
  ];

  return (
    <section className="bg-gray-50 py-28">
      <Container>
        {/* Top label */}
        <div className="text-center mb-6">
          <p className="text-[12px] font-semibold tracking-[0.25em] text-orange-500 uppercase">
            Professional Excellence
          </p>
        </div>

        {/* Heading */}
        <h2 className="text-center text-4xl md:text-5xl font-bold text-gray-900 mb-16">
          The PlumbConnect Promise
        </h2>

        {/* Cards */}
        <div className="grid gap-8 md:grid-cols-3">
          {promises.map((item, i) => (
            <Card
              key={i}
              variant="outline"
              className="
                bg-white
                rounded-2xl
                border border-gray-200
                p-8
                text-left
                hover:shadow-md
                transition
              "
            >
              {/* Icon box */}
              <div
                className={`
                  ${item.bg}
                  w-12 h-12
                  flex items-center justify-center
                  rounded-xl
                  mb-6
                `}
              >
                <img
                  src={item.icon}
                  alt={item.title}
                  className="w-6 h-6"
                />
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-gray-500 text-sm leading-relaxed">
                {item.description}
              </p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}

