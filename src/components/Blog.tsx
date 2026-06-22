import { useState } from 'react';
import { BlogCard, type BlogPost } from './BlogCard';
import { BlogModal } from './BlogModal';
import { SectionHeading } from './Reveal';
import { ShowMoreButton } from './ShowMoreButton';

const INITIAL_VISIBLE = 4;

export function Blog({ posts }: { posts: BlogPost[] }) {
  const [selected, setSelected] = useState<BlogPost | null>(null);
  const [expanded, setExpanded] = useState(false);

  if (!posts || posts.length === 0) return null;

  const visible = expanded ? posts : posts.slice(0, INITIAL_VISIBLE);

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
          {visible.map((post, index) => (
            <BlogCard
              key={post.id}
              {...post}
              index={index}
              featured={index === 0}
              onSelect={() => setSelected(post)}
            />
          ))}
        </div>

        {posts.length > INITIAL_VISIBLE && (
          <ShowMoreButton
            expanded={expanded}
            onToggle={() => setExpanded((v) => !v)}
            collapsedLabel={`Show all ${posts.length} posts`}
            expandedLabel="Show fewer posts"
          />
        )}
      </div>

      <BlogModal post={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
