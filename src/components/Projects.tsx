import { useState } from 'react';
import { ProjectCard, type Project } from './ProjectCard';
import { ProjectModal } from './ProjectModal';
import { SectionHeading } from './Reveal';

export function Projects({ projects }: { projects: Project[] }) {
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <section id="work" className="relative border-b border-line bg-void py-28 md:py-36">
      <div className="mx-auto max-w-wide px-5 md:px-10">
        <SectionHeading
          index="03"
          kicker="Selected Work"
          title="Machines I've designed & shipped"
          description="A cross-section of robotics, computer-vision and embedded projects — from autonomous field robots to aerospace fuel systems."
        />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.title}
              {...project}
              index={index}
              featured={index === 0}
              onSelect={() => setSelected(project)}
            />
          ))}
        </div>
      </div>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
