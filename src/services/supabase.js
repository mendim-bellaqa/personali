// Minimal Supabase client wrapper
import { createClient } from '@supabase/supabase-js'

// Read environment variables (Vue CLI exposes VUE_APP_* to client code)
const SUPABASE_URL = process.env.VUE_APP_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.VUE_APP_SUPABASE_ANON_KEY

let supabase = null

if (SUPABASE_URL && SUPABASE_ANON_KEY) {
	supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
} else {
	// Provide a safe stub so importing modules don't crash when env vars are not set.
	// This allows local dev without Supabase configured and avoids the white screen.
	// When the app actually needs Supabase, check for `supabase` or handle the returned error.
	console.warn('VUE_APP_SUPABASE_URL or VUE_APP_SUPABASE_ANON_KEY is not set. Supabase client disabled.')
	supabase = {
		auth: {
			// mimic async methods used in the app and return an error object similar to supabase
			async signUp() { return { error: new Error('Supabase not configured') } },
			async signInWithPassword() { return { error: new Error('Supabase not configured') } },
			onAuthStateChange() { return { data: null } },
			async signOut() { return { error: null } },
			// getUser uses newer supabase API; provide a fallback
			async getUser() { return { data: null, error: new Error('Supabase not configured') } }
		},
		// placeholder for storage/from/table helpers if referenced later
		from() { return { upload: async () => ({ error: new Error('Supabase not configured') }), download: async () => ({ error: new Error('Supabase not configured') }) } }
	}
}

export { supabase }
export default supabase
