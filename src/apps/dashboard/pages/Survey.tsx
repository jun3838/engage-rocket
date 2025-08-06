import { useForm, type SubmitHandler } from 'react-hook-form';

import Button from '@/shared/components/Button';
import Card from '@/shared/components/Card';
import { surveyService } from '@/shared/services/survey';
import StarRating from '@/shared/components/StarRating';
import NumberRating from '@/shared/components/NumberRating';
import { type Survey } from '@/shared/types';

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
    setValue,
    watch,
    trigger,
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
    let valid = true;

    if (data.satisfaction === 0) {
      trigger('satisfaction')
      setError('satisfaction', { message: 'Satisfaction is required' });
      valid = false;
    } else {
      clearErrors('satisfaction');
    }

    if (data.nps === -1) {
      trigger('nps')
      setError('nps', { message: 'NPS score is required' });
      valid = false;
    } else {
      clearErrors('nps');
    }

    if (!valid) return;

    try {
      if (data.feedback?.includes('error')) {
        // simulate API error
        throw new Error();
      } else {
        await surveyService.save(data);
        console.log('Survey submitted:', data);
        reset();
      }
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
          <StarRating
            value={watch('satisfaction')}
            onChange={(rating) => setValue('satisfaction', rating, { shouldValidate: true })}
          />
          {errors.satisfaction && <p className="text-red-500 text-sm">{errors.satisfaction.message}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">
            2. How likely are you to recommend us?
          </label>
          <input
            type="hidden"
            {...register('nps', {
              validate: (v) => v >= 0 || 'NPS score is required.',
            })}
          />
           <NumberRating
            value={watch('nps')}
            onChange={(score) => setValue('nps', score, { shouldValidate: true })}
          />
          {errors.nps && <p className="text-red-500 text-sm">{errors.nps.message}</p>}
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
          {errors.department && <p className="text-red-500 text-sm">{errors.department.message}</p>}
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

        <Button type="submit" className={isSubmitting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}>
          Submit
        </Button>

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