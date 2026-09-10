import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { POSTS, formatDate } from "@/lib/blog";
import { blogSchema, breadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Guides for London Landlords",
  description:
    "Straight answers on short-let rules, tax, running costs and what a London property can realistically earn on Airbnb.",
  path: "/blog",
});

export default function BlogIndexPage() {
  return (
    <>
      <JsonLd schema={blogSchema(POSTS)} />
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "For Landlords", path: "/blog" },
        ])}
      />

      <section className="section">
        <div className="wrap page-head">
          <div className="page-head__title">
            <p className="eyebrow">Rules, tax and earnings</p>
            <h1 className="d2">Written for London landlords</h1>
          </div>
          <p className="lead">
            The questions we get asked before anyone signs anything: what the
            rules actually say, what a property realistically earns, and what it
            costs to run. No filler, and nothing we would not tell you on the
            phone.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          {POSTS.length === 0 ? (
            <p className="body-lg">The first guides are being written. Check back shortly.</p>
          ) : (
            <ul className="postlist">
              {POSTS.map((post) => (
                <li key={post.slug} className="postlist__item">
                  <p className="eyebrow">{post.topic}</p>
                  <h2 className="d5 d5--tight">
                    <Link href={`/blog/${post.slug}/`}>{post.title}</Link>
                  </h2>
                  <p className="body-lg">{post.description}</p>
                  <p className="postmeta">
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                    <span aria-hidden="true">·</span>
                    <span>{post.minutes} min read</span>
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="section section--dark">
        <div className="wrap cta-bar">
          <div className="cta-bar__body">
            <h2 className="d5">Wondering what yours would earn?</h2>
            <p className="body-lg on-dark">
              Send us the postcode and we will come back with a realistic
              figure. Free, and no lock-in contract.
            </p>
          </div>
          <Link className="btn btn--light" href="/submit-property">
            Get free estimate
          </Link>
        </div>
      </section>
    </>
  );
}
