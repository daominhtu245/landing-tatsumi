export type PostCategory = 'info' | 'blog' | 'event';

export type Post = {
  slug: string;
  category: PostCategory;
  date: string; // ISO
  cover: string;
  title: { ja: string; en: string };
  excerpt: { ja: string; en: string };
  body: { ja: string[]; en: string[] }; // paragraphs
};

export const posts: Post[] = [
  {
    slug: 'ikusei-shuro-2027-overview',
    category: 'blog',
    date: '2026-05-20',
    cover: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
    title: {
      ja: '【2027年施行】育成就労制度の全体像を、いま整理しておく',
      en: 'Inside Ikusei-Shuro: what changes for hiring teams in 2027'
    },
    excerpt: {
      ja: '技能実習に代わる新制度「育成就労」。受入企業が知っておくべきポイントを5分で解説。',
      en: 'The Ikusei-Shuro program replaces Technical Intern Training. Here\'s what hiring teams need to know — in five minutes.'
    },
    body: {
      ja: [
        '2027年に施行される「育成就労制度」は、これまでの技能実習制度に代わる新しい外国人材受入制度です。最大の特徴は「人材育成」と「人材確保」を両立させる設計にあります。',
        '本記事では、企業様視点で押さえておくべき変更点を5つに整理してお伝えします。',
        '①在留資格、②転籍要件、③日本語要件、④特定技能への移行パス、⑤受入機関の責任範囲——それぞれにつき、現行制度との違いをコンパクトにまとめました。'
      ],
      en: [
        'Launching in 2027, the Ikusei-Shuro program replaces Japan\'s Technical Intern Training. Its defining feature is a deliberate balance between training outcomes and workforce continuity.',
        'In this article, we organize the five things hiring teams should understand — from a company\'s point of view.',
        'Residency status, transfer requirements, Japanese-language requirements, the path into Specified Skilled Worker (SSW), and the receiving organization\'s responsibilities — each compared concisely against the current system.'
      ]
    }
  },
  {
    slug: 'vietnamese-trainees-onboarding',
    category: 'blog',
    date: '2026-05-08',
    cover: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80',
    title: {
      ja: 'ベトナム人実習生の受入初日──現場でうまくいく5つの工夫',
      en: 'Day one with Vietnamese trainees: 5 things that quietly make it work'
    },
    excerpt: {
      ja: '言葉・文化・距離。最初の1週間で生まれる小さなギャップをどう埋めるか。実際の現場からヒントを。',
      en: 'Language, culture, distance. What we learned from real sites about closing the gaps in week one.'
    },
    body: {
      ja: [
        '受入の成功は、最初の1週間で決まる──と私たちは信じています。',
        '本記事では、たつみ協同組合がサポートする現場で実際にうまくいった「5つの工夫」を共有します。',
        '①初日の朝食を一緒に、②指導員との1on1を毎週設定、③生活オリエンの3点絞り、④翻訳ツールの共通化、⑤週末アクティビティの提案。',
        'どれも特別な準備は必要ありません。「ちょっとした配慮」が、長期的な定着率を大きく変えます。'
      ],
      en: [
        'In our experience, the first week sets the trajectory for the entire placement.',
        'Here are five small habits we\'ve seen consistently work across the sites we support.',
        '1) Share breakfast on day one. 2) Schedule weekly 1:1s with the instructor. 3) Cover only three things in the life-orientation. 4) Standardize on one translation app. 5) Offer (don\'t mandate) a weekend activity in week one.',
        'None of these require special preparation. They\'re the small acts of attention that move long-term retention more than any official program ever will.'
      ]
    }
  },
  {
    slug: 'spring-orientation-2026',
    category: 'event',
    date: '2026-04-12',
    cover: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    title: {
      ja: '春の合同オリエンテーション開催レポート',
      en: 'Spring orientation 2026 — recap and photos'
    },
    excerpt: {
      ja: '受入企業様と新人実習生をお招きし、合同オリエンテーションを開催しました。',
      en: 'We welcomed partner companies and new trainees to our spring joint orientation. Recap and photos inside.'
    },
    body: {
      ja: [
        '4月の第二週、たつみ協同組合では春の合同オリエンテーションを開催しました。',
        '受入企業様12社、新人実習生48名にご参加いただき、相互理解と現場ノウハウの共有を行いました。',
        '当日の様子は Instagram にて公開しています。'
      ],
      en: [
        'In the second week of April, Tatsumi Cooperative hosted its spring joint orientation.',
        'Twelve partner companies and 48 new trainees joined us for a day of mutual introductions and shared field practices.',
        'Photos from the day are up on our Instagram.'
      ]
    }
  },
  {
    slug: 'golden-week-notice-2026',
    category: 'info',
    date: '2026-04-25',
    cover: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?auto=format&fit=crop&w=1200&q=80',
    title: {
      ja: '【お知らせ】ゴールデンウィーク中の営業日について',
      en: 'Notice: office hours during Golden Week 2026'
    },
    excerpt: {
      ja: '2026年4月29日(水)〜5月6日(水)はお休みとさせていただきます。',
      en: 'Our office will be closed Apr 29 – May 6, 2026.'
    },
    body: {
      ja: [
        '誠に勝手ながら、下記期間中は休業とさせていただきます。',
        '休業期間: 2026年4月29日(水) 〜 5月6日(水)'
      ],
      en: [
        'Please note that our office will be closed during the following period.',
        'Closed: Wednesday, April 29 – Wednesday, May 6, 2026.'
      ]
    }
  },
  {
    slug: 'manufacturing-case-study',
    category: 'blog',
    date: '2026-03-30',
    cover: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80',
    title: {
      ja: '【導入事例】愛知県・自動車部品メーカー様の成功例',
      en: 'Case study: an Aichi automotive parts manufacturer'
    },
    excerpt: {
      ja: '5年で実習生15名を受け入れた製造業現場から、定着率向上のヒントをお届けします。',
      en: 'Five years, 15 trainees, a 92% retention rate. What this auto-parts manufacturer changed — and what stayed the same.'
    },
    body: {
      ja: [
        '愛知県の自動車部品メーカーA社様は、2021年からたつみ協同組合を通じて実習生を受け入れています。',
        '5年間で計15名を受け入れ、定着率は92%。業界平均を大きく上回る数字です。',
        '本記事では、A社の現場マネージャー様への取材をもとに、その「秘密」を3つの軸から紐解きます。'
      ],
      en: [
        'An automotive parts manufacturer in Aichi began working with Tatsumi Cooperative in 2021.',
        'Over five years, they\'ve brought on 15 trainees with a 92% retention rate — well above industry average.',
        'Based on conversations with their floor manager, we break down three things they do consistently.'
      ]
    }
  },
  {
    slug: 'japanese-language-tips',
    category: 'blog',
    date: '2026-03-15',
    cover: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=1200&q=80',
    title: {
      ja: '現場の日本語、何から教える？指導員のための3ステップ',
      en: 'Site Japanese: a 3-step playbook for instructors'
    },
    excerpt: {
      ja: 'N5レベルの実習生に、現場で「使える」日本語を教えるためのコツを公開します。',
      en: 'Practical Japanese for the floor — a 3-step approach instructors can run with N5-level trainees from week one.'
    },
    body: {
      ja: [
        'JLPT N5レベルで日本に来た実習生に、現場で本当に使える日本語をどう教えるか。',
        'たつみ協同組合では、3ステップの指導法を推奨しています。',
        'Step 1: 安全に関わる10語を最優先。Step 2: ロール別の頻出フレーズ20。Step 3: 質問の作り方。',
        '詳細は本文で。'
      ],
      en: [
        'How do you teach Japanese that actually works on the floor — to trainees who arrive at JLPT N5?',
        'We recommend a three-step approach.',
        'Step 1: the 10 safety-critical words first. Step 2: 20 role-specific phrases. Step 3: how to form questions.',
        'Details inside.'
      ]
    }
  },
  {
    slug: 'open-house-may-2026',
    category: 'event',
    date: '2026-05-15',
    cover: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80',
    title: {
      ja: '【5月開催】受入企業様向けオープンハウスのご案内',
      en: 'Open House for partner companies — May 2026'
    },
    excerpt: {
      ja: '実習生の現場を見学いただける、年に一度のオープンハウス。今年は5月25日開催です。',
      en: 'Our annual on-site open house for partner companies returns on May 25.'
    },
    body: {
      ja: [
        'たつみ協同組合では年に一度、受入をご検討中の企業様を現場にお招きするオープンハウスを開催しています。',
        '2026年は5月25日(月)に開催予定。実習生との交流、配属先企業様の実体験ヒアリングなど、半日のプログラムです。',
        '参加ご希望の方は、お問い合わせフォームよりお申込みください。'
      ],
      en: [
        'Tatsumi Cooperative hosts an annual open house, inviting prospective partner companies to visit a live site.',
        'This year\'s open house is Monday, May 25, 2026 — a half-day program with trainee interactions and frank conversations with existing partner companies.',
        'To register, please reach out via the contact form.'
      ]
    }
  },
  {
    slug: 'new-license-renewal',
    category: 'info',
    date: '2026-02-10',
    cover: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80',
    title: {
      ja: '【お知らせ】監理団体許可の更新が完了しました',
      en: 'Notice: supervisory organization license has been renewed'
    },
    excerpt: {
      ja: '2026年1月、外国人技能実習機構より監理団体許可の更新を受けました。',
      en: 'In January 2026, the OTIT renewed our supervisory organization license.'
    },
    body: {
      ja: [
        'たつみ協同組合は2026年1月、外国人技能実習機構 (OTIT) より監理団体許可の更新を受けました。',
        '引き続き、企業様と実習生双方に信頼いただける運営を続けてまいります。'
      ],
      en: [
        'Tatsumi Cooperative\'s supervisory organization license was renewed by OTIT in January 2026.',
        'We remain committed to operations that earn the trust of both partner companies and trainees.'
      ]
    }
  }
];

export function getPostBySlug(slug: string) {
  return posts.find((p) => p.slug === slug);
}

export function getAllPosts() {
  return [...posts].sort((a, b) => b.date.localeCompare(a.date));
}

export function getRelatedPosts(slug: string, limit = 3) {
  const current = getPostBySlug(slug);
  if (!current) return [];
  return getAllPosts()
    .filter((p) => p.slug !== slug)
    .sort((a, b) => {
      const aSame = a.category === current.category ? 0 : 1;
      const bSame = b.category === current.category ? 0 : 1;
      return aSame - bSame;
    })
    .slice(0, limit);
}
