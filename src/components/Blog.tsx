import { useState } from 'react';
import { BlogCard, type BlogPost } from './BlogCard';
import { BlogModal } from './BlogModal';
import { SectionHeading } from './Reveal';

export function Blog({ posts }: { posts: BlogPost[] }) {
  const [selected, setSelected] = useState<BlogPost | null>(null);

  if (!posts || posts.length === 0) return null;

  return (
    <section id="blog" className="relative border-b border-line bg-void py-28 md:py-36">
      <div className="mx-auto max-w-wide px-5 md:px-10">
        <SectionHeading
          index="04"
          kicker="Writing & Thoughts"
          title="Notes on Engineering"
          description="A collection of technical articles, thoughts, and learnings from my journey in robotics, AI, and software engineering."
        />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {posts.map((post, index) => (
            <BlogCard
              key={post.id}
              {...post}
              index={index}
              featured={index === 0}
              onSelect={() => setSelected(post)}
            />
          ))}
        </div>
      </div>

      <BlogModal post={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
