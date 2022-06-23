import type { NextPage } from "next";
import { useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { supabase } from "../utils/supabase";
import { nanoid } from "nanoid";
import { useRouter } from "next/router";
import { useState } from "react";

type FormInputs = {
  title: string;
  options: {
    text: string;
  }[];
};

export type PollDB = {
  id: number;
  created_at: string;
  title: string;
  slug: string;
};

const schema = yup
  .object({
    title: yup.string().required(),
    options: yup
      .array()
      .of(
        yup
          .object({
            text: yup.string().required(),
          })
          .required()
      )
      .min(2)
      .required(),
  })
  .required();

const Create: NextPage = () => {
  const [pushed, setPushed] = useState(false);
  const router = useRouter();
  const createPoll = async ({ title, options }: FormInputs) => {
    if (!pushed) {
      setPushed(true);
      const slug = nanoid();
      const { data: poll } = await supabase
        .from<PollDB>("polls")
        .insert([{ title: title, slug: slug }])
        .single();

      if (poll) {
        const questionsFormat = options.map((option) => {
          return {
            poll_id: poll.id,
            question: option.text,
          };
        });

        const { error } = await supabase
          .from("questions")
          .insert([...questionsFormat]);

        if (error) {
          console.log(error.message);
        } else {
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("title")} />

      {fields.map((field, index) => {
        return (
          <div key={field.id}>
            <input
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
          </div>
        );
      })}
      <button
        className="btn btn-accent"
        type="button"
        onClick={() =>
          append({
            text: "",
          })
        }
      >
        add option
      </button>

      <input className="btn btn-primary" type="submit" />
    </form>
  );
};

export default Create;
