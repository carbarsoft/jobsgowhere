import React from "react";
import { UseFormMethods, ValidationRules } from "react-hook-form";
import styled from "styled-components";

import { Fieldset, Label, TextInput } from "../../../components/FormFields";

const Text = styled.input.attrs({ type: "text" })`
  border: 0;
  border-style: solid;
  border-color: #dddddd;
  border-width: 0.1rem;
  border-radius: 0.875rem;
  min-height: 2rem;
`;

interface Props {
  register?: UseFormMethods["register"];
  rules?: ValidationRules;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TitleField: React.FC<Props> = function (props) {
  const { value, onChange, register, rules = {} } = props;
  return (
    <Fieldset name="title">
      <Label htmlFor="title">Title</Label>
      <TextInput
        id="title"
        name="title"
        value={value}
        onChange={onChange}
        ref={register && register(rules)}
      />
    </Fieldset>
  );
};

export default TitleField;
