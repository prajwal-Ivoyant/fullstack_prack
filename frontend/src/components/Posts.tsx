import { useState } from "react";
import {
  useGetPostsQuery,
  useDeletePostMutation,
} from "../services/postsApi";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import { Button, Spin, Alert, Card, message } from "antd";
import UpdateModal from "./updateModal";
import CreatePost from "./createPost";

export type Post = {
  _id: string;
  title: string;
  content: string;
  user: {
    _id: string;
    email: string;
  };
};

type TokenPayload = {
  id: string;
};

export default function Posts() {
  const { data, isLoading, isError } = useGetPostsQuery();
  const [deletePost] = useDeletePostMutation();
  const navigate = useNavigate();

  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const token = localStorage.getItem("token");
  let userId: string | null = null;

  if (token) {
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      userId = decoded.id;
    } catch (err) {
      console.error("Invalid token");
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deletePost(id).unwrap();
      message.success("Post deleted ");
    } catch (err: any) {
      message.error(err?.data?.msg || "Delete failed ");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (isLoading) return <Spin />;

  if (isError)
    return <Alert type="error" message="Failed to load posts" />;

  if (!isLoading && data?.length === 0) {
  return (
    <div style={{ padding: 20 }}>
      <Button danger onClick={handleLogout} style={{ marginBottom: 20 }}>
        Logout
      </Button>

      <CreatePost />

      <p>No posts yet</p>
    </div>
  );
}

  return (
    <div style={{ padding: 20 }}>
     
      <Button danger onClick={handleLogout} style={{ marginBottom: 20 }}>
        Logout
      </Button>

      <CreatePost />

      {data?.map((p: Post) => {
        const isOwner = p.user?._id === userId;

        return (
          <Card key={p._id} style={{ marginBottom: 10 }}>
            <h3>{p.title}</h3>
            <p>{p.content}</p>
            <p style={{ fontSize: 12, color: "gray" }}>
              by {p.user?.email}
            </p>

            {isOwner && (
              <>
                <Button
                  type="primary"
                  onClick={() => setEditingPost(p)}
                  style={{ marginRight: 10 }}
                >
                  Edit
                </Button>

                <Button danger onClick={() => handleDelete(p._id)}>
                  Delete
                </Button>
              </>
            )}
          </Card>
        );
      })}

      {editingPost && (
        <UpdateModal
          post={editingPost}
          onClose={() => setEditingPost(null)}
        />
      )}
    </div>
  );
}
