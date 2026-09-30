import React,{useCallback} from 'react'
import { useForm } from 'react-hook-form'
import { Button, Input, Select, RTE } from '../index';
import appwriteService from '../../appwrite/config';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
function PostForm({post}) {
    const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
        defaultValues: {
            title: post?.title || '',
            slug: post?.$id || '',
            content: post?.content || '',
            status: post?.status || "active",
        },
    });

    const dispatch = useDispatch();

    const navigate = useNavigate();
    const userData = useSelector(state => state.auth.userData);


    const submit = async (data) => {
        console.log(data)
        // console.log(userData.name)

        if (post) {
            let file = null;
            if (data.image && data.image[0]) {
                file = await appwriteService.uploadFile(data.image[0]);

                if (!file) {
                    console.log("Image upload failed.")
                    return
                }

                appwriteService.deleteFile(post.featuredImage);
            }

            const updateData = {
                title: data.title,
                content: data.content,
                status: data.status
            };

            if (file) {
                updateData.featuredImage = file.$id;
            }

            const dbPost = await appwriteService.updatePost(post.$id, updateData);

            if (dbPost) {
                navigate(`/post/${dbPost.$id}`);
            }
        } else {
            const file = await appwriteService.uploadFile(data.image[0]);

            if (file) {
                const fileId = file.$id;
                data.featuredImage = fileId;
                console.log(userData?.name)
                const dbPost = await appwriteService.createPost({ ...data, userId: userData.$id ,userName:userData.name});

                if (dbPost) {
                    navigate(`/post/${dbPost.$id}`);
                }
            }
        }
    };

    const slugTransform = useCallback((value) => {
      if (value && typeof value === "string") {
          return value
              .trim()
              .toLowerCase()
              .replace(/[^a-z0-9\s-]/g, "")
              .replace(/\s+/g, "-");
      }

      return "";
  }, []);

  React.useEffect(() => {
      const subscription = watch((value, { name }) => {
          if (name === "title") {
              setValue(
                  "slug",
                  slugTransform(value.title),{
                      shouldValidate: true
                  }
              );
          }
      });
      return () => {
          subscription.unsubscribe();
      };
  }, [watch, slugTransform, setValue]);



  return (
      <form onSubmit={handleSubmit(submit)} className="mx-auto max-w-6xl animate-rise">
            {/* Heading */}
            <div className="mb-6 px-1">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-volt">{post ? "Editing" : "Studio"}</p>
                <h1 className="mt-1 font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
                    {post ? "Polish your post" : "Create something new"}
                </h1>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
            {/* ===== Main column ===== */}
            <div className="lg:col-span-2 surface rounded-3xl p-5 sm:p-6 space-y-1">
                <Input
                    label="Title"
                    placeholder="Give it a catchy title"
                    className="mb-4 text-lg"
                    {...register("title", { required: true })}
                />
                <Input
                    label="Slug"
                    placeholder="auto-generated-slug"
                    className="mb-4 font-mono text-sm text-zinc-400"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                <div className="overflow-hidden rounded-2xl text-zinc-200 [&_label]:mb-2 [&_label]:inline-block [&_label]:pl-1 [&_label]:text-xs [&_label]:font-semibold [&_label]:uppercase [&_label]:tracking-[0.12em] [&_label]:text-zinc-400">
                    <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
                </div>
            </div>

            {/* ===== Side column ===== */}
            <div className="surface rounded-3xl p-5 sm:p-6 h-fit lg:sticky lg:top-28 space-y-1">
                <Input
                    label="Featured Image"
                    type="file"
                    className="mb-4 text-sm text-zinc-400 py-2.5"
                    accept="image/png, image/jpg, image/jpeg, image/gif,video/MP4"
                    {...register("image", { required: !post })}
                />
                {post && (
                    <div className="w-full mb-4 overflow-hidden rounded-2xl border border-white/6">
                        <img
                            src={appwriteService.getFileView(post.featuredImage)}
                            alt={post.title}
                            className="w-full object-cover"
                        />
                    </div>
                )}
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-5"
                    {...register("status", { required: true })}
                />
                <Button type="submit" bgColor={post ? "bg-iris" : undefined} textColor={post ? "text-white" : undefined} className="w-full py-3.5">
                    {post ? "Update" : "Submit"}
                </Button>
            </div>
            </div>
      </form>
  )
}

export default PostForm
