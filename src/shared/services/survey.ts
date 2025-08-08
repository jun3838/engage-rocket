import { SurveyResponse, Survey } from '@/shared/types';

const useSurveyService = () => {
  const STORAGE_KEY = 'survey-response';

  const getResponse = async (): Promise<SurveyResponse[]> => {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];

    // simulate fetching from an API
    await new Promise((resolve) => setTimeout(resolve, 500));

    return parsed.sort((a: SurveyResponse, b: SurveyResponse) =>
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    )
  }

  const save = async (surveyData: Survey): Promise<void> => {
    // simulate fetching from an API
    await new Promise((resolve) => setTimeout(resolve, 500));

    // simulate an error
    if (surveyData.feedback?.includes('error')) {
      throw new Error();
    }

    const existing = await getResponse();
    const payload = {
      ...surveyData,
      id: crypto.randomUUID(),
      submittedAt: new Date().toISOString()
    }
    existing.push(payload);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  }

  const clear = (): void => {
    localStorage.removeItem(STORAGE_KEY);
  }

  return {
    getResponse,
    save,
    clear
  }
}

export default useSurveyService;
