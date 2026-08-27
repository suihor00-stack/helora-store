/**
 * 從 Supabase 讀商品。
 * 商品在 HELORA 後台管理（helora.suihor00.workers.dev/admin），同一個資料庫。
 * 這兩個值本來就是公開的，真正保護資料的是資料庫的 RLS。
 * 絕對不要把 sb_secret_ 開頭的鑰匙放進來。
 */

const SUPABASE_URL = 'https://ezhcfpuhxwncukzktaeh.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Bfqp2LmEcHTq38MG-fCfBw_Wc76IiHw';

/** 資料庫分類代號 → 網站上的分類名稱（其他分類會歸到 All pieces） */
const CATEGORY_NAMES: Record<string, string> = {
  necklaces: 'Necklaces',
  earrings: 'Earrings',
  rings: 'Rings',
};

/** 沒勾分類時，用商品的「類型」當後備 */
const KIND_NAMES: Record<string, string> = {
  ring: 'Rings',
  earrings: 'Earrings',
};

export type StoreProduct = {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  tone: string;
  note: string;
  detail: string;
  featured?: boolean;
};

type Row = {
  id: string;
  name: string;
  description: string | null;
  tag: string | null;
  price_cents: number | null;
  kind: string | null;
  is_pick: boolean | null;
  custom: Record<string, string> | null;
  product_images: { url: string; sort_order: number }[] | null;
  product_collections: { collection_slug: string }[] | null;
};

function toProduct(row: Row, fallbackImage: string): StoreProduct {
  const images = (row.product_images ?? [])
    .slice()
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  // 一件商品可能同時勾了「戒指」和「送禮」，順序不保證，
  // 所以挑出第一個網站認得的分類，不能直接拿第 0 個。
  const slugs = (row.product_collections ?? []).map((c) => c.collection_slug);
  const matched = slugs.find((s) => s in CATEGORY_NAMES);
  const category =
    (matched && CATEGORY_NAMES[matched]) ??
    KIND_NAMES[row.kind ?? ''] ??
    'All pieces';

  const custom = row.custom ?? {};

  return {
    id: row.id,
    name: row.name,
    category,
    price: (row.price_cents ?? 0) / 100,
    image: images[0]?.url ?? fallbackImage,
    // 商品卡上那行小字，例如「14k recycled gold · freshwater pearl」
    tone: [custom.material, custom.finish].filter(Boolean).join(' · ') || (row.tag ?? ''),
    note: row.tag ?? '',
    detail: row.description ?? '',
    featured: row.is_pick ?? false,
  };
}

/** 讀不到就回空陣列 —— 呼叫端會保留原本寫死的商品，網站不會變空白。 */
export async function fetchProducts(fallbackImage: string): Promise<StoreProduct[]> {
  const query =
    'products?select=id,name,description,tag,price_cents,kind,is_pick,custom,' +
    'product_images(url,sort_order),product_collections(collection_slug)' +
    '&is_active=eq.true&order=sort_order.asc,created_at.desc&limit=48';

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${query}`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    });
    if (!res.ok) return [];
    const rows: Row[] = await res.json();
    return rows.map((row) => toProduct(row, fallbackImage));
  } catch {
    return [];
  }
}
