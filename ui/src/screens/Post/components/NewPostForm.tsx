import * as React from "react";
import { useForm } from "react-hook-form";
import { useHistory, useLocation } from "react-router-dom";
import styled from "styled-components";

import Button from "../../../components/Button";
import { Fieldset, InputErrorMessage, Label, TextInput } from "../../../components/FormFields";
import { toast } from "../../../components/useToast";
import { usePost } from "../../../contexts/Post";
import JobsGoWhereApiClient from "../../../shared/services/JobsGoWhereApiClient";
import { PostType } from "../../../types";
import DescriptionField from "./DescriptionField";
import PostTypeField from "./PostTypeField";

const Container = styled.div`
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  width: 100%;
  background-color: white;
  border-radius: 0.875rem;
  padding: 1.5rem;
`;

const Buttons = styled.div`
  display: flex;
  margin-top: 0.5rem;
  ${Button} + ${Button} {
    margin-left: 1rem;
  }
`;

const INITIAL_TYPE = "talent";
const EDIT_POST_PATHNAME = "/posts/edit";
const NEW_POST_PATHNAME = "/posts/new";

const NewPostForm: React.FC = () => {
  const history = useHistory();
  const { handleSubmit, setValue, getValues, watch, register, errors } = useForm<FormFields>();
  const watchPostType = watch("type", INITIAL_TYPE);
  const postContext = usePost();
  const location = useLocation();
  const isEditMode = location.pathname === EDIT_POST_PATHNAME;
  const isNewMode = location.pathname === NEW_POST_PATHNAME;

  interface FormFields {
    type: PostType;
    title: string;
    job_link?: string;
    description: string;
    city: string;
  }

  const onCancel = () => {
    postContext.setPost(null);
    postContext.setType(null);
    history.goBack();
  };

  const onSubmit = (values: FormFields) => {
    const postJob = async () => {
      try {
        await JobsGoWhereApiClient.post(
          `${process.env.REACT_APP_API}/${values.type}`,
          JSON.stringify(values),
        );
        history.push(`/${values.type}s`);
        toast("Your post has been successfully created! 👍");
      } catch (err) {
        console.error("error", err);
        toast("We are unable to create your post at this time 🙇‍♂️");
      }
    };

    const updateJob = async () => {
      try {
        await JobsGoWhereApiClient.put(
          `${process.env.REACT_APP_API}/${values.type}sbyid/${postContext.post?.id}`,
          JSON.stringify(values),
        );
        history.push(`/${values.type}s`);
        toast("Your post has been successfully updated! 👍");
        postContext.setPost(null);
        postContext.setType(null);
      } catch (err) {
        console.error("error", err);
        toast("We are unable to update your post at this time 🙇‍♂️");
      }
    };

    if (postContext.post?.id && isEditMode) {
      updateJob();
    } else {
      postJob();
    }
  };

  React.useEffect(() => {
    register({ name: "type" }, { required: true });
    if (postContext.type) {
      setValue("type", postContext.type.slice(0, -1));
    } else {
      setValue("type", INITIAL_TYPE);
    }
    if (isNewMode) {
      postContext.setPost(null);
      postContext.setType(null);
    }
  }, [register, setValue]);

  return (
    <Container>
      <form onSubmit={handleSubmit(onSubmit)}>
        {isNewMode && (
          <PostTypeField
            value={watchPostType}
            onChange={(type) => {
              setValue("type", type);
            }}
          />
        )}
        <Fieldset>
          <Label htmlFor="title">Title</Label>
          <TextInput
            id="title"
            name="title"
            key={isEditMode.toString()}
            defaultValue={isEditMode ? postContext.post?.title : ""}
            ref={register({ required: "Please enter a post title" })}
            error={!!errors.title}
          />
          {errors.title && <InputErrorMessage>{errors.title.message}</InputErrorMessage>}
        </Fieldset>
        {watchPostType === "job" && (
          <Fieldset>
            <Label htmlFor="job_link">Job Role Link</Label>
            <TextInput
              id="job_link"
              name="job_link"
              key={isEditMode.toString()}
              defaultValue={isEditMode ? postContext.post?.job_link : ""}
              ref={register({
                required: "Please enter a job link in this format (e.g. https://jobsgowhere.com)",
                pattern: {
                  value: /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/,
                  message: "Please enter a valid job link (e.g. https://jobsgowhere.com)",
                },
              })}
              error={!!errors.job_link}
            />
            {errors.job_link && <InputErrorMessage>{errors.job_link.message}</InputErrorMessage>}
          </Fieldset>
        )}

        <DescriptionField
          key={isEditMode.toString()}
          register={register}
          rules={{
            required: "Please enter a post description",
            minLength: {
              value: 3,
              message: "Please enter a description with a minimum of 3 characters",
            },
          }}
          error={errors.description}
          defaultValue={isEditMode ? postContext.post?.description : ""}
        />
        <input type="hidden" name="city" value="Singapore" ref={register} />
        <Buttons>
          <Button fullWidth type="button" onClick={() => onCancel()}>
            Cancel
          </Button>
          <Button fullWidth primary type="submit">
            {postContext.post?.id && isEditMode ? "Save" : "Create"}
          </Button>
        </Buttons>
      </form>
    </Container>
  );
};

export default NewPostForm;
