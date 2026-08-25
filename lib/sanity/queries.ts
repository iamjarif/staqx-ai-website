export const postsQuery = `
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc) [$start...$end] {
    "slug": slug.current,
    title,
    category,
    excerpt,
    publishedAt,
    coverImage {
      asset->{ _id, url },
      alt
    }
  }
`;

export const postsCountQuery = `
  count(*[_type == "post" && defined(slug.current)])
`;

export const allPostsQuery = `
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
    "slug": slug.current,
    title,
    category,
    excerpt,
    publishedAt,
    coverImage {
      asset->{ _id, url },
      alt
    }
  }
`;

export const postBySlugQuery = `
  *[_type == "post" && slug.current == $slug][0] {
    "slug": slug.current,
    title,
    category,
    excerpt,
    publishedAt,
    coverImage {
      asset->{ _id, url },
      alt
    },
    body[] {
      ...,
      _type == "image" => {
        ...,
        "url": asset->url,
        "alt": coalesce(alt, "")
      }
    }
  }
`;

export const recentPostsExcludingQuery = `
  *[_type == "post" && defined(slug.current) && slug.current != $slug]
    | order(publishedAt desc) [0...$limit] {
    "slug": slug.current,
    title,
    category,
    excerpt,
    publishedAt,
    coverImage {
      asset->{ _id, url },
      alt
    }
  }
`;
