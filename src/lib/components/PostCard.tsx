import React from 'react';
import { gql, useQuery } from '@apollo/client';

interface PostCardProps {
  post: {
    slug?: string;
    title?: string;
    excerpt?: string;
  };
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
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
