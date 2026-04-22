import { Modal, Form, Input, message } from "antd";
import { useUpdatePostMutation } from "../services/postsApi";
import { useEffect } from "react";

type Post = {
  _id: string;
  title: string;
  content: string;
};

export default function UpdateModal({
  post,
  onClose,
}: {
  post: Post;
  onClose: () => void;
}) {
  const [form] = Form.useForm();
  const [updatePost, { isLoading }] = useUpdatePostMutation();
  
  useEffect(() => {
    form.setFieldsValue({
      title: post.title,
      content: post.content,
    });
  }, [post, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      if (
        values.title.trim() === post.title &&
        values.content.trim() === post.content
      ) {
        message.warning("No changes made");
        return;
      }

      await updatePost({
        id: post._id,
        title: values.title.trim(),
        content: values.content.trim(),
      }).unwrap();

      message.success("Post updated ");
      onClose();
    } catch (err: any) {

      if (err?.data) {
        message.error(err.data.msg || "Update failed ");
      }
    }
  };

  return (
    <Modal
      title="Edit Post"
      open={true}
      onOk={handleOk}
      onCancel={onClose}
      confirmLoading={isLoading}
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          label="Title"
          name="title"
          rules={[
            { required: true, message: "Title is required" },
            { min: 3, message: "Minimum 3 characters" },
            {
              validator: (_, value) =>
                value?.trim()
                  ? Promise.resolve()
                  : Promise.reject("Cannot be empty"),
            },
          ]}
        >
          <Input placeholder="Enter title" />
        </Form.Item>

        <Form.Item
          label="Content"
          name="content"
          rules={[
            { required: true, message: "Content is required" },
            { min: 5, message: "Minimum 5 characters" },
            {
              validator: (_, value) =>
                value?.trim()
                  ? Promise.resolve()
                  : Promise.reject("Cannot be empty"),
            },
          ]}
        >
          <Input.TextArea rows={4} placeholder="Enter content" />
        </Form.Item>
      </Form>
    </Modal>
  );
}