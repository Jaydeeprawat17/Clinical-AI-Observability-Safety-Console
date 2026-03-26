//const SUPABASE_FUNCTION_URL = 'https://YOUR-PROJECT-REF.supabase.co/functions/v1/generate-clipart' // ← REPLACE with your real URL from Step 2.4

export const generateClipart = async (prompt: string) => {
    const SUPABASE_FUNCTION_URL = process.env.SUPABASE_FUNCTION_URL || ''
  const response = await fetch(SUPABASE_FUNCTION_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Generation failed')
  }

  return response.json()
}