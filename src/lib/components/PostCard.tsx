import React from 'react';
import { gql, useQuery } from '@apollo/client';

interface PostCardProps {
  slug: string;
}

const PostCard: React.FC<PostCardProps> = ({ slug }) => {
  const { data } = useQuery<{ post: WPGraphQL.RootQuery['post'] }>(
    gql`
      query GetPost($slug: String!) {
        post(id: $slug, idType: SLUG) {
          featuredImage {
            node {
              uri
            }
          }
          title
          excerpt
        }
      }
    `,
    {
      variables: {
        slug,
      },
    },
  );

  const post = data?.post;

  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title">{post?.title as string}</h5>
        <div dangerouslySetInnerHTML={{ __html: post?.excerpt ?? '' }} />
      </div>
    </div>
  );
};

export default PostCard;
