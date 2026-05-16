import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function SuperAdminLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
        redirect('/login');
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

    if (!profile || profile.role !== 'super_admin') {
        redirect('/login');
    }

    return (
        <div className="flex min-h-screen bg-neutral-100">
            {children}
        </div>
    );
}
