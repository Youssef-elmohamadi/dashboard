import React from "react";
import { Editor } from "@tinymce/tinymce-react";

type EditorWrapperProps = {
  name: "content_ar" | "content_en";
  value: string;
  onChange: (name: string, content: string) => void;
};

const EditorWrapper: React.FC<EditorWrapperProps> = ({
  name,
  value,
  onChange,
}) => {
  return (
    <div className="prose dark:prose-invert">
      <Editor
        apiKey="rr0isuzsm23je7iouolhf0224e6mudqkzs4r43got1arnqwa"
        value={value}
        init={{
          forced_root_block: "div",
          valid_elements: "*[*]",
          height: 500,
          menubar: true,
          plugins: [
            "advlist autolink lists link image charmap preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table code help wordcount",
            "image",
          ],
          toolbar:
            "undo redo | formatselect | bold italic backcolor | " +
            "alignleft aligncenter alignright alignjustify | " +
            "bullist numlist outdent indent | removeformat | help | image",
          images_upload_url:
            "https://tashtiba.com/api/superAdmin/articles/upload-image",
          images_upload_handler: (blobInfo) =>
            new Promise((resolve, reject) => {
              const xhr = new XMLHttpRequest();
              xhr.open(
                "POST",
                "https://tashtiba.com/api/superAdmin/articles/upload-image"
              );
              xhr.onload = () => {
                if (xhr.status === 200) {
                  const json = JSON.parse(xhr.responseText);
                  resolve(json.location);
                } else {
                  reject("HTTP Error: " + xhr.status);
                }
              };
              xhr.onerror = () => {
                reject(
                  "Image upload failed due to a XHR Transport error. Code: " +
                    xhr.status
                );
              };
              const formData = new FormData();
              formData.append("file", blobInfo.blob(), blobInfo.filename());
              xhr.send(formData);
            }),
        }}
        onEditorChange={(newContent) => onChange(name, newContent)}
      />
    </div>
  );
};

export default EditorWrapper;
