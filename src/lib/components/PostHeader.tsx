import React from 'react';
import Link from 'next/link';

interface PostHeaderProps {
  post: {
    slug?: string;
    title?: string;
    excerpt?: string;
  };
}

const PostHeader: React.FC<PostHeaderProps> = ({ post }) => {
  return (
    <div>
      <h1>
        <Link href={`/${post?.slug as string}`}>
          <a href={`/${post?.slug as string}`}>{post?.title as string}</a>
        </Link>
      </h1>
      <div dangerouslySetInnerHTML={{ __html: post?.excerpt ?? '' }} />
    </div>
  );
};

export default PostHeader;
