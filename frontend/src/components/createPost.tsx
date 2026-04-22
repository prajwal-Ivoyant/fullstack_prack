import { Card, Form, Input, Button, message } from "antd";
import { useCreatePostMutation } from "../services/postsApi";

export default function CreatePost() {
  const [form] = Form.useForm();
  const [createPost, { isLoading }] = useCreatePostMutation();

  const onFinish = async (values: {
    title: string;
    content: string;
  }) => {
    try {
      await createPost({
        title: values.title.trim(),
        content: values.content.trim(),
      }).unwrap();

      message.success("Post created ");
      form.resetFields(); 
    } catch (err: any) {
      message.error(err?.data?.msg || "Create failed ");
    }
  };

  return (
    <Card style={{ marginBottom: 20 }}>
      <h3>Create Post</h3>

      <Form layout="vertical" form={form} onFinish={onFinish}>
        {/* TITLE */}
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

        {/* CONTENT */}
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

        {/* BUTTON */}
        <Button
          type="primary"
          htmlType="submit"
          loading={isLoading}
          block
        >
          Create
        </Button>
      </Form>
    </Card>
  );
}