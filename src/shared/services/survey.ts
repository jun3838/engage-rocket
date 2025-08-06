import { SurveyResponse, Survey } from '@/shared/types';

const STORAGE_KEY = 'surveyResponses';

export const surveyService = {
  async getAll(): Promise<SurveyResponse[]> {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];

    // simulate fetching from an API
    await new Promise((resolve) => setTimeout(resolve, 500));

    return parsed.sort((a: SurveyResponse, b: SurveyResponse) =>
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    )
  },

  async save(surveyData: Survey): Promise<void> {
    // simulate fetching from an API
    await new Promise((resolve) => setTimeout(resolve, 500));

    // simulate an error
    if (surveyData.feedback?.includes('error')) {
      throw new Error();
    }

    const existing = await surveyService.getAll();
    const payload = {
      ...surveyData,
      id: crypto.randomUUID(),
      submittedAt: new Date().toISOString()
    }
    existing.push(payload);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  },

  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  },
};