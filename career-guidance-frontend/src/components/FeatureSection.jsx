function FeaturesSection() {
  const features = [
    {
      title: "AI Resume Analyzer",
      desc: "Get instant ATS score, skill gap detection, and improvement suggestions.",
    },
    {
      title: "Mock Interviews",
      desc: "Practice technical and HR interviews with AI-generated feedback.",
    },
    {
      title: "Personalized Roadmaps",
      desc: "Get custom learning paths based on your goals and skills.",
    },
  ];

  return (
    <section className="px-10 py-24 bg-[#050816] text-white">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold">Powerful Features</h2>
        <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
          Everything you need to analyze, improve, and accelerate your career journey.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-[#111827] border border-gray-800 rounded-2xl p-6 hover:border-purple-500 transition"
          >
            <h3 className="text-2xl font-semibold mb-4 text-purple-400">
              {feature.title}
            </h3>

            <p className="text-gray-400 leading-relaxed">
              {feature.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturesSection;