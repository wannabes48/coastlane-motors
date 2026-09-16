const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkViews() {
  const { data, error } = await supabase
    .from('vehicles')
    .select('slug, views')
    .order('views', { ascending: false });
    
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('All views:');
    console.table(data);
  }
}

checkViews();
