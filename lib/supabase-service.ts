import { supabase } from './supabase';
import type { Content, ContentType, LanguageCode } from '@/types/content';

interface SupabaseContentText {
  id: string;
  content_id: string | null;
  language_code: string | null;
  title: string | null;
  text: string | null;
  romanization: string | null;
  translation: string | null;
  meaning: string | null;
  cultural_context: string | null;
  usage_example: string | null;
  region: string | null;
  created_at: string | null;
}

interface SupabaseContentItem {
  id: string;
  type: string | null;
  difficulty: string | null;
  popularity: number | null;
  source: string | null;
  created_at: string | null;
}

interface SupabaseLanguage {
  code: string;
  name: string | null;
  native_name: string | null;
  is_active: boolean | null;
}

interface SupabaseTag {
  id: string;
  slug: string | null;
  display_name: string | null;
}

interface SupabaseContentItemTag {
  content_id: string;
  tag_id: string;
}

function mapContentTypeFromDb(type: string | null): ContentType {
  const typeMap: Record<string, ContentType> = {
    'proverb': 'proverb',
    'idiom': 'idiom',
    'legend': 'legend',
    'myth': 'myth',
    'folk_story': 'folkStory',
    'epic': 'epic',
    'mythology_note': 'mythologyNote',
    'regional_tale': 'regionalTale',
    'meme': 'meme',
    'travel_phrase': 'travelPhrase',
    'daily_expression': 'dailyExpression',
    'trending_quote': 'trending_quote',
  };
  return typeMap[type || ''] || 'proverb';
}

function mapLanguageCode(code: string | null): LanguageCode {
  const validCodes: LanguageCode[] = ['tr', 'en', 'de', 'fr', 'es', 'it', 'pt', 'ru', 'ja', 'zh', 'ar'];
  if (code && validCodes.includes(code as LanguageCode)) {
    return code as LanguageCode;
  }
  return 'en';
}

export async function fetchAllContent(): Promise<Content[]> {
  try {
    const { data: contentTexts, error: textsError } = await supabase
      .from('content_texts')
      .select('*');

    if (textsError) {
      console.error('Error fetching content texts:', textsError);
      return [];
    }

    const { data: contentItems, error: itemsError } = await supabase
      .from('content_items')
      .select('*');

    if (itemsError) {
      console.error('Error fetching content items:', itemsError);
    }

    const { data: contentItemTags, error: tagsError } = await supabase
      .from('content_item_tags')
      .select('content_id, tag_id');

    if (tagsError) {
      console.error('Error fetching content item tags:', tagsError);
    }

    const { data: tags, error: tagListError } = await supabase
      .from('tags')
      .select('*');

    if (tagListError) {
      console.error('Error fetching tags:', tagListError);
    }

    const itemsMap = new Map<string, SupabaseContentItem>();
    (contentItems || []).forEach((item: SupabaseContentItem) => {
      itemsMap.set(item.id, item);
    });

    const tagsMap = new Map<string, string>();
    (tags || []).forEach((tag: SupabaseTag) => {
      tagsMap.set(tag.id, tag.display_name || tag.slug || '');
    });

    const contentTagsMap = new Map<string, string[]>();
    (contentItemTags || []).forEach((ct: SupabaseContentItemTag) => {
      const tagName = tagsMap.get(ct.tag_id);
      if (tagName) {
        const existing = contentTagsMap.get(ct.content_id) || [];
        existing.push(tagName);
        contentTagsMap.set(ct.content_id, existing);
      }
    });

    const contents: Content[] = (contentTexts || []).map((text: SupabaseContentText): Content => {
      const contentItem = text.content_id ? itemsMap.get(text.content_id) : null;
      const itemTags = text.content_id ? contentTagsMap.get(text.content_id) || [] : [];

      return {
        id: text.id,
        type: mapContentTypeFromDb(contentItem?.type || null),
        language: mapLanguageCode(text.language_code),
        text: text.text || text.title || '',
        translation: text.translation || undefined,
        meaning: text.meaning || undefined,
        culturalContext: text.cultural_context || undefined,
        tags: itemTags,
        region: text.region || undefined,
        popularity: contentItem?.popularity || 50,
        favoritesCount: 0,
        commentsCount: 0,
        rating: 4.5,
        relatedContent: [],
        createdAt: text.created_at || new Date().toISOString(),
        updatedAt: text.created_at || new Date().toISOString(),
      };
    });

    return contents;
  } catch (error) {
    console.error('Error in fetchAllContent:', error);
    return [];
  }
}

export async function fetchContentByLanguage(language: LanguageCode): Promise<Content[]> {
  const allContent = await fetchAllContent();
  return allContent.filter(c => c.language === language);
}

export async function fetchContentByType(type: ContentType): Promise<Content[]> {
  const allContent = await fetchAllContent();
  return allContent.filter(c => c.type === type);
}

export async function fetchLanguages(): Promise<{ code: string; name: string; nativeName: string }[]> {
  try {
    const { data, error } = await supabase
      .from('languages')
      .select('*')
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching languages:', error);
      return [];
    }

    return (data || []).map((lang: SupabaseLanguage) => ({
      code: lang.code,
      name: lang.name || lang.code,
      nativeName: lang.native_name || lang.name || lang.code,
    }));
  } catch (error) {
    console.error('Error in fetchLanguages:', error);
    return [];
  }
}

export async function fetchTags(): Promise<{ id: string; slug: string; displayName: string }[]> {
  try {
    const { data, error } = await supabase
      .from('tags')
      .select('*');

    if (error) {
      console.error('Error fetching tags:', error);
      return [];
    }

    return (data || []).map((tag: SupabaseTag) => ({
      id: tag.id,
      slug: tag.slug || '',
      displayName: tag.display_name || tag.slug || '',
    }));
  } catch (error) {
    console.error('Error in fetchTags:', error);
    return [];
  }
}
