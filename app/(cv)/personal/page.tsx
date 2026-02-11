'use client';

import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { updatePersonalData } from '../../store/cvSlice';
import { PersonalDataType } from '../../../app/types';

export default function PersonalPage() {
  const dispatch = useAppDispatch();
  const personalData = useAppSelector(
    state => state.cv.personalData
  );

  const { register, handleSubmit } = useForm<PersonalDataType>({
    defaultValues: personalData,
  });

  const onSave = (data: PersonalDataType) => {
    dispatch(updatePersonalData(data));
  };

  return (
    <form style={{ maxWidth: 700 }} onBlur={handleSubmit(onSave)}>
      <h1>Personal Information</h1>

      <label>
        Full Name *
        <input {...register('fullName', { required: true })} />
      </label>

      <label>
        Email *
        <input type="email" {...register('email', { required: true })} />
      </label>
    </form>
  );
}
