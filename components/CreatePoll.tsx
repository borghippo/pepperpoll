import { FormInputs } from "../types/types";
import { useState } from "react";
import { useRouter } from "next/router";
import { nanoid } from "nanoid";
import { createNewPoll, createNewQuestions } from "../lib/supabaseCalls";
import { useFieldArray, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { User } from "@supabase/supabase-js";

const schema = yup
  .object({
    title: yup.string().max(128).required(),
    options: yup
      .array()
      .of(
        yup
          .object({
            text: yup.string().required(),
          })
          .required(),
      )
      .min(2)
      .max(20)
      .required(),
  })
  .required();

const CreatePoll: React.FC<{ user: User }> = ({ user }) => {
  const [pushed, setPushed] = useState(false);
  const router = useRouter();

  const createPoll = async ({ title, options }: FormInputs) => {
    if (!pushed) {
      setPushed(true);
      const slug = nanoid();
      const pollData = await createNewPoll(title, slug, user!.id);

      if (pollData) {
        const questionsFormat = options.map((option) => {
          return {
            poll_id: pollData.id,
            question: option.text,
          };
        });

        const error = await createNewQuestions(questionsFormat);

        if (!error) {
          router.push(`/poll/${slug}`);
        }
      }
    }
  };

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {
      options: [{ text: "" }, { text: "" }],
    },
    resolver: yupResolver(schema),
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });

  const verifyRemoveOption = (index: number) => {
    if (fields.length > 2) {
      remove(index);
    }
  };

  const onSubmit = (data: FormInputs) => createPoll(data);

  return (
    <div className="flex flex-col space-y-4 my-2">
      <h1 className="p-4 text-4xl font-bold text-center">
        Create a Poll
      </h1>

      <div className="p-4 max-w-xl rounded-xl flex justify-center m-auto bg-orange-200">
        <form className="form-control" onSubmit={handleSubmit(onSubmit)}>
          <label className="label">
            <span className="label-text">Title</span>
          </label>
          <input className="input input-primary" {...register("title")} />

          <label className="label">
            <span className="label-text">Options</span>
          </label>
          {fields.map((field, index) => {
            return (
              <section className="space-x-2 space-y-2" key={field.id}>
                <input
                  className="input input-secondary"
                  placeholder={`Option ${index + 1}`}
                  {...register(`options.${index}.text` as const)}
                />
                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={() => verifyRemoveOption(index)}
                >
                  remove
                </button>
              </section>
            );
          })}
          <button
            className="btn btn-accent my-2"
            type="button"
            onClick={() =>
              append({
                text: "",
              })}
          >
            add option
          </button>

          <button className="btn btn-primary my-2" type="submit">submit</button>
        </form>
      </div>
    </div>
  );
};

export default CreatePoll;
