import Container from "./Container";

const promises = [
  {
    title: "Vetted Professionals",
    description: "We maintain a fully verified network of plumbing professionals.",
    bg: "bg-green-100",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth={1.8} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    title: "Instant Matching",
    description: "Our AI Assistant classifies your problem and broadcasts it to local Experts in seconds.",
    bg: "bg-blue-100",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth={1.8} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
  {
    title: "Transparent Trust",
    description: "Connect securely via our platform. Pay your professional directly for quality work.",
    bg: "bg-orange-100",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth={1.8} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
];

export default function Promise() {
  return (
    <section className="bg-gray-50 py-12">
      <Container>

        {/* Label */}
        <div className="text-center mb-3">
          <p className="text-xs font-semibold tracking-widest text-orange-500 uppercase">
            Professional Excellence
          </p>
        </div>

        {/* Heading */}
        <h2 className="text-center text-4xl md:text-5xl font-bold text-gray-900 mb-12">
          The PlumbConnect Promise
        </h2>

        {/* Cards — centered, not full width */}
        <div className="flex flex-col md:flex-row justify-center items-stretch gap-6 max-w-4xl mx-auto">
          {promises.map((item) => (
            <div
              key={item}
              className="flex flex-col items-center text-center rounded-2xl p-8 flex-1"
            >
              {/* Icon — centered */}
              <div className={`w-14 h-14 flex items-center justify-center rounded-2xl ${item.bg} mb-5`}>
                {item.icon}
              </div>

              <h3 className="text-base font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>

      </Container>
    </section>
  );
}
