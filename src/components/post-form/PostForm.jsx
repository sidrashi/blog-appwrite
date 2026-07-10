import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import service from "../../appwrite/config";
import { Button, Input, RTE, Select } from "../index";
import {
  setActivePostsNeedsRefresh,
  setAllPostsNeedsRefresh,
} from "../../store/postSlice";

function PostForm({ post }) {
  const { register, handleSubmit, watch, setValue, getValues, control } =
    useForm({
      defaultValues: {
        title: post?.title || "",
        slug: post?.slug || "",
        content: post?.content || "",
        status: post?.status || "active",
      },
    });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (data) => {
    let fileId = null;

    setError("");
    setLoading(true);

    try {
      if (post) {
        const file = data.image[0]
          ? await service.uploadFile(data.image[0])
          : null;

        if (file) {
          service.deleteFile(post.featuredImage);
        }
        const dbPost = await service.updatePost(post.$id, {
          ...data,
          featuredImage: file ? file.$id : undefined,
        });
        if (dbPost) {
          dispatch(setActivePostsNeedsRefresh(true));
          dispatch(setAllPostsNeedsRefresh(true));
          navigate(`/post/${dbPost.$id}`);
        }
      } else {
        const file = await service.uploadFile(data.image[0]);

        if (file) {
          fileId = file.$id;
          data.featuredImage = fileId;
          const dbPost = await service.createPost({
            ...data,
            userId: userData.$id,
          });

          if (dbPost) {
            dispatch(setActivePostsNeedsRefresh(true));
            dispatch(setAllPostsNeedsRefresh(true));
            navigate(`/post/${dbPost.$id}`);
          }
        }
      }
    } catch (error) {
      if (fileId) {
        await service.deleteFile(fileId);
      }

      if (error.code === 409) {
        setError("A post with this title already exists.");
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string") {
      return value.trim().toLowerCase().replace(/\s/g, "-");
    }
    return "";
  }, []);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title, { shouldValidate: true }));
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [watch, slugTransform, setValue]);

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
      <div className="w-2/3 px-2">
        <Input
          label="Title :"
          placeholder="Title"
          className={`mb-4  ${error ? "border-red-500" : ""}`}
          {...register("title", { required: true })}
        />
        <Input
          label="Slug :"
          placeholder="Slug"
          className="mb-4"
          {...register("slug", { required: true })}
          onInput={(e) => {
            setValue("slug", slugTransform(e.currentTarget.value), {
              shouldValidate: true,
            });
          }}
        />
        <RTE
          label="Content :"
          name="content"
          control={control}
          defaultValue={getValues("content")}
        />
      </div>
      <div className="w-1/3 px-2">
        <Input
          label="Featured Image:"
          type="file"
          className="mb-4"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...register("image", { required: !post })}
        />
        {post && (
          <div className="w-full mb-4">
            <img
              src={service.getFileView(post.featuredImage)}
              alt={post.title}
              className="rounded-lg"
            />
          </div>
        )}
        <Select
          options={["active", "inactive"]}
          label="Status"
          className="mb-4 w-full"
          {...register("status", { required: true })}
        />
        {error && <p className="text-red-600 my-2 text-center">{error}</p>}
        <Button
          type="submit"
          bgColor={post ? "bg-green-500" : undefined}
          className="w-full"
          disabled={loading}
        >
          {loading ? "Submitting...." : `${post ? "Update" : "Submit"}`}
        </Button>
      </div>
    </form>
  );
}

export default PostForm;
