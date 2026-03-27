const SUPABASE_FUNCTION_URL =
  process.env.EXPO_PUBLIC_SUPABASE_FUNCTION_URL ||
  process.env.SUPABASE_FUNCTION_URL ||
  ''
const SUPABASE_ANON_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  ''

export const generateClipart = async (prompt: string, imageBase64: string) => {
  if (!SUPABASE_FUNCTION_URL) {
    throw new Error(
      'EXPO_PUBLIC_SUPABASE_FUNCTION_URL is missing. Add it in your environment before generating.'
    )
  }
  if (!SUPABASE_ANON_KEY) {
    throw new Error(
      'EXPO_PUBLIC_SUPABASE_ANON_KEY is missing. Add it in your environment before generating.'
    )
  }
  const response = await fetch(SUPABASE_FUNCTION_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ prompt, imageBase64 }),
  })
  const responseText = await response.text()
  let responseData: any = null
  try {
    responseData = responseText ? JSON.parse(responseText) : null
  } catch {
    responseData = null
  }
  if (!response.ok) {
    const errorMessage =
      responseData?.error ||
      responseData?.message ||
      `Generation failed (${response.status})`
    throw new Error(errorMessage)
  }
  if (!responseData) {
    throw new Error('Generation failed: empty server response')
  }
  return responseData
}