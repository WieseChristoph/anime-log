type JikanMalReference = {
    mal_id: number;
    type: string;
    name: string;
    url: string;
};

export type JikanAnime = {
    mal_id: number;
    url: string;
    images: {
        jpg: {
            image_url: string;
            small_image_url: string;
            large_image_url: string;
        };
        webp: {
            image_url: string;
            small_image_url: string;
            large_image_url: string;
        };
    };
    trailer: { youtube_id: string; url: string; embed_url: string };
    approved: boolean;
    titles: {
        type: string;
        title: string;
    }[];
    title: "TV" | "OVA" | "Movie" | "Special" | "ONA" | "Music";
    title_english: string;
    title_japanese: string;
    title_synonyms: string[];
    type: string;
    source: string;
    episodes: number;
    status: "Finished Airing" | "Currently Airing" | "Not yet aired";
    airing: boolean;
    aired: {
        from: string;
        to: string;
        prop: {
            from: {
                day: number;
                month: number;
                year: number;
            };
            to: {
                day: number;
                month: number;
                year: number;
            };
            string: string;
        };
    };
    duration: string;
    rating:
        | "G - All Ages"
        | "PG - Children"
        | "PG-13 - Teens 13 or older"
        | "R - 17+ (violence & profanity)"
        | "R+ - Mild Nudity"
        | "Rx - Hentai";
    score: number;
    scored_by: number;
    rank: number;
    popularity: number;
    members: number;
    favorites: number;
    synopsis: string;
    background: string;
    season: "summer" | "winter" | "spring" | "fall";
    year: number;
    broadcast: {
        day: string;
        time: string;
        timezone: string;
        string: string;
    };
    producers: JikanMalReference[];
    licensors: JikanMalReference[];
    studios: JikanMalReference[];
    genres: JikanMalReference[];
    explicit_genres: JikanMalReference[];
    themes: JikanMalReference[];
    demographics: JikanMalReference[];
};

export type JikanResponse = {
    data: JikanAnime[];
    pagination: {
        last_visible_page: number;
        has_next_page: boolean;
        items: {
            count: number;
            total: number;
            per_page: number;
        };
    };
};
