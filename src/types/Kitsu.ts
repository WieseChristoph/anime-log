type KitsuAnimeAttributes = {
    createdAt: string;
    updatedAt: string;
    slug: string;
    synopsis: string;
    coverImageTopOffset: number;
    titles: { en?: string; en_jp?: string; ja_jp?: string };
    canonicalTitle: string;
    abbreviatedTitles: string[];
    averageRating: string;
    ratingFrequencies: { [key: number]: string };
    userCount: number;
    favoritesCount: number;
    startDate: string;
    endDate: string;
    popularityRank: number;
    ratingRank: number;
    ageRating: "G" | "PG" | "R" | "R18";
    ageRatingGuide: string;
    subtype: "ONA" | "OVA" | "TV" | "movie" | "music" | "special";
    status: "current" | "finished" | "tba" | "unreleased" | "upcoming";
    tba: string;
    posterImage: {
        tiny: string;
        small: string;
        medium: string;
        large: string;
        original: string;
        meta: {
            dimensions: {
                tiny: {
                    width: string;
                    height: string;
                };
                small: {
                    width: string;
                    height: string;
                };
                medium: {
                    width: string;
                    height: string;
                };
                large: {
                    width: string;
                    height: string;
                };
            };
        };
    };
    coverImage: {
        tiny: string;
        small: string;
        large: string;
        original: string;
        meta: {
            dimensions: {
                tiny: {
                    width: string;
                    height: string;
                };
                small: {
                    width: string;
                    height: string;
                };
                large: {
                    width: string;
                    height: string;
                };
            };
        };
    };
    episodeCount: number;
    episodeLength: number;
    youtubeVideoId: string;
    showType: "ONA" | "OVA" | "TV" | "movie" | "music" | "special";
    nsfw: boolean;
};

type KitsuMangaAttributes = {
    createdAt: string;
    updatedAt: string;
    slug: string;
    synopsis: string;
    coverImageTopOffset: number;
    titles: { en?: string; en_jp?: string; ja_jp?: string };
    canonicalTitle: string;
    abbreviatedTitles: string[];
    averageRating: string;
    ratingFrequencies: { [key: number]: string };
    userCount: number;
    favoritesCount: number;
    startDate: string;
    endDate: string;
    popularityRank: number;
    ratingRank: number;
    ageRating: "G" | "PG" | "R" | "R18";
    ageRatingGuide: string;
    subtype: "ONA" | "OVA" | "TV" | "movie" | "music" | "special";
    status: "current" | "finished" | "tba" | "unreleased" | "upcoming";
    tba: string;
    posterImage: {
        tiny: string;
        small: string;
        medium: string;
        large: string;
        original: string;
        meta: {
            dimensions: {
                tiny: {
                    width: string;
                    height: string;
                };
                small: {
                    width: string;
                    height: string;
                };
                medium: {
                    width: string;
                    height: string;
                };
                large: {
                    width: string;
                    height: string;
                };
            };
        };
    };
    coverImage: {
        tiny: string;
        small: string;
        large: string;
        original: string;
        meta: {
            dimensions: {
                tiny: {
                    width: string;
                    height: string;
                };
                small: {
                    width: string;
                    height: string;
                };
                large: {
                    width: string;
                    height: string;
                };
            };
        };
    };
    chapterCount: number;
    volumeCount: number;
    serialization: string;
    mangaType:
        | "doujin"
        | "manga"
        | "manhua"
        | "manhwa"
        | "novel"
        | "oel"
        | "oneshot";
};

export type KitsuResponse = {
    data: {
        id: string;
        type: string;
        links: {
            self: string;
        };
        attributes: KitsuAnimeAttributes | KitsuMangaAttributes;
        relationships: unknown;
    }[];
    meta: {
        count: number;
    };
    links?: {
        first: string;
        prev?: string;
        next?: string;
        last: string;
    };
};
