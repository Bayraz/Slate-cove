import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import { POSTS, POST_BY_SLUG, formatDate, otherPosts } from "@/lib/blog";
import { articleSchema, breadcrumbSchema, pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = POST_BY_SLUG.get(slug);
  if (!post) return {};
  return pageMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
  });
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = POST_BY_SLUG.get(slug);
  if (!post) notFound();

  const more = otherPosts(post.slug);

  return (
    <>
      <JsonLd
        schema={articleSchema({
          title: post.title,
          description: post.description,
          path: `/blog/${post.slug}`,
          date: post.date,
          updated: post.updated,
        })}
      />
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "For Landlords", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ])}
      />

      <section className="section">
        <div className="wrap post-head">
          <p className="eyebrow">{post.topic}</p>
          <h1 className="d2">{post.title}</h1>
          <p className="lead">{post.description}</p>
          <p className="postmeta">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span aria-hidden="true">·</span>
            <span>{post.minutes} min read</span>
            {post.updated ? (
              <>
                <span aria-hidden="true">·</span>
                <span>
                  Updated <time dateTime={post.updated}>{formatDate(post.updated)}</time>
                </span>
              </>
            ) : null}
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          {post.summary.length > 0 && (
            <aside className="summary" aria-label="In short">
              <p className="summary__label">In short</p>
              <ul>
                {post.summary.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </aside>
          )}

          {/* The body is our own markdown, compiled at build time and never
              from user input, so rendering it directly is safe. */}
          <article className="prose" dangerouslySetInnerHTML={{ __html: post.html }} />
        </div>
      </section>

      {more.length > 0 && (
        <section className="section section--alt">
          <div className="wrap stack">
            <p className="eyebrow">Read next</p>
            <ul className="postlist postlist--compact">
              {more.map((p) => (
                <li key={p.slug} className="postlist__item">
                  <p className="eyebrow">{p.topic}</p>
                  <h2 className="d5 d5--tight">
                    <Link href={`/blog/${p.slug}/`}>{p.title}</Link>
                  </h2>
                  <p className="body-lg">{p.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="section section--dark">
        <div className="wrap cta-bar">
          <div className="cta-bar__body">
            <h2 className="d5">What would your property earn?</h2>
            <p className="body-lg on-dark">
              Send us the postcode and we will come back with a realistic
              figure. Free, and no lock-in contract.
            </p>
          </div>
          <Link className="btn btn--light" href="/contact">
            Get free estimate
          </Link>
        </div>
      </section>
    </>
  );
}
