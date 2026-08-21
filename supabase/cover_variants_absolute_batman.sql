-- Variantes confirmadas nas páginas e anúncios oficiais da DC.
-- Execute depois de supabase/schema.sql no SQL Editor do Supabase.

insert into public.comic_cover_variants (item_id, variant_key, label, cover_url, source_url)
values
  ('absolute-batman-001', 'jim-lee', 'Jim Lee', 'https://static.dc.com/2024-08/ABS_BM_CV1_JIM-LEE-VARIANT.jpg', 'https://www.dc.com/blog/2024/08/22/new-absolute-dc-cover-art-and-logos-are-revealed'),
  ('absolute-batman-001', 'mitch-gerads', 'Mitch Gerads', 'https://static.dc.com/2024-08/ABSOLUTE-BATMAN-Cv1-OTO-variant-Mitch-Gerads.jpg', 'https://www.dc.com/blog/2024/08/22/new-absolute-dc-cover-art-and-logos-are-revealed'),
  ('absolute-batman-001', 'wes-craig', 'Wes Craig e Mike Spicer', 'https://static.dc.com/2024-08/ABSOLUTE-BATMAN-Cv1-OTO-variant-Wes-Craig.jpg', 'https://www.dc.com/blog/2024/08/22/new-absolute-dc-cover-art-and-logos-are-revealed'),
  ('absolute-batman-001', 'ian-bertram', 'Ian Bertram', 'https://static.dc.com/2024-08/ABSOLUTE-BATMAN-Cv1-1_25-variant-Ian-Bertram.jpg', 'https://www.dc.com/blog/2024/08/22/new-absolute-dc-cover-art-and-logos-are-revealed'),
  ('absolute-batman-006', 'frank-quitely', 'Frank Quitely', 'https://static.dc.com/2024-12/AB06_Cvr_Var_Frank%20Quitely.jpeg', 'https://www.dc.com/blog/2024/12/17/absolute-batman-6-batman-s-showdown-against-black-mask-and-his-party-animals-arrives-this-march'),
  ('absolute-batman-006', 'simon-bisley', 'Simon Bisley', 'https://static.dc.com/2024-12/ABM06_Cvr_Var_Simon%20Bisley.jpeg', 'https://www.dc.com/blog/2024/12/17/absolute-batman-6-batman-s-showdown-against-black-mask-and-his-party-animals-arrives-this-march'),
  ('absolute-batman-006', 'john-mccrea', 'John McCrea', 'https://static.dc.com/2024-12/ABM06_Cvr_Var_John%20McCrea.jpeg', 'https://www.dc.com/blog/2024/12/17/absolute-batman-6-batman-s-showdown-against-black-mask-and-his-party-animals-arrives-this-march'),
  ('absolute-batman-006', 'alex-maleev', 'Alex Maleev', 'https://static.dc.com/2024-12/ABM06_Cvr_Var_Alex%20Maleev.jpg', 'https://www.dc.com/blog/2024/12/17/absolute-batman-6-batman-s-showdown-against-black-mask-and-his-party-animals-arrives-this-march')
on conflict (item_id, variant_key) do update
set label = excluded.label,
    cover_url = excluded.cover_url,
    source_url = excluded.source_url;
