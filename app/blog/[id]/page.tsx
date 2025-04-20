"use client";

import { notFound } from "next/navigation";
import Image from "next/image";
import SharedLayout from "@/components/SharedLayout";
import useBlogStore from "@/store/useBlogStore";
import { useEffect } from "react";

const BlogPost = ({ params }: { params: { id: string } }) => {
  const { currentBlog, fetchBlogById, isLoading, error } = useBlogStore();

  useEffect(() => {
    fetchBlogById(params.id);
  }, [fetchBlogById, params.id]);

  if (isLoading) {
    return (
      <SharedLayout>
        <div className="max-w-3xl mx-auto">
          <p>Loading...</p>
        </div>
      </SharedLayout>
    );
  }

  if (error) {
    return (
      <SharedLayout>
        <div className="max-w-3xl mx-auto">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </SharedLayout>
    );
  }

  if (!currentBlog) {
    return (
      <SharedLayout>
        <div className="max-w-3xl mx-auto">
          <p>Blog post not found.</p>
        </div>
      </SharedLayout>
    );
  }

  return (
    <SharedLayout>
      <article className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">{currentBlog.title}</h1>
        <div className="text-text-secondary mb-6">
          <span>{new Date(currentBlog.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="relative h-96 mb-8">
          <Image
            src={currentBlog.imageUrl}
            alt={currentBlog.title}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            priority
            className="rounded-lg object-cover"
          />
        </div>
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: currentBlog.content }}
        />
      </article>
    </SharedLayout>
  );
};

export default BlogPost;

