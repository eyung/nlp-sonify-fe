import React from 'react';
import { useForm } from 'react-hook-form';
import Button from './Button';

//interface TextFormProps {
//  handleFormSubmitWrapper: (data: any) => void;
//}

type TextFormProps = {
  handleFormSubmitWrapper: (data: any) => void;
}

const TextForm: React.FC<TextFormProps> = ({ handleFormSubmitWrapper }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <form onSubmit={handleSubmit(handleFormSubmitWrapper)} className="mb-4">
      <textarea {...register('inputText', { required: true })} placeholder="" className="w-full h-96 p-2 mb-4 border rounded" />
      {errors.inputText && <p className="text-red-500">This field is required</p>}

      <Button />
      
    </form>
  );
};

export default TextForm;