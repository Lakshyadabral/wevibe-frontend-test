'use server';

import { AuthError } from 'next-auth';
import { signIn, signOut } from "../../auth"
import { revalidatePath } from "next/cache"
import { cookies } from 'next/headers'
import { auth as nextAuth } from '../../auth'



export const auth = nextAuth;

export async function login(provider: string) {
    await signIn(provider, { redirectTo: '/' })
    revalidatePath('/')
}

export async function logout() {
  try {
    // Clear NextAuth session
    await signOut({ redirect: false })
    
    // Manually clear all auth cookies
    const cookieStore = cookies()
    const authCookies = cookieStore.getAll()
      .filter(cookie => cookie.name.startsWith('next-auth.'))
    
    authCookies.forEach(cookie => {
      cookieStore.delete(cookie.name)
    })
    
    return { success: true }
  } catch (error) {
    console.error('Logout error:', error)
    return { success: false }
  }
}

// export async function authenticate(
//   prevState: string | undefined,
//   formData: FormData,
// ) {
//   try {
//     await signIn('credentials', formData);
//   } catch (error) {
//     if (error instanceof AuthError) {
//       switch (error.type) {
//         case 'CredentialsSignin':
//           return 'Invalid credentials.';
//         default:
//           return 'Something went wrong.';
//       }
//     }
//     throw error;
//   }
// }

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    const res = await signIn('credentials', {
      redirect: false,
      email: formData.get('email'),
      password: formData.get('password'),
    });

    if (res?.error) return 'Invalid credentials.';

    const email = formData.get("email") as string;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return 'User not found.';

    const redirectPath = user.role === 'Admin' ? '/admin' : '/home';
    return redirectPath;

  } catch (error) {
    if (error instanceof AuthError) {
      return error.type === 'CredentialsSignin'
        ? 'Invalid credentials.'
        : 'Something went wrong.';
    }
    throw error;
  }
}