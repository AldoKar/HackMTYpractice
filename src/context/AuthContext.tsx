// filepath: src/context/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthContextType {
    user: User | null
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({ 
    user: null,
    logout: async () => {}
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            setUser(session?.user ?? null)
        }
        getSession()

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [])

    const logout = async () => {
        await supabase.auth.signOut()
        setUser(null)
    }

    return <AuthContext.Provider value={{ user, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)