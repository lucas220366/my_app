"use client";

import Link from "next/link";
import Image from "next/image";
import SharedLayout from "@/components/SharedLayout";
import useBlogStore from "@/store/useBlogStore";
import { useEffect } from "react";

const BlogPage = () => {
  const { blogs, fetchAllBlogs, setSelectedBlog } = useBlogStore();

  useEffect(() => {
    fetchAllBlogs();
  }, [fetchAllBlogs]);

  return (
    <SharedLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">
          ChatBotYard Blog
        </h1>
        <div className="grid gap-8 md:grid-cols-2">
          {blogs.map((post) => (
            <Link key={post._id} href={`/blog/${post._id}`} className="group">
              <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-48">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-text-secondary mb-4">{post.description}</p>
                  <div className="text-sm text-text-secondary">
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </SharedLayout>
  );
};

export default BlogPage;

