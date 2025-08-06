import { type SubmitHandler, useForm, Controller } from 'react-hook-form';

import Button from '@/shared/components/Button';
import Card from '@/shared/components/Card';
import { surveyService } from '@/shared/services/survey';
import StarRating from '@/shared/components/StarRating';
import NumberRating from '@/shared/components/NumberRating';
import { type Survey } from '@/shared/types';
import FormError from '@/shared/components/FormError';

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
    clearErrors
  } = useForm<Survey>({
    defaultValues: {
      satisfaction: 0,
      nps: -1,
      department: '',
      feedback: ''
    },
    mode: 'onSubmit'
  });

  const onSubmit: SubmitHandler<Survey> = async (data: Survey) => {
    if (data.satisfaction === 0) {
      setError('satisfaction', { message: 'Satisfaction is required' });
    } else {
      clearErrors('satisfaction');
    }

    if (data.nps === -1) {
      setError('nps', { message: 'NPS score is required' });
    } else {
      clearErrors('nps');
    }

    try {
      await surveyService.save(data);
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
            1. Rate your job satisfaction
          </label>
          <input
            type="hidden"
            {...register('satisfaction', {
              validate: (v) => v > 0 || 'Satisfaction is required.',
            })}
          />
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
            2. How likely are you to recommend us?
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
            3. Your department
          </label>
          <select
            {...register('department', { required: 'Please select a department' })}
            className="border rounded px-3 py-2 w-full"
          >
            <option value="">Select a department</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          <FormError message={errors.department?.message} />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            4. Additional feedback (optional)
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
          <Button onClick={() => reset()}>
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