// middleware.js
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export async function middleware(req) {
    const url = req.nextUrl.clone();

    // Cache API responses at edge
    if (url.pathname.startsWith('/api/convert')) {
        const key = await generateRequestHash(req);
        const { data } = await supabase
            .from('conversion_cache')
            .select('result')
            .eq('key', key)
            .single();

        if (data) {
            return NextResponse.json(JSON.parse(data.result));
        }
    }

    return NextResponse.next();
}
