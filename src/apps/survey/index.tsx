import { type SubmitHandler, useForm, Controller } from 'react-hook-form';

import Button from '@/shared/components/Button';
import Card from '@/shared/components/Card';
import useSurveyService from '@/shared/services/survey';
import StarRating from '@/apps/survey/components/StarRating';
import NumberRating from '@/apps/survey/components/NumberRating';
import { type Survey } from '@/shared/types';
import FormError from '@/apps/survey/components/FormError';

const departments = [
  'Engineering',
  'Marketing',
  'Sales',
  'HR'
];

export default function Survey() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    setError,
    reset,
    control,
  } = useForm<Survey>();

  const { save } = useSurveyService();

  const onSubmit: SubmitHandler<Survey> = async (data: Survey) => {
    try {
      await save(data);
      console.log('Survey submitted:', data);
      reset();
    } catch {
      setError('root', { message: 'Failed to submit. Please try again.' });
    }
  };

  return (
    <Card className="max-w-xl mx-auto space-y-4">
      <h2 className="text-2xl font-semibold">Employee Survey</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">
            Your name
          </label>
          <input
            {...register('name', { required: 'Name is required' })}
            placeholder='Enter your name'
            className="border rounded px-3 py-2 w-full"
            type="text"
          />
          <FormError message={errors.name?.message} />
        </div>
        <div>
          <label className="block mb-1 font-medium">
            Rate your job satisfaction
          </label>
          <Controller
            name="satisfaction"
            control={control}
            rules={{
              validate: (value) => value > 0 || 'Satisfaction is required.'
            }}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <>
                <StarRating
                  value={value}
                  onChange={(rating) => onChange(rating)}
                />
                <FormError message={error?.message} />
              </>
            )}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            How likely are you to recommend us?
          </label>
          <Controller
            name="nps"
            control={control}
            rules={{
              validate: (value) => value >= 0 || 'NPS score is required.'
            }}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <>
                <NumberRating
                  value={value}
                  onChange={(rating) => onChange(rating)}
                />
                <FormError message={error?.message} />
              </>
            )}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Your department
          </label>
          <select
            {...register('department', { required: 'Please select a department' })}
            className="border rounded px-3 py-2 w-full"
          >
            <option value="" className="hidden">Select a department</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          <FormError message={errors.department?.message} />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Additional feedback (optional)
          </label>
          <textarea
            {...register('feedback')}
            className="w-full border px-3 py-2 rounded"
            rows={3}
          />
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={isSubmitting}>
            Submit
          </Button>
          <Button type="button" onClick={() => reset()}>
            Clear
          </Button>
        </div>

        {isSubmitSuccessful && (
          <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            Thank you for your response!
          </div>
        )}

        {errors.root && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            Failed to submit. Please try again.
          </div>
        )}

      </form>
    </Card>
  );
}