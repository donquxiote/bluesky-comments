import React from 'react';
import { AppBskyFeedDefs, AppBskyFeedPost } from '@atproto/api';
import styles from './CommentSection.module.css';
import { getPostText, sortThreadPostsByLikes } from './types';

type CommentProps = {
  comment: AppBskyFeedDefs.ThreadViewPost;
  filters?: Array<(arg: any) => boolean>;
  dataIndex?: number;
};

export const Comment = ({ comment, filters, dataIndex }: CommentProps) => {
  const author = comment.post.author;
  const avatarClassName = styles.avatar;

  if (!AppBskyFeedPost.isRecord(comment.post.record)) return null;
  // filter out replies that match any of the commentFilters, by ensuring they all return false
  if (filters && !filters.every((filter) => !filter(comment))) return null;

  return (
    <blockquote className={styles.commentContainer} data-index={dataIndex}>
      <div className={styles.commentContent}>
        <a
          className={styles.authorLink}
          href={`https://bsky.app/profile/${author.did}`}
          target="_blank"
          rel="noreferrer noopener"
        >
          {author.avatar ? (
            <img
              src={comment.post.author.avatar}
              alt={`${author.handle} avatar`}
              className={avatarClassName}
            />
          ) : (
            <div className={avatarClassName} />
          )}
          <p className={styles.authorName}>
            {author.displayName ?? author.handle}{' '}
            <span className={styles.handle}>@{author.handle}</span>
          </p>
        </a>
          <p>{getPostText(comment.post.record)}</p>
            <div className={styles.commentFooter}>
              <Actions post={comment.post} author={author} />
            </div>
      </div>
      {comment.replies && comment.replies.length > 0 && (
        <div className={styles.repliesContainer}>
          {comment.replies.sort(sortThreadPostsByLikes).map((reply, index) => {
            if (!AppBskyFeedDefs.isThreadViewPost(reply)) return null;
            return (
              <Comment key={reply.post.uri} comment={reply} filters={filters} />
            );
          })}
        </div>
      )}
    </blockquote>
  );
};

const Actions = ({ post, author }: { post: AppBskyFeedDefs.PostView, author: any }) => (
  <div className={styles.actionsContainer}>
    <div className={styles.actionsRow}>
      <svg
        className={styles.icon}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
        />
      </svg>
      <p className="text-xs">{post.replyCount ?? 0} <span className={styles.screenReader}>replies</span></p>
    </div>
    <div className={styles.actionsRow}>
      <svg
        className={styles.icon}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3"
        />
      </svg>
      <p className="text-xs">{post.repostCount ?? 0}  <span className={styles.screenReader}>reposts</span></p>
    </div>
    <div className={styles.actionsRow}>
      <svg
        className={styles.icon}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
        />
      </svg>
      <p className="text-xs">{post.likeCount ?? 0}  <span className={styles.screenReader}>likes</span></p>
    </div>
    <div className={`${styles.actionsRow}, ${styles.replyAction}`}>
      <p className="text-xs">
        <a className="replyLink" href={`https://bsky.app/profile/${author.did}/post/${post.uri.split('/').pop()}`} target="_blank" rel="noreferrer noopener">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path fill="currentColor" d="M17.25 4a.75.75 0 0 1 .75.75A7.25 7.25 0 0 1 10.75 12H4.56l3.22 3.22a.75.75 0 1 1-1.06 1.06l-4.5-4.5a.75.75 0 0 1 0-1.06l4.5-4.5a.75.75 0 0 1 1.06 1.06L4.56 10.5h6.19a5.75 5.75 0 0 0 5.75-5.75a.75.75 0 0 1 .75-.75"/></svg>
          <span className={styles.screenReader}>Reply to @{author.handle}</span>
        </a>
      </p>
    </div>
  </div>
);



