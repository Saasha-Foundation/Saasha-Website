import React from 'react';

const Team = () => {
  const teamMembers = [
    { id: 1, name: 'Team Member 1', role: 'Co-Founder', imageUrl: 'PLACEHOLDER_1' },
    { id: 2, name: 'Team Member 2', role: 'Co-Founder', imageUrl: 'PLACEHOLDER_2' },
    { id: 3, name: 'Team Member 3', role: 'Medical Director', imageUrl: 'PLACEHOLDER_3' },
    { id: 4, name: 'Team Member 4', role: 'Healthcare Specialist', imageUrl: 'PLACEHOLDER_4' },
    { id: 5, name: 'Team Member 5', role: 'Education Lead', imageUrl: 'PLACEHOLDER_5' },
    { id: 6, name: 'Team Member 6', role: 'Community Outreach', imageUrl: 'PLACEHOLDER_6' },
    { id: 7, name: 'Team Member 7', role: 'Research Coordinator', imageUrl: 'PLACEHOLDER_7' },
    { id: 8, name: 'Team Member 8', role: 'Program Manager', imageUrl: 'PLACEHOLDER_8' },
    { id: 9, name: 'Team Member 9', role: 'Healthcare Advocate', imageUrl: 'PLACEHOLDER_9' },
    { id: 10, name: 'Team Member 10', role: 'Medical Educator', imageUrl: 'PLACEHOLDER_10' },
    { id: 11, name: 'Team Member 11', role: 'Operations Lead', imageUrl: 'PLACEHOLDER_11' },
    { id: 12, name: 'Team Member 12', role: 'Technology Lead', imageUrl: 'PLACEHOLDER_12' }
  ];

  return (
    <section className="py-24 bg-white" id="team">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-saasha-brown">Meet The Team</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {teamMembers.map((member) => (
            <div key={member.id} className="bg-saasha-cream/30 rounded-xl p-6 text-center hover:transform hover:scale-105 transition-transform duration-300">
              <div className="mb-4 relative">
                {/* Replace 'PLACEHOLDER_X' with actual image URL when provided */}
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80"
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="bg-saasha-brown/80 text-saasha-cream px-2 py-1 rounded text-sm">
                    Replace {member.imageUrl}
                  </p>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-saasha-brown mb-2">{member.name}</h3>
              <p className="text-saasha-rose">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
