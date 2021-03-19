import { gql, useQuery } from '@apollo/client';

interface PostCardProps {
  slug: string;
}

const PostCard: React.FC<PostCardProps> = ({ slug }) => {
  const { data } = useQuery(
    gql`
      query GetPost($slug: String!) {
        postBy(slug: $slug) {
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

  const post = data?.postBy;

  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title">{post?.title}</h5>
        <div dangerouslySetInnerHTML={{ __html: post?.excerpt ?? '' }} />
      </div>
    </div>
  );
};

export default PostCard;
