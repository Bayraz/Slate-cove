import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import { POSTS, formatDate } from "@/lib/blog";
import { LANDLORD_REFERRAL, LANDLORD_REFERRAL_POINTS, TICK } from "@/lib/content";
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

      {/* The referral sits on the landlords' own page rather than with the
          agent terms. It is the same kind of offer but a different reader, and
          the figure is stated here only, so the two cannot drift apart. */}
      <section className="section section--alt">
        <div className="wrap stack stack--tight">
          <div className="section-head">
            <p className="eyebrow">For owners we manage for</p>
            <h2 className="d5">
              Introduce another landlord, and we pay you {LANDLORD_REFERRAL.fee}
            </h2>
          </div>
          <p className="lead">
            If we run a property for you and you put another owner our way, we
            pay you {LANDLORD_REFERRAL.fee} once their property is live and
            earning, {LANDLORD_REFERRAL.window}. Nothing to sign, and nothing
            owed if it does not go ahead.
          </p>
          <ul className="terms">
            {LANDLORD_REFERRAL_POINTS.map((point) => (
              <li key={point}>
                <Icon className="tick" d={TICK} />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

    </>
  );
}
